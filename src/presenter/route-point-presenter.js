import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../constants/constants.js';

export default class RoutePointPresenter {
  #model = null;
  #container = null;
  #routePoint = null;
  #routePointComponent = null;
  #editFormComponent = null;
  #escKeyDownHandler = null;
  #handleDataChange = null;
  #handleEditStart = null;
  #handleDestroy = null;
  #isNew = false;

  constructor({container, model, onDataChange, onEditStart, onDestroy}){
    this.#container = container;
    this.#model = model;
    this.#handleDataChange = onDataChange;
    this.#handleEditStart = onEditStart;
    this.#handleDestroy = onDestroy;
  }

  #prepareOffers(point) {
    const allOffers = this.#model.getOffersByType(point.type);

    return point.offers
      .map((selected) =>
        allOffers.find((offer) => offer.id === selected.id)
      )
      .filter(Boolean);
  }

  init(routePoint, isNew = false) {
    this.#routePoint = routePoint;
    this.#isNew = isNew;

    const destination = this.#model.getDestinationById(routePoint.destinationId);
    const offers = this.#prepareOffers(routePoint);


    this.#routePointComponent = new RoutePointView(
      routePoint,
      destination,
      offers
    );

    this.#editFormComponent = new EditFormView(
      routePoint,
      this.#model.destinations,
      this.#model.offerGroups,
      this.#isNew
    );

    this.#routePointComponent.setEditClickHandler(() => {
      this.#replacePointToForm();
    });

    this.#routePointComponent.setFavoriteClickHandler(() => {
      this.#handleFavoriteClick();
    });

    this.#editFormComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      this.#handleFormSubmit();
    });

    this.#editFormComponent.setFormCloseHandler(() => {
      this.#handleFormClose();
    });

    if (!this.#isNew) {
      this.#editFormComponent.setFormDeleteHandler(() => {
        this.#handleDeleteClick();
      });
    }

    if (this.#isNew) {
      const tempContainer = document.createElement('div');
      render(this.#editFormComponent, tempContainer);

      if (this.#container.firstChild) {
        this.#container.insertBefore(tempContainer.firstChild, this.#container.firstChild);
      } else {
        this.#container.appendChild(tempContainer.firstChild);
      }
      this.#setEscKeyDownHandler();
    } else {
      render(this.#routePointComponent, this.#container);
    }
  }

  #handleFormSubmit = async () => {
    this.#editFormComponent.setSaving(true);

    try {
      const formState = this.#editFormComponent.getState();

      if (this.#isNew && !formState.destinationId) {
        return;
      }

      const updatedPoint = {
        ...this.#routePoint,
        ...formState,
        offers: formState.offers || [],
      };

      if (this.#isNew) {
        delete updatedPoint.id;
      }

      const actionType = this.#isNew ? UserAction.ADD_POINT : UserAction.UPDATE_POINT;
      const updateType = this.#isNew ? UpdateType.MAJOR : UpdateType.MINOR;

      await this.#handleDataChange(actionType, updateType, updatedPoint);

      if (!this.#isNew) {
        this.#replaceFormToPoint();
      }
    } catch (error) {
      this.#editFormComponent.setSaving(false);
      this.#editFormComponent.shake();
    }
  };

  #handleDeleteClick = async () => {
    if (this.#isNew) {
      this.#destroy();
      this.#handleDestroy?.();
      return;
    }

    this.#editFormComponent.setDeleting(true);

    try {
      await this.#handleDataChange(
        UserAction.DELETE_POINT,
        UpdateType.MAJOR,
        this.#routePoint
      );
    } catch (error) {
      this.#editFormComponent.setDeleting(false);
      this.#editFormComponent.shake();
    }
  };


  #handleFavoriteClick = async () => {
    const updatedPoint = {
      ...this.#routePoint,
      isFavorite: !this.#routePoint.isFavorite
    };

    try {
      await this.#handleDataChange(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        updatedPoint
      );
    } catch (error) {
      this.#routePointComponent.shake();
    }
  };

  #handleFormClose() {
    if (this.#isNew) {
      this.#destroy();
      if (this.#handleDestroy) {
        this.#handleDestroy();
      }
    } else {
      this.#replaceFormToPoint();
    }
  }

  update(updatedPoint) {
    this.#routePoint = updatedPoint;

    const destination = this.#model.getDestinationById(updatedPoint.destinationId);
    const offers = this.#prepareOffers(updatedPoint);

    const prevRoutePointComponent = this.#routePointComponent;
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


    const prevEditFormComponent = this.#editFormComponent;
    this.#editFormComponent = new EditFormView(
      updatedPoint,
      this.#model.destinations,
      this.#model.offerGroups,
      this.#isNew
    );

    this.#editFormComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      this.#handleFormSubmit();
    });

    this.#editFormComponent.setFormCloseHandler(() => {
      this.#handleFormClose();
    });

    if (!this.#isNew) {
      this.#editFormComponent.setFormDeleteHandler(() => {
        this.#handleDeleteClick();
      });
    }

    const isFormShown = this.#editFormComponent &&
      this.#editFormComponent.element &&
      this.#editFormComponent.element.parentElement === this.#container;

    if (isFormShown) {
      replace(this.#editFormComponent, prevEditFormComponent);
      this.#setEscKeyDownHandler();
    } else {
      if (prevRoutePointComponent && prevRoutePointComponent.element.parentElement === this.#container) {
        replace(this.#routePointComponent, prevRoutePointComponent);
      }
    }
    remove(prevRoutePointComponent);
    remove(prevEditFormComponent);
  }

  #replacePointToForm() {
    if (!this.#routePointComponent || !this.#routePointComponent.element) {
      return;
    }

    if (this.#routePointComponent.element.parentElement !== this.#container) {
      return;
    }


    if (this.#handleEditStart) {
      this.#handleEditStart(this.#routePoint.id);
    }

    replace(this.#editFormComponent, this.#routePointComponent);
    this.#setEscKeyDownHandler();
  }

  #replaceFormToPoint() {
    if (!this.#editFormComponent || !this.#editFormComponent.element ||
        !this.#routePointComponent || !this.#routePointComponent.element) {
      return;
    }

    if (this.#editFormComponent.element.parentElement !== this.#container) {
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
        this.#handleFormClose();
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
    if (this.#isNew) {
      this.#destroy();
      if (this.#handleDestroy) {
        this.#handleDestroy();
      }
      return;
    }

    if (this.#editFormComponent &&
        this.#editFormComponent.element &&
        this.#editFormComponent.element.parentElement === this.#container) {
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    this.#destroy();
  }

  #destroy() {
    this.#removeEscKeyDownHandler();

    if (this.#editFormComponent) {
      remove(this.#editFormComponent);
      this.#editFormComponent = null;
    }

    if (this.#routePointComponent) {
      remove(this.#routePointComponent);
      this.#routePointComponent = null;
    }
  }
}
