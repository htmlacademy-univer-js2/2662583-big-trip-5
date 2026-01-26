import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import ListView from '../view/list-view.js';
import { render, RenderPosition } from '../render.js';
import Model from '../model/model.js';
export default class Presenter {
  constructor({ filtersContainer, listContainer }) {
    this.filtersContainer = filtersContainer;
    this.listContainer = listContainer;
    this.model = new Model();
  }

  init() {
    this.renderFilters();
    this.renderSort();
    this.renderRoutePoints();
    this.renderEditForm();
  }

  renderFilters() {
    render(new FiltersView(), this.filtersContainer);
  }

  renderSort() {
    render(new SortView(), this.listContainer);
  }

  renderRoutePoints() {
    const tripEventsListView = new ListView();
    render(tripEventsListView, this.listContainer);

    const routePoints = this.model.getRoutePoints();

    routePoints.forEach((routePoint) => {
      const destination = this.model.getDestinationById(routePoint.destinationId);
      const offers = routePoint.offers || [];

      render(
        new RoutePointView(routePoint, destination, offers),
        tripEventsListView.getElement()
      );
    });
  }

  renderEditForm() {
    const tripEventsListView = this.listContainer.querySelector('.trip-events__list');

    if (tripEventsListView) {

      const destinations = this.model.getDestinations();
      const offerGroups = this.model.getOfferGroups();

      render(
        new EditFormView(null, destinations, offerGroups),
        tripEventsListView,
        RenderPosition.AFTERBEGIN
      );

      const firstRoutePoint = this.model.getRoutePoints()[0];
      if (firstRoutePoint) {

        render(
          new EditFormView(firstRoutePoint, destinations, offerGroups),
          tripEventsListView
        );
      }
    }
  }
}
