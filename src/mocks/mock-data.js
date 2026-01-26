import { getRandomArrayElement, getRandomInt, getRandomDate } from '../utils/utils.js';
import { TYPES, CITIES, OFFER_TITLES, LOREM_IPSUM } from '../constants/constants.js';

function generateOffers() {
  const offers = [];
  const count = getRandomInt(1, 5);

  for (let i = 0; i < count; i++) {
    offers.push({
      id: i + 1,
      title: getRandomArrayElement(OFFER_TITLES),
      price: getRandomInt(5, 100)
    });
  }

  return offers;
}

function generateDestination(id) {
  const city = getRandomArrayElement(CITIES);
  const pictureCount = getRandomInt(1, 5);
  const pictures = [];

  for (let i = 0; i < pictureCount; i++) {
    pictures.push({
      src: `https://loremflickr.com/248/152?random=${getRandomInt(1, 1000)}`,
      description: `${city} photo ${i + 1}`
    });
  }

  return {
    id,
    name: city,
    description: LOREM_IPSUM.slice(0, getRandomInt(1, 5)).join(' '),
    pictures
  };
}

function generateRoutePoint(id) {
  const type = getRandomArrayElement(TYPES);
  const destinationId = getRandomInt(1, 10);
  const startDate = getRandomDate();
  const durationHours = getRandomInt(1, 72);
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

  return {
    id,
    type,
    destinationId: destinationId,
    startDate,
    endDate,
    price: getRandomInt(20, 1000),
    offers: generateOffers(),
    isFavorite: Math.random() > 0.5
  };
}

export function generateMockData() {
  const destinations = [];
  for (let i = 1; i <= 10; i++) {
    destinations.push(generateDestination(i));
  }

  const routePoints = [];
  const pointCount = getRandomInt(5, 10);
  for (let i = 1; i <= pointCount; i++) {
    routePoints.push(generateRoutePoint(i));
  }

  const offerGroups = {};
  TYPES.forEach((type) => {
    offerGroups[type] = generateOffers();
  });

  return {
    destinations,
    routePoints,
    offerGroups
  };
}
