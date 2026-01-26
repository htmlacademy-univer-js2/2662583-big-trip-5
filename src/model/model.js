import { generateMockData } from '../mocks/mock-data.js';

export default class Model {
  constructor() {
    const mockData = generateMockData();

    this.destinations = mockData.destinations;
    this.routePoints = mockData.routePoints;
    this.offerGroups = mockData.offerGroups;
  }

  getDestinations() {
    return this.destinations;
  }

  getRoutePoints() {
    return this.routePoints;
  }

  getOfferGroups() {
    return this.offerGroups;
  }

  getOffersByType(type) {
    return this.offerGroups[type] || [];
  }

  getDestinationById(id) {
    return this.destinations.find((dest) => dest.id === id);
  }

  getEmptyRoutePoint() {
    return {
      id: 0,
      type: 'flight',
      destination: null,
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      offers: [],
      isFavorite: false
    };
  }
}
