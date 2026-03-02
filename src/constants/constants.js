import { generateAuthString } from '../utils/utils.js';

export const TYPES = [
  'taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'
];

export const DateFormat = {
  DEFAULT: 'DD/MM/YY HH:mm',
  DATETIME_ATTR: 'YYYY-MM-DDTHH:mm',
  DAY_ATTR: 'YYYY-MM-DD',
  MONTH_DAY: 'MMM D',
  TIME: 'HH:mm'
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
  EVENT: 'event',
  OFFER: 'offer'
};

export const DEFAULT_SORT_TYPE = SortType.DAY;

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const FilterEmptyMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

export const LoadingStatus = {
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};

export const ButtonText = {
  SAVE: 'Save',
  SAVING: 'Saving...',
  DELETE: 'Delete',
  DELETING: 'Deleting...',
  CANCEL: 'Cancel',
};

export const AUTHORIZATION = `Basic ${generateAuthString()}`;
