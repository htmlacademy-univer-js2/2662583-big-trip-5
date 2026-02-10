import TripPresenter from './presenter/trip-presenter.js';

const filtersContainer = document.querySelector('.trip-controls');
const listContainer = document.querySelector('.trip-events');

const presenter = new TripPresenter({
  filtersContainer,
  listContainer,
});

presenter.init();
