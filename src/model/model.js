import { generateMockData } from '../mocks/mock-data.js';

export default class Model {
  #destinations = [];
  #routePoints = [];
  #offerGroups = {};
  #observers = [];

  constructor() {
    const mockData = generateMockData();
    this.#destinations = mockData.destinations;
    this.#routePoints = mockData.routePoints;
    this.#offerGroups = mockData.offerGroups;
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

  getOffersByType(type) {
    return this.#offerGroups[type] || [];
  }

  getDestinationById(id) {
    return this.#destinations.find((dest) => dest.id === id);
  }

  getEmptyRoutePoint() {
    return {
      id: 0,
      type: 'flight',
      destinationId: null,
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      offers: [],
      isFavorite: false
    };
  }

  updateRoutePoint(updatedPoint) {
    const index = this.#routePoints.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      return false;
    }

    this.#routePoints[index] = updatedPoint;
    return true;
  }

  getRoutePointById(id) {
    return this.#routePoints.find((point) => point.id === id);
  }

  addObserver(callback) {
    this.#observers.push(callback);
  }
}
