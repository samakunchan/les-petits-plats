import { Category, getError, getJson } from '../utils/utils.js';
import { RecipeModel } from '../models/recipe-model.js';
import { FilterBuilder } from '../utils/filter-builder.js';

export class RecipesRepository {
  constructor() {
    this.resultsRecipes = [];
  }

  /**
   * Datas
   * @return {Promise<Response | RecipeModel[]>}
   */
  async getRecipes() {
    return await fetch('datas/recipes.json')
      .then(getJson)
      .then((record) => {
        this.resultsRecipes = record.map((record) => new RecipeModel(record));
        return this.resultsRecipes;
      })
      .catch(getError);
  }

  /**
   * @param search {string | string[]}
   * @return {Promise<Response | Record[]>}
   */
  async getRecipesWithSearch(search) {
    return await fetch('datas/recipes.json')
      .then(getJson)
      .then((datas) => this._searchRecipes(datas, search))
      .catch(getError);
  }

  /**
   * @param resultsRecipes {RecipeModel[]}
   * @param ingredientsRequire {FilterModel[]}
   * @return {Record[]}
   */
  getRecipesFilteredWithTag(resultsRecipes, ingredientsRequire) {
    this.resultsRecipes = resultsRecipes;
    const resultsWithTwoFilter = new FilterBuilder(this.resultsRecipes);
    ingredientsRequire.forEach((_, index) => {
      this.buildRecipesWithFilter(ingredientsRequire, resultsWithTwoFilter, index);
    });

    return resultsWithTwoFilter.resultsRecipes;
  }

  /**
   * @param ingredientsRequire {FilterModel[]}
   * @param builder {FilterBuilder}
   * @param index {number}
   * @return {RecipeModel[]}
   */
  buildRecipesWithFilter(ingredientsRequire, builder, index) {
    if (ingredientsRequire[index].category === Category.ingredients) {
      return builder.withIngredientsFilter(ingredientsRequire);
    } else if (ingredientsRequire[index].category === Category.appliance) {
      return builder.withApplianceFilter(ingredientsRequire, index);
    } else if (ingredientsRequire[index].category === Category.ustensils) {
      return builder.withUstensilsFilter(ingredientsRequire, index);
    } else {
      return [];
    }
  }

  /**
   * @return {Promise<string[]>}
   */
  async gatherAllAppliances() {
    return this.getRecipes().then(this._getAppliances).catch(getError);
  }

  /**
   * @return {Promise<string[]>}
   */
  async gatherAllIngredients() {
    return this.getRecipes().then(this._getIngredients).catch(getError);
  }

  /**
   * @return {Promise<string[]>}
   */
  async gatherAllUstensils() {
    return this.getRecipes().then(this._getUstensils).catch(getError);
  }

  /**
   * @param recipes {RecipeModel[]}
   * @return {string[]}
   * @private
   */
  _getAppliances(recipes) {
    return recipes.map((recipe) => recipe.appliance).filter((value, index, self) => self.indexOf(value) === index);
  }

  /**
   * @param recipes {RecipeModel[]}
   * @return {string[]}
   * @private
   */
  _getIngredients(recipes) {
    return recipes
      .map((recipe) => recipe.ingredients.map(({ ingredient }) => ingredient))
      .reduce((a, b) => a.concat(b), [])
      .filter((recipe, index, self) => self.indexOf(recipe) === index);
  }

  /**
   * @param recipes {RecipeModel[]}
   * @return {string[]}
   * @private
   */
  _getUstensils(recipes) {
    return recipes
      .map((recipe) => recipe[Category.ustensils])
      .reduce((a, b) => a.concat(b), [])
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  /**
   * @param recipes {RecipeModel[]}
   * @param search {string}
   * @return {RecipeModel[]}
   * @private
   */
  _searchRecipes(recipes, search) {
    const keywords = new RegExp(search, 'i');

    this.resultsRecipes = recipes
      .map((record) => new RecipeModel(record))
      .filter(
        (recipe) =>
          recipe.name.match(keywords) ||
          recipe.description.match(keywords) ||
          recipe.ingredients.some((ing) => this._matchIngredients(ing, keywords)),
      );

    return this.resultsRecipes;
  }

  _matchIngredients(ing, keywords) {
    return ing[Category.ingredient].match(keywords);
  }
}
