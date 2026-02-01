import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import ListView from '../view/list-view.js';
import { render, replace } from '../framework/render.js';
import Model from '../model/model.js';
export default class Presenter {
  #filtersContainer = null;
  #listContainer = null;
  #model = null;
  #routePointComponents = new Map();
  #editFormComponents = new Map();
  #escKeyDownHandler = null;

  constructor({ filtersContainer, listContainer }) {
    this.#filtersContainer = filtersContainer;
    this.#listContainer = listContainer;
    this.#model = new Model();
  }

  init() {
    this.#renderFilters();
    this.#renderSort();
    this.#renderRoutePoints();
  }

  #renderFilters() {
    render(new FiltersView(), this.#filtersContainer);
  }

  #renderSort() {
    render(new SortView(), this.#listContainer);
  }

  #renderRoutePoints() {
    const tripEventsListView = new ListView();
    render(tripEventsListView, this.#listContainer);

    const routePoints = this.#model.getRoutePoints();

    routePoints.forEach((routePoint) => {
      this.#renderRoutePoint(routePoint, tripEventsListView.element);
    });
  }

  #renderRoutePoint(routePoint, container) {
    const destination = this.#model.getDestinationById(routePoint.destinationId);
    const offers = routePoint.offers;

    const routePointComponent = new RoutePointView(
      routePoint,
      destination,
      offers
    );

    const editFormComponent = new EditFormView(
      routePoint,
      this.#model.getDestinations(),
      this.#model.getOfferGroups()
    );

    this.#routePointComponents.set(routePoint.id, routePointComponent);
    this.#editFormComponents.set(routePoint.id, editFormComponent);

    const handleEditClick = () => {
      this.#replacePointToForm(routePoint.id);
    };

    const handleFormClose = () => {
      this.#replaceFormToPoint(routePoint.id);
    };

    const handleFormSubmit = (evt) => {
      evt.preventDefault();

      this.#replaceFormToPoint(routePoint.id);
    };

    routePointComponent.setEditClickHandler(handleEditClick);
    editFormComponent.setFormSubmitHandler(handleFormSubmit);
    editFormComponent.setFormCloseHandler(handleFormClose);

    render(routePointComponent, container);
  }

  #replacePointToForm(pointId) {
    const pointComponent = this.#routePointComponents.get(pointId);
    const formComponent = this.#editFormComponents.get(pointId);

    if (pointComponent && formComponent) {
      replace(formComponent, pointComponent);
      this.#setEscKeyDownHandler(pointId);
    }
  }

  #replaceFormToPoint(pointId) {
    const pointComponent = this.#routePointComponents.get(pointId);
    const formComponent = this.#editFormComponents.get(pointId);

    if (pointComponent && formComponent) {
      replace(pointComponent, formComponent);
      this.#removeEscKeyDownHandler();
    }
  }

  #setEscKeyDownHandler(pointId) {
    this.#removeEscKeyDownHandler();
    this.#escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#replaceFormToPoint(pointId);
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
}
