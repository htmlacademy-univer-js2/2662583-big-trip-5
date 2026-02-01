import { generateMockData } from '../mocks/mock-data.js';

export default class Model {
  #destinations = [];
  #routePoints = [];
  #offerGroups = {};

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

  getDestinations() {
    return this.#destinations;
  }

  getRoutePoints() {
    return this.#routePoints;
  }

  getOfferGroups() {
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
}
