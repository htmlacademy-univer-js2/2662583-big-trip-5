import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { render, remove } from '../framework/render.js';
import FiltersModel from '../model/filters-model.js';
import FiltersPresenter from './filters-presenter.js';
import RoutePointPresenter from './route-point-presenter.js';
import { DEFAULT_SORT_TYPE, UserAction, FilterType, UpdateType, LoadingStatus } from '../constants/constants.js';
import { sortPoints } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';
import ErrorView from '../view/error-view.js';
export default class TripPresenter {
  #filtersContainer = null;
  #listContainer = null;
  #model = null;
  #filtersModel = null;
  #filtersPresenter = null;
  #routePointPresenters = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;
  #sortComponent = null;
  #listComponent = null;
  #emptyListComponent = null;
  #loadingComponent = null;
  #errorComponent = null;
  #newPointButton = null;
  #newPointPresenter = null;
  #isCreating = false;
  #loadingStatus = LoadingStatus.LOADING;


  constructor({ filtersContainer, listContainer, model }) {
    this.#filtersContainer = filtersContainer;
    this.#listContainer = listContainer;
    this.#model = model;
    this.#filtersModel = new FiltersModel();

    this.#filtersPresenter = new FiltersPresenter({
      filtersContainer: this.#filtersContainer,
      filtersModel: this.#filtersModel,
      routePointsModel: this.#model
    });

    this.#handleModelEvent = this.#handleModelEvent.bind(this);
    this.#handleSortTypeChange = this.#handleSortTypeChange.bind(this);
    this.#handleNewPointClick = this.#handleNewPointClick.bind(this);
    this.#handleNewPointDestroy = this.#handleNewPointDestroy.bind(this);

    this.#model.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filteredPoints = filter[this.#filtersModel.activeFilter](this.#model.routePoints);
    return sortPoints(filteredPoints, this.#currentSortType);
  }

  async init() {
    this.#filtersPresenter.init();
    this.#renderLoading();
    await this.#model.init();
  }

  setNewPointButton(button) {
    this.#newPointButton = button;
    this.#newPointButton.addEventListener('click', this.#handleNewPointClick);

    if (this.#loadingStatus !== LoadingStatus.SUCCESS) {
      this.#newPointButton.disabled = true;
    }
  }

  #handleNewPointClick = () => {
    this.#createNewPoint();
  };

  #createNewPoint() {
    if (this.#isCreating || this.#loadingStatus !== LoadingStatus.SUCCESS) {
      return;
    }

    this.#filtersModel.setActiveFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#resetSort();
    this.#resetAllForms();
    this.#isCreating = true;
    this.#newPointButton.disabled = true;

    if (this.points.length === 0) {
      this.#renderList();
    }

    const emptyPoint = this.#model.getEmptyRoutePoint();
    this.#newPointPresenter = new RoutePointPresenter({
      container: this.#listComponent.element,
      model: this.#model,
      onDataChange: this.#handlePointDataChange,
      onEditStart: this.#handleEditStart,
      onDestroy: this.#handleNewPointDestroy,
    });

    this.#newPointPresenter.init(emptyPoint, true);
  }

  #handleNewPointDestroy = () => {
    this.#isCreating = false;
    if (this.#newPointButton) {
      this.#newPointButton.disabled = false;
    }
    this.#newPointPresenter = null;
  };

  #renderSort() {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#listContainer, 'afterbegin');
  }

  #renderEmptyList() {
    if (this.#listComponent) {
      remove(this.#listComponent);
      this.#listComponent = null;
    }

    this.#emptyListComponent = new EmptyListView({
      filterType: this.#filtersModel.activeFilter
    });

    render(this.#emptyListComponent, this.#listContainer);
  }

  #renderList() {
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
    }

    if (!this.#listComponent) {
      this.#listComponent = new ListView();
      render(this.#listComponent, this.#listContainer);
    }
  }

  #renderPoints() {
    this.#clearRoutePoints();
    this.points.forEach((point) => this.#renderRoutePoint(point));
  }

  #renderRoutePoint(point) {
    const presenter = new RoutePointPresenter({
      container: this.#listComponent.element,
      model: this.#model,
      onDataChange: this.#handlePointDataChange,
      onEditStart: this.#handleEditStart,
    });

    presenter.init(point);
    this.#routePointPresenters.set(point.id, presenter);
  }

  #clearRoutePoints() {
    this.#routePointPresenters.forEach((presenter) => presenter.destroy());
    this.#routePointPresenters.clear();
  }

  #resetSort() {
    if (this.#currentSortType !== DEFAULT_SORT_TYPE) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
      this.#renderSort();
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#loadingStatus = LoadingStatus.SUCCESS;
        this.#removeLoading();
        this.#removeError();
        this.#renderBoard();
        this.#enableNewPointButton();
        break;
      case UpdateType.ERROR:
        this.#loadingStatus = LoadingStatus.ERROR;
        this.#removeLoading();
        this.#renderError();
        this.#disableNewPointButton();
        break;
      case UpdateType.PATCH:
        this.#routePointPresenters.get(data.id)?.update(data);
        break;
      case UpdateType.MINOR:
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#resetSort();
        this.#renderBoard();
        break;
    }
  };

  #clearBoard() {
    this.#clearRoutePoints();

    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    if (this.#listComponent) {
      remove(this.#listComponent);
      this.#listComponent = null;
    }

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
    }
  }


  #renderBoard() {
    this.#clearBoard();
    if (this.points.length === 0 && !this.#isCreating) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#renderList();
    this.#renderPoints();
  }

  #renderLoading() {
    this.#loadingComponent = new LoadingView();
    render(this.#loadingComponent, this.#listContainer);
    this.#disableNewPointButton();
  }

  #renderError() {
    this.#errorComponent = new ErrorView();
    render(this.#errorComponent, this.#listContainer);
  }

  #removeLoading() {
    if (this.#loadingComponent) {
      remove(this.#loadingComponent);
      this.#loadingComponent = null;
    }
  }

  #removeError() {
    if (this.#errorComponent) {
      remove(this.#errorComponent);
      this.#errorComponent = null;
    }
  }

  #disableNewPointButton() {
    if (this.#newPointButton) {
      this.#newPointButton.disabled = true;
    }
  }

  #enableNewPointButton() {
    if (this.#newPointButton) {
      this.#newPointButton.disabled = false;
    }
  }


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#renderBoard();
  };

  #handlePointDataChange = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        await this.#model.updateRoutePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        await this.#model.addRoutePoint(updateType, update);
        this.#handleNewPointDestroy();
        break;
      case UserAction.DELETE_POINT:
        await this.#model.deleteRoutePoint(updateType, update);
        break;
    }
  };

  #handleEditStart = (pointId = null) => {
    if (typeof this.#isCreating !== 'undefined' && this.#isCreating) {
      if (this.#newPointPresenter) {
        this.#newPointPresenter.destroy();
      }
      this.#handleNewPointDestroy();
    }
    this.#resetAllForms(pointId);
  };

  #resetAllForms(exceptPointId = null) {
    this.#routePointPresenters.forEach((presenter, pointId) => {
      if (pointId !== exceptPointId){
        presenter.resetView();
      }
    });
  }
}
