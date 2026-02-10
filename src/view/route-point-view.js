import { formatDate, formatDuration } from '../utils/utils.js';
import { MONTHS, DateFormat } from '../constants/constants.js';
import AbstractView from '../framework/view/abstract-view.js';
export default class RoutePointView extends AbstractView {
  #routePoint = null;
  #destination = null;
  #offers = [];
  #editClickHandler = null;
  #favoriteClickHandler = null;

  constructor(routePoint, destination, offers) {
    super();
    this.#routePoint = routePoint;
    this.#destination = destination;
    this.#offers = offers;
  }

  get template() {
    const { type, startDate, endDate, price, isFavorite } = this.#routePoint;
    const destinationName = this.#destination ? this.#destination.name : '';
    const formattedDate = this.#formatMonthDay(startDate);
    return `
      <div class="event">
        <time class="event__date" datetime="${formatDate(startDate, DateFormat.DAY_ATTR)}">${formattedDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type.charAt(0).toUpperCase() + type.slice(1)} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDate(startDate, DateFormat.DATETIME_ATTR)}">${formatDate(startDate, DateFormat.TIME)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatDate(endDate, DateFormat.DATETIME_ATTR)}">${formatDate(endDate, DateFormat.TIME)}</time>
          </p>
          <p class="event__duration">${formatDuration(startDate, endDate)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${this.#getOffersTemplate()}
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    `;
  }

  setEditClickHandler(callback) {
    this.#editClickHandler = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this.#favoriteClickHandler = callback;
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', (evt) => {
        evt.preventDefault();
        this.#favoriteClickHandler();
      });
  }

  #formatMonthDay(date) {
    if (!date){
      return '';
    }

    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    return `${month} ${day}`;
  }

  #getOffersTemplate() {
    if (!this.#offers || this.#offers.length === 0) {
      return '<h4 class="visually-hidden">Offers:</h4>';
    }

    const offersHtml = this.#offers.slice(0, 3).map((offer) => {
      const price = offer.price || '';
      return `
        <li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          ${price ? `&plus;&euro;&nbsp;<span class="event__offer-price">${price}</span>` : ''}
        </li>
      `;
    }).join('');

    return `
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersHtml}
      </ul>
    `;
  }

}
