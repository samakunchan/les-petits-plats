import { noIngredient } from '../../core/utils/utils.js';

export class RecipesServices {
  /**
   *
   * @param recipes {RecipeModel[]}
   * @return {*}
   */
  getRecipesDOM(recipes) {
    const allCards = [...document.getElementsByClassName('container-card')];

    if (allCards.length > 0) {
      allCards.forEach((card) => document.querySelector(`.section-results`).removeChild(card));
    }

    return recipes.map((recipe) => {
      document.querySelector(`.section-results`).appendChild(this.buildDOMRecipes(recipe));
      return recipe;
    });
  }

  /**
   *
   * @param recipe {RecipeModel}
   * @return {HTMLDivElement}
   */
  buildDOMRecipes(recipe) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('container-card');
    const cardDish = document.createElement('div');
    cardDish.classList.add('card-dish');

    const img = document.createElement('img');
    img.src = recipe.image;
    img.alt = 'test';

    const span = document.createElement('span');
    span.classList.add('badge');
    span.textContent = recipe.time;

    const contentIngredient = document.createElement('div');
    contentIngredient.classList.add('content-ingredients');

    const h3 = document.createElement('h3');
    h3.textContent = recipe.name;

    const p1 = document.createElement('p');
    p1.classList.add('h4');
    p1.textContent = 'Recette';

    const description = document.createElement('p');
    description.classList.add('dish-description', 'max-lines');
    description.textContent = recipe.description;

    const p2 = document.createElement('p');
    p2.classList.add('h4');
    p2.textContent = `Ingrédients`;

    const ingredients = document.createElement('div');
    ingredients.classList.add('ingredients', 'grid', 'grid-cols-2', 'gap-2');

    recipe.ingredients.forEach((ingredient) => {
      const ingredientDiv = document.createElement('div');
      ingredientDiv.classList.add('ingredient');

      const p = document.createElement('p');
      p.textContent = ingredient.ingredient === noIngredient ? '' : ingredient.ingredient;
      ingredientDiv.appendChild(p);

      const small = document.createElement('small');
      small.textContent = ingredient.quantityText;
      ingredientDiv.appendChild(small);

      ingredients.appendChild(ingredientDiv);
    });

    cardDish.appendChild(img);
    cardDish.appendChild(span);
    cardDish.appendChild(contentIngredient);

    contentIngredient.appendChild(h3);
    contentIngredient.appendChild(p1);
    contentIngredient.appendChild(description);
    contentIngredient.appendChild(p2);
    contentIngredient.appendChild(ingredients);

    cardContainer.appendChild(cardDish);

    return cardContainer;
  }
}
