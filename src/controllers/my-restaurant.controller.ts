import {inject} from '@loopback/core';
import {repository, Where} from '@loopback/repository';
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
import HttpErrors from 'http-errors';
import {getEmailFromHeader} from '../lib/header-parser';
import {Item, Restaurant} from '../models';
import {ItemRepository, RestaurantRepository} from '../repositories';

export class MyRestaurantController {
  constructor(
    @inject.context()
    public context: RequestContext,
    @repository(ItemRepository)
    public itemRepository: ItemRepository,
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
    @param({"name": "authorization", "in": "header", "required": true}) authorization: string,
  ): Promise<Restaurant> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    restaurant.email = email;
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
    @param({"name": "authorization", "in": "header", "required": true}) authorization: string,
  ): Promise<Restaurant> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    const result = await this.restaurantRepository.findOne(whereFilter);
    if (!result) {
      throw new HttpErrors.NotFound('restaurant not registered');
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
    @param({"name": "authorization", "in": "header", "required": true}) authorization: string,
  ): Promise<Restaurant | null> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    const res = await this.restaurantRepository.findOne(whereFilter);
    if (res) {
      restaurant.id = res.id;
      await this.restaurantRepository.updateById(res.id, restaurant);
      return this.restaurantRepository.findOne(whereFilter);
    } else {
      throw new HttpErrors.NotFound('restaurant not registered');
    }
  }
  @post('/addItems')
  @response(200, {
    description: 'Item model instance',
    content: {'application/json': {schema: getModelSchemaRef(Item)}},
  })
  async createItems(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Item, {
              title: 'NewItem',
              exclude: ['id'],
            }),
          },
        },
      },
    })
    items: [Omit<Item, 'id'>],
    @param({"name": "authorization", "in": "header", "required": true}) authorization: string,
  ): Promise<Item[]> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    const restaurant = await this.restaurantRepository.findOne(whereFilter);
    if (restaurant) {
      items.forEach(item => {
        item.restaurantId = restaurant?.id;
      });
      return this.itemRepository.createAll(items);
    } else {
      throw new HttpErrors.NotFound('restaurant not registered');
    }
  }
  @patch('/updateItems')
  @response(200, {
    description: 'Updated Items',
    content: {'application/json': {schema: Item}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Item, {partial: true}),
        },
      },
    })
    item: Item,
    @param({"name": "itemId", "in": "query", "required": true}) itemId: string,
    @param({"name": "authorization", "in": "header", "required": true}) authorization: string,
  ): Promise<Item | null> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const itemFilter: Where = {where: {id: itemId}};
    const foundItem = await this.itemRepository.findOne(itemFilter);
    if (!foundItem) {
      throw new HttpErrors.NotFound('item not found');
    }
    await this.itemRepository.updateById(itemId, item);
    return this.itemRepository.findOne(itemFilter);
  }

  @get('/getItems')
  @response(200, {
    description: 'Array of Item model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Item, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param({"name": "authorization", "in": "header", "required": true}) authorization: string,
  ): Promise<Item[]> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    const restaurant = await this.restaurantRepository.findOne(whereFilter);
    if (restaurant) {
      let itemFilter: Where = {where: {restaurantId: restaurant.id}};
      return this.itemRepository.find(itemFilter);
    } else {
      throw new HttpErrors.NotFound('restaurant not registered');
    }
  }
  @del('/deleteItem')
  @response(204, {
    description: 'Item DELETE success',
  })
  async deleteById(
    @param({"name": "id", "in": "query", "required": true}) id: string,
    @param({"name": "authorization", "in": "header", "required": true}) authorization: string,
  ): Promise<void> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    await this.itemRepository.deleteById(id);
  }
}
