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
    this._filtersServices = new FiltersService();
    this._tagsServices = new TagService();
    this.launchApp();
    this._ingredientsRequire = [];
  }

  launchApp() {
    this.firstRender();
    this.listenSearch();
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

      this.listenToTag();
    });
  }

  listenSearch() {
    document.getElementById('search').addEventListener('input', async (event) => {
      await this._recipeRepository.getRecipesWithSearch(event.target.value);
      this.buildDOM();
    });
  }

  listenToTag() {
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener('change', async () => {
        if (checkbox.checked) {
          if (this._recipeRepository.resultsRecipes.length === 0) {
            await this._recipeRepository.getRecipes();
          }
          this._tagsServices.addTag(checkbox.parentNode.lastChild.textContent);

          const categoryFilter = checkbox.parentNode.lastChild.getAttribute('for').split('-')[0];
          const category = categoryFilter === 'appareils' ? Category.appliance : categoryFilter;
          const filterModel = new FilterModel({
            category: category,
            name: checkbox.parentNode.lastChild.textContent,
          });

          this._ingredientsRequire.push(filterModel);
          this.buildDOM();
        } else {
          const tag = checkbox.parentNode.lastChild.textContent;
          this._tagsServices.removeTag(tag);
          const indexIngredient = this._ingredientsRequire.findIndex((ingredient) => ingredient.name === tag);

          this._ingredientsRequire.splice(indexIngredient, 1);
          this.buildDOM();
        }
      });
    });
  }

  buildDOM() {
    const recipesFiltered = this._recipeRepository.getRecipesFilteredWithTag(
      this._recipeRepository.resultsRecipes,
      this._ingredientsRequire,
    );

    this._recipesServices.recipesToDOM(recipesFiltered);

    document.querySelector(`.row-total`).removeChild(document.querySelector(`.row-total`).firstChild);
    const total = document.createElement('h3');

    total.textContent = `${
      recipesFiltered.length <= 1 ? `${recipesFiltered.length} recette` : `${recipesFiltered.length} recettes`
    }`;
    document.querySelector(`.row-total`).appendChild(total);
  }
}

new App();
