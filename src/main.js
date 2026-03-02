import ApiClient from './api/api-client.js';
import Model from './model/model.js';
import TripPresenter from './presenter/trip-presenter.js';

const api = new ApiClient('https://24.objects.htmlacademy.pro/big-trip');
const model = new Model(api);

const filtersContainer = document.querySelector('.trip-controls');
const listContainer = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const presenter = new TripPresenter({
  filtersContainer,
  listContainer,
  model,
});

presenter.init();
presenter.setNewPointButton(newEventButton);
