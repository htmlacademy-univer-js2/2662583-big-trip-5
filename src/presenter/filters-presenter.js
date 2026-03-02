import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { UpdateType } from '../constants/constants.js';
export default class FiltersPresenter {
  #filtersContainer = null;
  #filtersModel = null;
  #routePointsModel = null;
  #filtersComponent = null;

  constructor({ filtersContainer, filtersModel, routePointsModel }) {
    this.#filtersContainer = filtersContainer;
    this.#filtersModel = filtersModel;
    this.#routePointsModel = routePointsModel;

    this.#routePointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filtersComponent() {
    return this.#filtersComponent;
  }

  init() {
    const prevFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersView({
      currentFilter: this.#filtersModel.activeFilter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFiltersComponent === null) {
      render(this.#filtersComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.activeFilter === filterType) {
      return;
    }

    this.#filtersModel.setActiveFilter(UpdateType.MAJOR, filterType);
  };
}
