import { createElement } from '../render.js';
import { formatDate } from '../utils/utils.js';
import { TYPES } from '../constants/constants.js';
export default class EditFormView {
  constructor(routePoint = null, destinations = [], offerGroups = {}) {
    this.routePoint = routePoint;
    this.destinations = destinations;
    this.offerGroups = offerGroups;
    this.isNew = !routePoint;
  }

  getTemplate() {
    const point = this.routePoint || {
      type: 'flight',
      destination: null,
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      offers: [],
      isFavorite: false
    };

    const destination = point.destinationId
      ? this.destinations.find((d) => d.id === point.destinationId)
      : null;

    const offersForType = this.offerGroups[point.type] || [];
    const selectedOffers = point.offers || [];

    return `
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      ${this.getTypeSelectorTemplate(point.type)}
      ${this.getDestinationTemplate(point.type, destination)}
      ${this.getTimeTemplate(point.startDate, point.endDate)}
      ${this.getPriceTemplate(point.price)}
      ${this.getButtonsTemplate()}
    </header>
    <section class="event__details">
       ${offersForType.length > 0 ? this.getOffersTemplate(offersForType, selectedOffers) : ''}
        ${destination && destination.description ? this.getDestinationDetailsTemplate(destination) : ''}
    </section>
  </form>
</li>`;
  }

  getTypeSelectorTemplate(currentType) {
    const typesHtml = TYPES.map((type) => `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input visually-hidden" type="radio"
               name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
        <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">
          ${type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
      </div>
    `).join('');

    return `
      <div class="event__type-wrapper">
        <label class="event__type event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="${currentType} icon">
        </label>
        <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${typesHtml}
          </fieldset>
        </div>
      </div>
    `;
  }

  getDestinationTemplate(currentType, destination) {
    const uniqueCities = [...new Set(this.destinations.map((d) => d.name))];
    const destinationsOptions = uniqueCities.map((city) =>`<option value="${city}">${city}</option>`).join('');

    return `
      <div class="event__field-group event__field-group--destination">
        <label class="event__label event__type-output" for="event-destination-1">
          ${currentType.charAt(0).toUpperCase() + currentType.slice(1)}
        </label>
        <input class="event__input event__input--destination" id="event-destination-1"
              type="text" name="event-destination"
              value="${destination ? destination.name : ''}"
              list="destination-list-1"
              >
        <datalist id="destination-list-1">
          ${destinationsOptions}
        </datalist>
      </div>
    `;
  }

  getTimeTemplate(startDate, endDate) {
    return `
      <div class="event__field-group event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input event__input--time" id="event-start-time-1"
               type="text" name="event-start-time"
               value="${formatDate(startDate)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input event__input--time" id="event-end-time-1"
               type="text" name="event-end-time"
               value="${formatDate(endDate)}">
      </div>
    `;
  }

  getPriceTemplate(price) {
    return `
      <div class="event__field-group event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input event__input--price" id="event-price-1"
               type="text" name="event-price"
               value="${price}">
      </div>
    `;
  }

  getButtonsTemplate() {
    if (this.isNew) {
      return `
        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      `;
    }

    return `
      <button class="event__save-btn btn btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    `;
  }

  getOffersTemplate(availableOffers, selectedOffers) {
    const offersHtml = availableOffers.map((offer) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden"
               id="event-offer-${offer.id}"
               type="checkbox"
               name="event-offer"
               value="${offer.id}"
               ${selectedOffers.some((so) => so.id === offer.id) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `).join('');

    return `
      <section class="event__section event__section--offers">
        <h3 class="event__section-title event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offersHtml}
        </div>
      </section>
    `;
  }

  getDestinationDetailsTemplate(destination) {
    const picturesHtml = destination.pictures.map((pic) =>
      `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`
    ).join('');

    return `
      <section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
        ${picturesHtml ? `
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${picturesHtml}
            </div>
          </div>
        ` : ''}
      </section>
    `;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

}

