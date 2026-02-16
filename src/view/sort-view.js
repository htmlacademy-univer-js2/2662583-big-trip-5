import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../constants/constants.js';
export default class SortView extends AbstractView {
  #currentSortType = null;
  #onSortTypeChange = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#onSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    const createSortItemTemplate = (type, label, isDisabled = false) => {
      const isChecked = type === this.#currentSortType;
      const disabledAttr = isDisabled ? 'disabled' : '';
      const checkedAttr = isChecked ? 'checked' : '';
      return `
        <div class="trip-sort__item  trip-sort__item--${type}">
          <input id="sort-${type}"
                 class="trip-sort__input  visually-hidden"
                 type="radio"
                 name="trip-sort"
                 value="${type}"
                 data-sort-type="${type}"
                 ${checkedAttr}
                 ${disabledAttr}>
          <label class="trip-sort__btn"
                 for="sort-${type}"
                 data-sort-type="${type}">
            ${label}
          </label>
        </div>
      `;
    };

    return `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${createSortItemTemplate(SortType.DAY, 'Day')}
        ${createSortItemTemplate(SortType.EVENT, 'Event', true)}
        ${createSortItemTemplate(SortType.TIME, 'Time')}
        ${createSortItemTemplate(SortType.PRICE, 'Price')}
        ${createSortItemTemplate(SortType.OFFER, 'Offers', true)}
      </form>
    `;
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const sortElement = evt.target.closest('[data-sort-type]');
    if (!sortElement || sortElement.disabled) {
      return;
    }

    const sortType = sortElement.dataset.sortType;
    this.#onSortTypeChange(sortType);

  };

}
