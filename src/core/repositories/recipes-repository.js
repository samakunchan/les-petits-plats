import { getError, getJson } from '../utils/utils.js';

export class RecipesRepository {
  /**
   * Datas
   * @return {Promise<Response | Record[]>}
   */
  async getRecipes() {
    return await fetch('datas/recipes.json')
      .then(getJson)
      .catch(getError);
  }

  /**
   * Datas
   * @return {Promise<Response | Record[]>}
   */
  async getRecipesFiltered(search) {
    return await fetch('datas/recipes.json')
      .then(getJson)
      .then(datas => this._filterRecipes(datas, search))
      .catch(getError);
  }

  /**
   * @return {Promise<string[]>}
   */
  async gatherAllAppliances() {
    return this.getRecipes()
      .then(this._getAppliances)
      .catch(getError);
  }

  /**
   * @return {Promise<string[]>}
   */
  async gatherAllIngredients() {
    return this.getRecipes()
      .then(this._getIngredients)
      .catch(getError);
  }

  /**
   * @return {Promise<string[]>}
   */
  async gatherAllUstensils() {
    return this.getRecipes()
      .then(this._getUstensils)
      .catch(getError);
  }

  /**
   * @param json
   * @return {string[]}
   * @private
   */
  _getAppliances(json) {
    return [...new Set(json.map((data) => data[`appliance`]))];
  }

  /**
   * @param json
   * @return {string[]}
   * @private
   */
  _getIngredients(json) {
    return [
      ...new Set(
        json.map((data) => data[`ingredients`].map(({ ingredient }) => ingredient)).reduce((a, b) => a.concat(b), []),
      ),
    ];
  }

  /**
   * @param json
   * @return {string[]}
   * @private
   */
  _getUstensils(json) {
    return [...new Set(json.map((data) => data['ustensils']).reduce((a, b) => a.concat(b), []))];
  }

  /**
   * @param datas
   * @param search
   * @return {Record[]}
   * @private
   */
  _filterRecipes(datas, search) {
    const keywords = new RegExp(search, 'i');

    return datas.filter(data =>
      data['name'].match(keywords) ||
      data['description'].match(keywords) ||
      data['appliance'].match(keywords) ||
      data['ingredients'].some(ing => this._matchIngredients(ing, keywords))
    );
  }

  /**
   * @param ing
   * @param keywords
   * @return {RegExpMatchArray}
   * @private
   */
  _matchIngredients(ing, keywords) {
    return ing['ingredient'].match(keywords);
  }
}
