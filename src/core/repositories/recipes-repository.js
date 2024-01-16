import { Category, getError, getJson } from '../utils/utils.js';
import { RecipeModel } from '../models/recipe-model.js';
import { FilterBuilder } from '../utils/filter-builder.js';

export class RecipesRepository {
  constructor() {
    this.resultsRecipes = [];
    this.resultsIngredients = [];
    this.resultsAppliances = [];
    this.resultsUstensils = [];
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
  getRecipesFiltered(resultsRecipes, ingredientsRequire) {
    this.resultsRecipes = resultsRecipes;

    const resultsWithTwoFilter = new FilterBuilder(this.resultsRecipes);
    ingredientsRequire.forEach((_, index) => {
      this._buildRecipesWithFilter(ingredientsRequire, resultsWithTwoFilter, index);
    });

    return resultsWithTwoFilter.resultsRecipes;
  }

  /**
   * @return {Promise<string[]>}
   */
  async gatherAllIngredients() {
    this.resultsIngredients = this._getIngredients(this.resultsRecipes);
    return this.resultsIngredients;
  }

  /**
   * @param search {string}
   * @return {Promise<string[] | string>}
   */
  async gatherAllIngredientsWithSearch(search) {
    this.resultsIngredients = this._getIngredients(this.resultsRecipes);
    return this._searchIngredients(this.resultsIngredients, search);
  }

  /**
   * @return {Promise<string[]>}
   */
  async gatherAllAppliances() {
    this.resultsAppliances = this._getAppliances(this.resultsRecipes);
    return this.resultsAppliances;
  }

  /**
   * @param search {string}
   * @return {Promise<string[] | string>}
   */
  async gatherAllAppliancesWithSearch(search) {
    this.resultsAppliances = this._getAppliances(this.resultsRecipes);
    return this._searchAppliances(this.resultsAppliances, search);
  }

  /**
   * @return {Promise<string[]>}
   */
  async gatherAllUstensils() {
    this.resultsUstensils = this._getUstensils(this.resultsRecipes);
    return this.resultsUstensils;
  }

  /**
   * @param search {string}
   * @return {Promise<string[] | string>}
   */
  async gatherAllUstensilsWithSearch(search) {
    this.resultsUstensils = this._getUstensils(this.resultsRecipes);
    return this._searchUstensils(this.resultsUstensils, search);
  }

  /**
   * @param ingredientsRequire {FilterModel[]}
   * @param builder {FilterBuilder}
   * @param index {number}
   * @return {RecipeModel[]}
   */
  _buildRecipesWithFilter(ingredientsRequire, builder, index) {
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
  _getAppliances(recipes) {
    return recipes.map((recipe) => recipe.appliance).filter((value, index, self) => self.indexOf(value) === index);
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

  /**
   * @param ingredients {string[]}
   * @param search {string}
   * @private
   */
  _searchIngredients(ingredients, search) {
    const keywords = new RegExp(search, 'i');

    this.resultsIngredients = ingredients.filter((ingredient) => ingredient.match(keywords));

    return this.resultsIngredients;
  }

  /**
   * @param appliances {string[]}
   * @param search {string}
   * @private
   */
  _searchAppliances(appliances, search) {
    const keywords = new RegExp(search, 'i');

    this.resultsAppliances = appliances.filter((appliance) => appliance.match(keywords));

    return this.resultsAppliances;
  }

  /**
   * @param ustensils {string[]}
   * @param search {string}
   * @private
   */
  _searchUstensils(ustensils, search) {
    const keywords = new RegExp(search, 'i');

    this.resultsUstensils = ustensils.filter((ustensil) => ustensil.match(keywords));

    return this.resultsUstensils;
  }

  /**
   * @param ing
   * @param keywords
   * @return {*}
   * @private
   */
  _matchIngredients(ing, keywords) {
    return ing[Category.ingredient].match(keywords);
  }
}
