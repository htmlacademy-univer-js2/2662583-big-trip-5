export default class RoutePoint {
  constructor({
    id = 0,
    type = 'flight',
    destinationId = null,
    startDate = null,
    endDate = null,
    price = 0,
    offers = [],
    isFavorite = false
  } = {}) {
    this.id = id;
    this.type = type;
    this.destination = destinationId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.price = price;
    this.offers = offers;
    this.isFavorite = isFavorite;
  }
}
