import ApiService from '../framework/api-service.js';
import { AUTHORIZATION } from '../constants/constants.js';

export default class ApiClient extends ApiService {

  constructor(endpoint) {
    super(endpoint, AUTHORIZATION);
  }

  async getPoints(){
    const response = await this._load({ url: 'points' });
    return ApiService.parseResponse(response);
  }

  async getDestinations(){
    const response = await this._load({ url: 'destinations' });
    return ApiService.parseResponse(response);
  }

  async getOffers() {
    const response = await this._load({ url: 'offers' });
    return ApiService.parseResponse(response);
  }

  async updatePoint(pointId, pointData) {
    const response = await this._load({
      url: `points/${pointId}`,
      method: 'PUT',
      body: JSON.stringify(pointData),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });

    return ApiService.parseResponse(response);
  }

  async addPoint(pointData){
    const response = await this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(pointData),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });

    return ApiService.parseResponse(response);
  }

  async deletePoint(pointId){
    await this._load({
      url: `points/${pointId}`,
      method: 'DELETE'
    });
  }
}
