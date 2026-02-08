import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { render } from '../framework/render.js';

export default class PointPresenter {
  #model = null;
  #container = null;
  #routePoint = null;
  #routePointComponent = null;
  #editFormComponent = null;
  #escKeyDownHandler = null;
  #handleDataChange = null;
  #handleEditStart = null;
  #listItem = null;

  constructor({container, model, onDataChange, onEditStart}){
    this.#container = container;
    this.#model = model;
    this.#handleDataChange = onDataChange;
    this.#handleEditStart = onEditStart;
  }

  init(routePoint){
    this.#routePoint = routePoint;

    const destination = this.#model.getDestinationById(routePoint.destinationId);
    const offers = routePoint.offers;

    this.#routePointComponent = new RoutePointView(
      routePoint,
      destination,
      offers
    );

    this.#editFormComponent = new EditFormView(
      routePoint,
      this.#model.getDestinations(),
      this.#model.getOfferGroups()
    );

    this.#routePointComponent.setEditClickHandler(() => {
      this.#replacePointToForm();
    });

    const listItem = document.createElement('li');
    listItem.className = 'trip-events__item';

    render(this.#routePointComponent, listItem);

    this.#container.appendChild(listItem);

    this.#listItem = listItem;

    this.#routePointComponent.setFavoriteClickHandler(() => {
      this.#handleFavoriteClick();
    });

    this.#editFormComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      this.#replaceFormToPoint();
    });

    this.#editFormComponent.setFormCloseHandler(() => {
      this.#replaceFormToPoint();
    });

  }

  #handleFavoriteClick() {
    const updatedPoint = {
      ...this.#routePoint,
      isFavorite: !this.#routePoint.isFavorite
    };

    this.#handleDataChange(updatedPoint);
  }

  update(updatedPoint) {

    this.#routePoint = updatedPoint;

    const destination = this.#model.getDestinationById(updatedPoint.destinationId);
    const offers = updatedPoint.offers;

    const prevComponent = this.#routePointComponent;

    this.#routePointComponent = new RoutePointView(
      updatedPoint,
      destination,
      offers
    );

    this.#routePointComponent.setEditClickHandler(() => {
      this.#replacePointToForm();
    });

    this.#routePointComponent.setFavoriteClickHandler(() => {
      this.#handleFavoriteClick();
    });

    if (this.#listItem && prevComponent) {
      this.#listItem.innerHTML = '';
      render(this.#routePointComponent, this.#listItem);
    }

    if (this.#listItem && this.#editFormComponent.element.parentElement === this.#listItem) {
      this.#replaceFormToPoint();
    } else if (this.#listItem) {
      this.#listItem.innerHTML = '';
      render(this.#routePointComponent, this.#listItem);
    }
  }

  #replacePointToForm() {
    if (!this.#routePointComponent || !this.#editFormComponent) {
      return;
    }

    if (this.#handleEditStart) {
      this.#handleEditStart(this.#routePoint.id);
    }

    this.#listItem.innerHTML = '';
    render(this.#editFormComponent, this.#listItem);

    const favoriteBtn = this.#editFormComponent.element.querySelector('.event__favorite-btn');
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', () => {
        this.#handleFavoriteClick();
      });
    }
    this.#setEscKeyDownHandler();
  }

  #replaceFormToPoint(){
    if (!this.#routePointComponent || !this.#editFormComponent) {
      return;
    }
    this.#listItem.innerHTML = '';

    render(this.#routePointComponent, this.#listItem);

    this.#removeEscKeyDownHandler();
  }

  #setEscKeyDownHandler() {
    this.#removeEscKeyDownHandler();
    this.#escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#replaceFormToPoint();
      }
    };

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #removeEscKeyDownHandler() {
    if (this.#escKeyDownHandler) {
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#escKeyDownHandler = null;
    }
  }

  resetView() {
    if (this.#editFormComponent && this.#editFormComponent.element.parentElement) {
      this.#replaceFormToPoint();
    }
  }

}
