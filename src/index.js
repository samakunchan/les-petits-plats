import { RecipesRepository } from './core/repositories/recipes-repository.js';
import { RecipesServices } from './components/services/recipes-services.js';
import { FiltersService } from './components/services/filters-service.js';
import { TagService } from './components/services/tag-service.js';
import { FilterModel } from './core/models/filter-model.js';
import { Category } from './core/utils/utils.js';

class App {
  constructor() {
    this._recipeRepository = new RecipesRepository();
    this._recipesServices = new RecipesServices();
    new FiltersService();
    this._tagsServices = new TagService();
    this.launchApp();
    this._ingredientsRequire = [];
    this._selectedCheckboxResults = [];
  }

  launchApp() {
    this.firstRender();
    this.listenSearch();
    this.listenFilterIngredients();
    this.listenFilterAppliances();
    this.listenFilterUstensils();
  }

  firstRender() {
    window.addEventListener('DOMContentLoaded', async () => {
      const recipes = await this._recipeRepository.getRecipes();
      this._recipesServices.recipesToDOM(recipes);

      const ingredients = await this._recipeRepository.gatherAllIngredients();
      const appareils = await this._recipeRepository.gatherAllAppliances();
      const ustensils = await this._recipeRepository.gatherAllUstensils();
      this._recipesServices.filtersToDOM(ingredients, Category.ingredients, 0);
      this._recipesServices.filtersToDOM(appareils, 'appareils', 1);
      this._recipesServices.filtersToDOM(ustensils, Category.ustensils, 2);

      const total = document.createElement('h3');
      total.textContent = `${recipes.length <= 1 ? `${recipes.length} recette` : `${recipes.length} recettes`}`;

      document.querySelector(`.row-total`).appendChild(total);

      this.listenFiltersAndCreateTags();
    });
  }

  listenSearch() {
    document.getElementById('search').addEventListener('input', async (event) => {
      await this._recipeRepository.getRecipesWithSearch(event.target.value);
      await this._recipeRepository.gatherAllIngredients(this._recipeRepository.resultsRecipes);
      await this._recipeRepository.gatherAllAppliances(this._recipeRepository.resultsRecipes);
      await this._recipeRepository.gatherAllUstensils(this._recipeRepository.resultsRecipes);
      this.reBuildIngredientsToDOM();
      this.reBuildAppliancesToDOM();
      this.reBuildUstensilsToDOM();
      this.listenFiltersAndCreateTags();
      this.reBuildRecipesToDOM();
    });
  }

  listenFiltersAndCreateTags() {
    const checkboxes = [...document.querySelectorAll('input[type="checkbox"]')].filter(
      (box, index, self) => self.indexOf(box) === index,
    );

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', async () => {
        if (checkbox.checked) {
          if (this._recipeRepository.resultsRecipes.length === 0) {
            await this._recipeRepository.getRecipes();
          }

          if (!this._selectedCheckboxResults.includes(checkbox)) {
            if (!this._selectedCheckboxResults.includes(checkbox.id)) {
              this._selectedCheckboxResults.push(checkbox.id);
              this._tagsServices.addTag(checkbox.parentNode.lastChild.textContent, checkbox.id);
              const categoryFilter = checkbox.parentNode.lastChild.getAttribute('for').split('-')[0];
              const category = categoryFilter === 'appareils' ? Category.appliance : categoryFilter;
              const filterModel = new FilterModel({
                category: category,
                name: checkbox.parentNode.lastChild.textContent,
              });

              this._ingredientsRequire.push(filterModel);
              this.reBuildRecipesToDOM();
            }
          }
        } else {
          const tag = checkbox.parentNode.lastChild.textContent;
          const indexToRemove = this._selectedCheckboxResults.indexOf(checkbox.id);
          if (indexToRemove !== -1) {
            this._selectedCheckboxResults.splice(indexToRemove, 1);

            this._tagsServices.removeTag(tag);
            const indexIngredient = this._ingredientsRequire.findIndex((ingredient) => ingredient.name === tag);

            this._ingredientsRequire.splice(indexIngredient, 1);
            this.reBuildRecipesToDOM();
          }
        }
        this.listenTags();
      });
    });
  }

  listenFilterIngredients() {
    document.getElementById('searchIngredient').addEventListener('input', async (event) => {
      await this._recipeRepository.gatherAllIngredientsWithSearch(event.target.value);
      this.reBuildIngredientsToDOM();
      this.listenFiltersAndCreateTags();
    });
  }

  listenFilterAppliances() {
    document.getElementById('searchAppareil').addEventListener('input', async (event) => {
      await this._recipeRepository.gatherAllAppliancesWithSearch(event.target.value);
      this.reBuildAppliancesToDOM();
      this.listenFiltersAndCreateTags();
    });
  }

  listenFilterUstensils() {
    document.getElementById('searchUstensile').addEventListener('input', async (event) => {
      await this._recipeRepository.gatherAllUstensilsWithSearch(event.target.value);
      this.reBuildUstensilsToDOM();
      this.listenFiltersAndCreateTags();
    });
  }

  listenTags() {
    const tags = [...document.getElementsByClassName('tag')];
    tags.forEach((tag) => {
      document.getElementById(tag.getElementsByTagName('img')[0].id).addEventListener('click', () => {
        const checkboxToRemove = tag
          .getElementsByTagName('img')[0]
          .id.split('-')
          .filter((_, index) => index !== 0)
          .join('-');
        const indexToRemoveTheCheckbox = this._selectedCheckboxResults.indexOf(checkboxToRemove);
        document.getElementById(checkboxToRemove).checked = false;

        if (indexToRemoveTheCheckbox !== -1) {
          this._selectedCheckboxResults.splice(indexToRemoveTheCheckbox, 1);

          this._tagsServices.removeTag(tag.textContent);
          const indexIngredient = this._ingredientsRequire.findIndex((ingredient) => ingredient.name === tag);

          this._ingredientsRequire.splice(indexIngredient, 1);
          this.reBuildRecipesToDOM();
        }
      });
    });
  }

  reBuildRecipesToDOM() {
    const recipesFiltered = this._recipeRepository.getRecipesFiltered(
      this._recipeRepository.resultsRecipes,
      this._ingredientsRequire.filter((filterModel, index, self) => self.indexOf(filterModel) === index),
    );

    this._recipesServices.recipesToDOM(recipesFiltered);

    document.querySelector(`.row-total`).removeChild(document.querySelector(`.row-total`).firstChild);
    const total = document.createElement('h3');

    total.textContent = `${
      recipesFiltered.length <= 1 ? `${recipesFiltered.length} recette` : `${recipesFiltered.length} recettes`
    }`;
    document.querySelector(`.row-total`).appendChild(total);
  }

  reBuildIngredientsToDOM() {
    this._recipesServices.filtersToDOM(this._recipeRepository.resultsIngredients, Category.ingredients, 0);
  }

  reBuildAppliancesToDOM() {
    this._recipesServices.filtersToDOM(this._recipeRepository.resultsAppliances, Category.appliance, 1);
  }

  reBuildUstensilsToDOM() {
    this._recipesServices.filtersToDOM(this._recipeRepository.resultsUstensils, Category.ustensils, 2);
  }
}

new App();
