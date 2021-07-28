import {inject} from '@loopback/core';
import {
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,

  requestBody,
  RequestContext,
  response,
  RestHttpErrors
} from '@loopback/rest';
import {getEmailFromHeader} from '../lib/header-parser';
import {Restaurant} from '../models';
import {RestaurantRepository} from '../repositories';

export class MyRestaurantController {
  constructor(
    @inject.context()
    public context: RequestContext,
    @repository(RestaurantRepository)
    public restaurantRepository: RestaurantRepository,
  ) { }

  @post('/myrestaurant')
  @response(200, {
    description: 'Restaurant model instance',
    content: {'application/json': {schema: getModelSchemaRef(Restaurant)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Restaurant, {
            title: 'NewRestaurant',
            exclude: ['id'],
          }),
        },
      },
    })
    restaurant: Omit<Restaurant, 'id'>,
    @param.header.string('authorization') authorization: string
  ): Promise<Restaurant> {
    let email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    return this.restaurantRepository.create(restaurant);
  }



  @get('/myrestaurant')
  @response(200, {
    description: 'Restaurant model instance',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Restaurant, {includeRelations: true}),
        },
      },
    },
  })
  async getMyRestaurantDetails(
    @param.header.string('authorization') authorization: string
  ): Promise<Restaurant> {
    let email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    let whereFilter: Where = {where: {email: email}};
    let result = await this.restaurantRepository.findOne(whereFilter);
    console.log("result", result, "result");
    if (!result) {
      let err = new Error("not registered");
      err.message = "restaurant not registered with babitz",
        err.name = "NotFoundError";
      throw err;
    }
    return result;
  }

  @patch('/myrestaurant')
  @response(200, {
    description: 'Restaurant PATCH success count',
    content: {'application/json': {schema: Restaurant}},
  })
  async update(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Restaurant, {partial: true}),
        },
      },
    })
    restaurant: Restaurant,
    @param.header.string('authorization') authorization: string,
  ): Promise<Restaurant> {
    let email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    let whereFilter: Where = {where: {email: email}};
    await this.restaurantRepository.update(restaurant, whereFilter);
    await this.restaurantRepository.find(whereFilter);
    return whereFilter[0];
  }

  @del('/myrestaurant/{id}')
  @response(204, {
    description: 'Restaurant DELETE success',
  })
  async deleteById(
    @param.header.string('authorization') authorization: string): Promise<void> {
    let email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    let whereFilter: Where = {where: {email: email}};
    await this.restaurantRepository.deleteAll(whereFilter);
  }
}
