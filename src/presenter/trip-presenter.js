import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import { render, remove } from '../framework/render.js';
import Model from '../model/model.js';
import RoutePointPresenter from './route-point-presenter.js';
import { DEFAULT_SORT_TYPE } from '../constants/constants.js';
import { sortPoints } from '../utils/sort.js';
export default class TripPresenter {
  #filtersContainer = null;
  #listContainer = null;
  #model = null;
  #routePointPresenters = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;
  #sortComponent = null;
  #listComponent = null;

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

    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#listContainer);
  }

  #renderRoutePoints() {
    if (!this.#listComponent) {
      this.#listComponent = new ListView();
      render(this.#listComponent, this.#listContainer);
    }

    const container = this.#listComponent.element;

    this.#clearRoutePoints();

    const routePoints = this.#model.routePoints;
    const sortedPoints = sortPoints(routePoints, this.#currentSortType);

    sortedPoints.forEach((routePoint) => {
      this.#renderRoutePoint(routePoint, container);
    });
  }

  #clearRoutePoints() {
    this.#routePointPresenters.forEach((presenter) => presenter.destroy());
    this.#routePointPresenters.clear();

    if (this.#listComponent) {
      this.#listComponent.element.innerHTML = '';
    }
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

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#resetAllForms();

    this.#renderRoutePoints();
  };

  #handlePointDataChange(updatedPoint) {
    if (this.#model.updateRoutePoint(updatedPoint)) {
      const pointPresenter = this.#routePointPresenters.get(updatedPoint.id);
      if (pointPresenter) {
        pointPresenter.update(updatedPoint);
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

