import Observable from '../framework/observable.js';
import { UpdateType } from '../constants/constants.js';
import { adaptPointToClient, adaptPointToServer, adaptDestinationToClient, adaptOffersToClient } from '../api/adapter.js';

export default class Model extends Observable{
  #api = null;
  #destinations = [];
  #routePoints = [];
  #offerGroups = {};

  constructor(api){
    super();
    this.#api = api;
  }

  async init(){
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#api.getPoints(),
        this.#api.getDestinations(),
        this.#api.getOffers(),
      ]);
      this.#destinations = destinations.map(adaptDestinationToClient);
      this.#offerGroups = adaptOffersToClient(offers);

      this.#routePoints = points.map(adaptPointToClient);
      this._notify(UpdateType.INIT);
    } catch (error) {
      this.#routePoints = [];
      this.#destinations = [];
      this.#offerGroups = {};
      this._notify(UpdateType.ERROR, { error: 'Failed to load latest route information' });
    }
  }

  get destinations() {
    return this.#destinations;
  }

  get routePoints() {
    return this.#routePoints;
  }

  get offerGroups() {
    return this.#offerGroups;
  }

  async updateRoutePoint(updateType, update) {
    const index = this.#routePoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const serverPoint = adaptPointToServer(update);
      const response = await this.#api.updatePoint(update.id, serverPoint);
      const updatedPoint = adaptPointToClient(response);

      this.#routePoints[index] = updatedPoint;
      this._notify(updateType, updatedPoint);
    } catch (error) {
      throw new Error('Can\'t update point');
    }
  }

  async addRoutePoint(updateType, update) {
    try {
      const serverPoint = adaptPointToServer({ ...update, id: undefined });
      const response = await this.#api.addPoint(serverPoint);
      const newPoint = adaptPointToClient(response);

      this.#routePoints = [newPoint, ...this.#routePoints];
      this._notify(updateType, newPoint);
      return newPoint;
    } catch (error) {
      throw new Error('Can\'t add point');
    }
  }

  async deleteRoutePoint(updateType, update) {
    const index = this.#routePoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#api.deletePoint(update.id);
      this.#routePoints = [
        ...this.#routePoints.slice(0, index),
        ...this.#routePoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (error) {
      throw new Error('Can\'t delete point');
    }
  }

  getOffersByType(type) {
    return this.#offerGroups[type] || [];
  }

  getDestinationById(id) {
    return this.#destinations.find((dest) => dest.id === id);
  }

  getEmptyRoutePoint() {
    return {
      id: `temp-${Date.now()}`,
      type: 'flight',
      destinationId: null,
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      offers: [],
      isFavorite: false
    };
  }
}
