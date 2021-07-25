import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  RequestContext,
  response,
} from '@loopback/rest';
import * as admin from 'firebase-admin';
import {Restaurant} from '../models';
import {RestaurantRepository} from '../repositories';

export class RestaurantsController {
  constructor(
    @inject.context()
    public context: RequestContext,
    @repository(RestaurantRepository)
    public restaurantRepository: RestaurantRepository,
  ) {}

  @post('/restaurants')
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
          }),
        },
      },
    })
    restaurant: Restaurant,
  ): Promise<Restaurant> {
    return this.restaurantRepository.create(restaurant);
  }

  @get('/restaurants/count')
  @response(200, {
    description: 'Restaurant model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Restaurant) where?: Where<Restaurant>,
  ): Promise<Count> {
    return this.restaurantRepository.count(where);
  }

  @get('/restaurants')
  @response(200, {
    description: 'Array of Restaurant model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Restaurant, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Restaurant) filter?: Filter<Restaurant>,
  ): Promise<Restaurant[]> {
    return this.restaurantRepository.find(filter);
  }
  @get('/myRestaurant')
  @response(200, {
    description: 'get your restaurant details with accessToken',
    content: {
      'application/json': {
        schema: {
          type: 'string',
          field: 'value',
        },
      },
    },
  })
  async getMyRestaurantDetails(
    // eslint-disable-next-line
    @param.header.string('Authorization') authToken: any,
    // eslint-disable-next-line
  ): Promise<any> {
    console.log('this.context.request.headers', this.context.request.headers);
    const authHeader = this.context.request.headers.authorization;
    console.log('Request', authHeader);
    if (authHeader) {
      return (
        admin
          .auth()
          .verifyIdToken(authHeader)
          // eslint-disable-next-line
          .then((token: any) => {
            // const uid = token.uid;
            // console.log("varified ", token);
            //go to user / restaurant and upsert record.
            const filter2 = {
              where: {
                email: token.email,
              },
            };
            // console.log("filter2 ", filter2);
            return this.restaurantRepository.find(filter2);
          })
          // eslint-disable-next-line
          .catch(async (error: {message: any}) => {
            const base64Payload = authHeader.split('.')[1];
            const payload = Buffer.from(base64Payload, 'base64');
            const token = JSON.parse(payload.toString());
            // console.log("token", token);
            const filter2 = {
              where: {
                email: token.email,
              },
            };
            // console.log("filter2 ", filter2);
            const res = await this.restaurantRepository.findOne(filter2);
            // console.log("result", res);
            return res;
          })
      );
    } else {
      return {code: 404, status: false, message: 'Something went wrong'};
    }
  }

  @patch('/restaurants')
  @response(200, {
    description: 'Restaurant PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Restaurant, {partial: true}),
        },
      },
    })
    restaurant: Restaurant,
    @param.where(Restaurant) where?: Where<Restaurant>,
  ): Promise<Count> {
    return this.restaurantRepository.updateAll(restaurant, where);
  }

  @get('/restaurants/{id}')
  @response(200, {
    description: 'Restaurant model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Restaurant, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Restaurant, {exclude: 'where'})
    filter?: FilterExcludingWhere<Restaurant>,
  ): Promise<Restaurant> {
    return this.restaurantRepository.findById(id, filter);
  }

  @patch('/restaurants/{id}')
  @response(204, {
    description: 'Restaurant PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Restaurant, {partial: true}),
        },
      },
    })
    restaurant: Restaurant,
  ): Promise<void> {
    await this.restaurantRepository.updateById(id, restaurant);
  }

  @put('/restaurants/{id}')
  @response(204, {
    description: 'Restaurant PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() restaurant: Restaurant,
  ): Promise<void> {
    await this.restaurantRepository.replaceById(id, restaurant);
  }

  @del('/restaurants/{id}')
  @response(204, {
    description: 'Restaurant DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.restaurantRepository.deleteById(id);
  }
}
