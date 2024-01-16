export class TagService {
  constructor() {
    this.allTagsHere = [];
  }

  addTag(text) {
    const tag = document.createElement('div');
    tag.classList.add('tag');
    tag.textContent = text;

    const img = document.createElement('img');
    img.src = `assets/svgs/cross.svg`;
    img.alt = `Annuler la selection de ${text}`;

    tag.appendChild(img);
    document.querySelector('.container-tag').appendChild(tag);

    this.allTagsHere.push(text);
  }

  removeTag(text) {
    const allTags = [...document.querySelectorAll('.tag')];
    const tagIndex = allTags.findIndex((tag) => tag.textContent === text);
    this.allTagsHere.splice(tagIndex, 1);

    document.querySelector('.container-tag').removeChild(document.querySelectorAll('.tag')[tagIndex]);
  }
}
