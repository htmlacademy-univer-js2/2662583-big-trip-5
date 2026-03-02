export const adaptPointToClient = (point) => ({
  id: point.id,
  type: point.type,
  destinationId: point.destination,
  startDate: new Date(point.date_from),
  endDate: new Date(point.date_to),
  price: point.base_price,
  offers: point.offers.map((offerId) => ({ id: offerId })),
  isFavorite: point.is_favorite,
});

export const adaptPointToServer = (point) => ({
  'id': point.id,
  'type': point.type,
  'destination': point.destinationId,
  'date_from': point.startDate.toISOString(),
  'date_to': point.endDate.toISOString(),
  'base_price': point.price,
  'offers': point.offers.map((offer) => offer.id),
  'is_favorite': point.isFavorite,
});

export const adaptDestinationToClient = (destination) => ({
  id: destination.id,
  name: destination.name,
  description: destination.description,
  pictures: destination.pictures.map((pic) => ({
    src: pic.src,
    description: pic.description,
  })),
});

export const adaptOffersToClient = (offersByType) => offersByType.reduce((acc, offerGroup) => {
  acc[offerGroup.type] = offerGroup.offers.map((offer) => ({
    id: offer.id,
    title: offer.title,
    price: offer.price,
  }));
  return acc;
}, {});
