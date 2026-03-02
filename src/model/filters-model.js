import Observable from '../framework/observable.js';
import { FilterType, UpdateType } from '../constants/constants.js';

export default class FiltersModel extends Observable{
  #activeFilter = FilterType.EVERYTHING;

  get activeFilter() {
    return this.#activeFilter;
  }

  setActiveFilter(updateType, filterType) {
    if (!filterType) {
      filterType = updateType;
      updateType = UpdateType.MAJOR;
    }
    if (this.#activeFilter === filterType) {
      return;
    }
    this.#activeFilter = filterType;
    this._notify(updateType, filterType);
  }
}
