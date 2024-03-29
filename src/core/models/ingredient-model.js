import { unitsMeasure } from '../utils/utils.js';

export class IngredientModel {
  constructor(data) {
    const { ingredient, quantity, unit } = data;
    this._ingredient = ingredient;
    this._quantity = quantity;
    this._unit = unit;
  }

  /**
   * @return {string}
   */
  get ingredient() {
    return this._ingredient.ucFirst();
  }

  /**
   * @return {number}
   */
  get quantity() {
    return this._quantity;
  }

  /**
   * @return {string}
   */
  get unit() {
    if (this._unit === `grammes`) this._unit = `g`;
    return unitsMeasure.includes(this._unit) ? `${this._unit}` : ` ${this._unit}`;
  }

  /**
   * @return {string}
   */
  get quantityText() {
    switch (true) {
      case this._unit !== undefined && this._quantity !== undefined:
        return `${this.quantity}${this.unit}`;
      case this._quantity !== undefined:
        return `${this.quantity}`;
      default:
        return ``;
    }
  }
}
