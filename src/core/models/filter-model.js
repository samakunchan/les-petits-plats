export class FilterModel {
  constructor(data) {
    const { category, name } = data;
    this._category = category;
    this._name = name;
  }

  /**
   * @return {string}
   */
  get category() {
    return this._category;
  }

  /**
   * @return {string}
   */
  get name() {
    return this._name;
  }
}
