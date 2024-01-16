import { Category } from './utils.js';

export class FilterBuilder {
  constructor(resultsRecipes) {
    this.resultsRecipes = resultsRecipes;
  }

  /**
   * @param ingredientsRequire {FilterModel[]}
   * @return {FilterBuilder}
   */
  withIngredientsFilter(ingredientsRequire) {
    this.resultsRecipes = this.resultsRecipes.filter((recipe) => {
      const ingredients = recipe.ingredients.map(({ ingredient }) => ingredient);

      return ingredientsRequire.every((filter) => {
        switch (true) {
          case filter.category === Category.appliance:
            return filter.name === recipe.appliance;
          case filter.category === Category.ingredients:
            return ingredients.includes(filter.name);
          case filter.category === Category.ustensils:
            return recipe.ustensils.includes(filter.name);
          default:
            return false;
        }
      });
    });

    return this;
  }

  /**
   * @param ingredientsRequire {FilterModel[]}
   * @param index {number}
   * @return {FilterBuilder}
   */
  withApplianceFilter(ingredientsRequire, index) {
    this.resultsRecipes = this.resultsRecipes.filter((recipe) => recipe.appliance === ingredientsRequire[index].name);
    return this;
  }

  /**
   * @param ingredientsRequire {FilterModel[]}
   * @param index {number}
   * @return {FilterBuilder}
   */
  withUstensilsFilter(ingredientsRequire, index) {
    this.resultsRecipes = this.resultsRecipes.filter((recipe) =>
      recipe.ustensils.includes(ingredientsRequire[index].name),
    );
    return this;
  }
}
