import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import { render } from '../framework/render.js';
import Model from '../model/model.js';
import PointPresenter from './point-presenter.js';
export default class Presenter {
  #filtersContainer = null;
  #listContainer = null;
  #model = null;
  #pointPresenters = new Map();

  constructor({ filtersContainer, listContainer }) {
    this.#filtersContainer = filtersContainer;
    this.#listContainer = listContainer;
    this.#model = new Model();

    this.#model.addObserver(() => this.#handleModelChange());
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
    const pointPresenter = new PointPresenter({
      container: container,
      model: this.#model,
      onDataChange: this.#handlePointDataChange.bind(this),
      onEditStart: this.#handleEditStart.bind(this)
    });

    pointPresenter.init(routePoint);

    this.#pointPresenters.set(routePoint.id, pointPresenter);
  }

  #handlePointDataChange(updatedPoint) {
    const success = this.#model.updateRoutePoint(updatedPoint);

    if (success) {
      const pointFromModel = this.#model.getRoutePointById(updatedPoint.id);

      const pointPresenter = this.#pointPresenters.get(updatedPoint.id);
      if (pointPresenter) {
        pointPresenter.update(pointFromModel);
      }
    }
  }

  #handleModelChange(){

  }

  #handleEditStart(pointId = null) {
    this.#resetAllForms(pointId);
  }

  #resetAllForms(exceptPointId = null) {
    this.#pointPresenters.forEach((presenter, pointId) => {
      if (pointId !== exceptPointId){
        presenter.resetView();
      }
    });
  }


}
