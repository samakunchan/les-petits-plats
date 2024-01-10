import { RecipeModel } from './core/models/recipe-model.js';
import { RecipesRepository } from './core/repositories/recipes-repository.js';
import { RecipesServices } from './components/services/recipes-services.js';

class App {
  constructor() {
    this._recipeRepository = new RecipesRepository();
    this._recipesServices = new RecipesServices();
    this.launchApp();
  }

  launchApp() {
    this.firstRender();
    this.listenSearch();
  }

  firstRender() {
    window.addEventListener('DOMContentLoaded', async () => {
      const recipes = await this._recipeRepository.getRecipes();
      const recipesObject = recipes.map((recipe) => new RecipeModel(recipe));

      this._recipesServices.getRecipesDOM(recipesObject);

      const total = document.createElement('h3');
      total.textContent = `${recipes.length <= 1 ? `${recipes.length} recette` : `${recipes.length} recettes`}`;

      document.querySelector(`.row-total`).appendChild(total);
    })
  }

  listenSearch() {
    document.getElementById('search').addEventListener('input', async (event)  =>  {
      const recipesFiltered = await this._recipeRepository.getRecipesFiltered(event.target.value);
      const recipesObjectFiltered = recipesFiltered.map((recipeFiltered) => new RecipeModel(recipeFiltered));

      this._recipesServices.getRecipesDOM(recipesObjectFiltered);

      document.querySelector(`.row-total`).removeChild(document.querySelector(`.row-total`).firstChild);
      const total = document.createElement('h3');

      total.textContent = `${
        recipesFiltered.length <= 1 ? `${recipesFiltered.length} recette` : `${recipesFiltered.length} recettes`
      }`;
      document.querySelector(`.row-total`).appendChild(total);
    });
  }
}

new App();
