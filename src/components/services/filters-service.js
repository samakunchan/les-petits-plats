export class FiltersService {
  constructor() {
    this._headersFilters = [...document.getElementsByClassName('header-filters')];
    this.manageDropDownFilters();
  }

  manageDropDownFilters() {
    this._headersFilters.forEach((filter) => {
      document.getElementById(filter.id).addEventListener('click', (event) => {
        event.stopPropagation();
        filter.parentNode.classList.toggle('show');
      });
      document.getElementById(filter.id).addEventListener('keydown', (event) => {
        event.stopPropagation();
        if (event.key === 'Enter') filter.parentNode.classList.toggle('show');
      });
    });
  }
}
