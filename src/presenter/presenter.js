import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import { render } from '../framework/render.js';
import Model from '../model/model.js';
import RoutePointPresenter from './point-presenter.js';
export default class TripPresenter {
  #filtersContainer = null;
  #listContainer = null;
  #model = null;
  #routePointPresenters = new Map();

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

    const routePoints = this.#model.routePoints;

    routePoints.forEach((routePoint) => {
      this.#renderRoutePoint(routePoint, tripEventsListView.element);
    });
  }

  #renderRoutePoint(routePoint, container) {
    const pointPresenter = new RoutePointPresenter({
      container: container,
      model: this.#model,
      onDataChange: this.#handlePointDataChange.bind(this),
      onEditStart: this.#handleEditStart.bind(this)
    });

    pointPresenter.init(routePoint);

    this.#routePointPresenters.set(routePoint.id, pointPresenter);
  }

  #handlePointDataChange(updatedPoint) {
    const success = this.#model.updateRoutePoint(updatedPoint);

    if (success) {
      const pointFromModel = this.#model.getRoutePointById(updatedPoint.id);

      const pointPresenter = this.#routePointPresenters.get(updatedPoint.id);
      if (pointPresenter) {
        pointPresenter.update(pointFromModel);
      }
    }
  }

  #handleEditStart(pointId = null) {
    this.#resetAllForms(pointId);
  }

  #resetAllForms(exceptPointId = null) {
    this.#routePointPresenters.forEach((presenter, pointId) => {
      if (pointId !== exceptPointId){
        presenter.resetView();
      }
    });
  }
}

