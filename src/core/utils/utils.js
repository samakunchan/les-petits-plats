export const errorMessage = `Une érreur est survenue lors du téléchargement du fichier JSON`;
export const noIngredient = `Pas d'ingredient`;

export const maximumIngredientsToShow = 6;

/**
 * @param data
 * @return {Record[]}
 */
export const getJson = (data) => data.json();
export const getError = () => errorMessage;

/**
 * ['grammes', 'g', 'centilitres', 'cl', 'millilitres', 'ml']
 * @type {string[]}
 */
export const unitsMeasure = ['grammes', 'g', 'centilitres', 'cl', 'millilitres', 'ml'];

export const Category = {
  ingredients: 'ingredients',
  ingredient: 'ingredient',
  appliance: 'appliance',
  ustensils: 'ustensils',
};

String.prototype.ucFirst = function () {
  return this.split('')
    .map((text) => text.toLowerCase())
    .map((text, index) => (index === 0 ? text.toUpperCase() : text))
    .join('');
};
