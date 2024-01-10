import { IngredientModel } from './ingredient-model.js';
import { maximumIngredientsToShow, noIngredient } from '../utils/utils.js';

export class RecipeModel {
  constructor(recipe) {
    const { id, image, name, servings, ingredients, time, description, appliance, ustensils } = recipe;
    this._id = id;
    this._image = image;
    this._name = name;
    this._servings = servings;
    this._ingredients = ingredients;
    this._time = time;
    this._description = description;
    this._appliance = appliance;
    this._ustensils = ustensils;
  }

  /**
   * @return {number}
   */
  get id() {
    return this._id;
  }

  /**
   * @return {string}
   */
  get image() {
    return `assets/images/recettes/${this._image}`;
  }

  /**
   * @return {string}
   */
  get name() {
    return this._name;
  }

  /**
   * @return {number}
   */
  get servings() {
    return this._servings;
  }

  /**
   * @return {IngredientModel[]}
   */
  get ingredients() {
    if (this._ingredients.length < maximumIngredientsToShow) {
      const missingBlockTotal = maximumIngredientsToShow - this._ingredients.length;
      for (let i = 0; i < missingBlockTotal; i++) {
        this._ingredients.push({ ingredient: noIngredient });
      }
    }
    return this._ingredients.map((ingredient) => new IngredientModel(ingredient));
  }

  /**
   * @return {string}
   */
  get time() {
    return `${this._time}min`;
  }

  /**
   * @return {string}
   */
  get description() {
    return `${this._description.length > 250 ? `${this._description.slice(0, 250)}...` : `${this._description}`}`;
  }

  /**
   * @return {string}
   */
  get appliance() {
    return this._appliance;
  }

  /**
   * @return {string[]}
   */
  get ustensils() {
    return this._ustensils;
  }
}
