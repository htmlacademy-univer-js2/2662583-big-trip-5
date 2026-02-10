import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { render, replace } from '../framework/render.js';

export default class RoutePointPresenter {
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
      this.#model.destinations,
      this.#model.offerGroups
    );

    this.#routePointComponent.setEditClickHandler(() => {
      this.#replacePointToForm();
    });

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

    const listItem = document.createElement('li');
    listItem.className = 'trip-events__item';

    render(this.#routePointComponent, listItem);

    this.#container.appendChild(listItem);

    this.#listItem = listItem;
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

    if (this.#editFormComponent.element?.parentElement === this.#listItem) {
      replace(this.#routePointComponent, this.#editFormComponent);
    } else if (prevComponent) {
      replace(this.#routePointComponent, prevComponent);
    }
  }

  #replacePointToForm() {
    if (this.#routePointComponent.element?.parentElement !== this.#listItem) {
      return;
    }

    if (this.#handleEditStart) {
      this.#handleEditStart(this.#routePoint.id);
    }

    replace(this.#editFormComponent, this.#routePointComponent);

    this.#setEscKeyDownHandler();
  }

  #replaceFormToPoint(){
    if (this.#editFormComponent.element?.parentElement !== this.#listItem) {
      return;
    }
    replace(this.#routePointComponent, this.#editFormComponent);

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
