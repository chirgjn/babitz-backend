import {repository, Where} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
  RestHttpErrors
} from '@loopback/rest';
import {getEmailFromHeader} from '../lib/header-parser';
import {Cart, Item, Restaurant, User} from '../models';
import {CartRepository, ItemRepository, RestaurantRepository, UserRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(CartRepository)
    public cartRepository: CartRepository,
    @repository(ItemRepository)
    public itemRepository: ItemRepository,
    @repository(RestaurantRepository)
    public restaurantRepository: RestaurantRepository
  ) { }

  @post('/registerUser')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id', 'email'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
    @param.header.string('authorization') authorization: string,
  ): Promise<User> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    user.email = email;
    return this.userRepository.create(user);
  }

  @patch('/updateUserDetails')
  @response(200, {
    description: 'Updated user details',
    content: {'application/json': {schema: User}},
  })
  async updateDetails(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'UserDetails',
            exclude: ['id', 'email'],
            partial: true,
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
    @param.header.string('authorization') authorization: string,
  ): Promise<User | null> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    const userRecord = await this.userRepository.findOne(whereFilter);
    if (userRecord) {
      await this.userRepository.updateById(userRecord.id, user);
      return this.userRepository.findOne(whereFilter);
    } else {
      throw new HttpErrors.NotFound('user not registered');
    }
  }

  @get('/getUserProfile')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async getMyProfile(
    @param.header.string('authorization') authorization: string,
  ): Promise<User> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    const userRecord = await this.userRepository.findOne(whereFilter);
    if (userRecord) {
      return userRecord;
    } else {
      throw new HttpErrors.NotFound('user not registered');
    }
  }
  @get('/getCart')
  @response(200, {
    description: 'Cart model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cart, {includeRelations: false}),
      },
    },
  })
  async getMyCart(
    @param.query.string('restaurantId') restaurantId: string,
    @param.header.string('authorization') authorization: string,
  ): Promise<Cart> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    const userRecord = await this.userRepository.findOne(whereFilter);
    if (userRecord) {
      const cartFilter: Where = {
        where: {userId: userRecord.id, restaurantId: restaurantId},
      };
      const cartRecord = await this.cartRepository.findOne(cartFilter);
      if (cartRecord) {
        return cartRecord;
      } else {
        const cart = {
          userId: userRecord.id,
          restaurantId: restaurantId,
          amount: 0,
          items: [],
        };
        const createdCart = await this.cartRepository.create(cart);
        return createdCart;
      }
    } else {
      throw new HttpErrors.NotFound('user not registered');
    }
  }

  @get('/addToCart')
  @response(200, {
    description: 'Cart model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cart, {includeRelations: false}),
      },
    },
  })
  async addToCart(
    @param.query.string('itemId') itemId: string,
    @param.query.number('qty') qty: number,
    @param.query.string('restaurantId') restaurantId: string,
    @param.header.string('authorization') authorization: string,
  ): Promise<Cart> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const uesrFilter: Where = {where: {email: email}};
    const userRecord = await this.userRepository.findOne(uesrFilter);
    if (userRecord) {
      const itemFilter: Where = {
        where: {restaurantId: restaurantId, id: itemId},
      };
      const itemRecord = await this.itemRepository.findOne(itemFilter);
      if (!itemRecord) {
        throw new HttpErrors.NotFound('item not found');
      } else {
        const cartFilter: Where = {
          where: {userId: userRecord.id, restaurantId: restaurantId},
        };
        const cartRecord = await this.cartRepository.findOne(cartFilter);
        if (cartRecord) {
          /* eslint-disable */
          (cartRecord.items as Array<any>).push({item: itemRecord, qty: qty});
          cartRecord.amount = cartRecord.amount + itemRecord.price * qty;
          await this.cartRepository.updateById(cartRecord.id, cartRecord);
          return cartRecord;
          /* eslint-enable */
        } else {
          const newCart = {
            userId: userRecord.id,
            restaurantId: restaurantId,
            items: [
              {
                item: itemRecord,
                qty: qty,
              },
            ],
            amount: itemRecord.price * qty,
          };
          const createdCart = await this.cartRepository.create(newCart);
          return createdCart;
        }
      }
    } else {
      throw new HttpErrors.NotFound('user not registered');
    }
  }

  @get('/removeFromCart')
  @response(200, {
    description: 'Cart model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cart, {includeRelations: false}),
      },
    },
  })
  async removeFromCart(
    @param.query.string('itemId') itemId: string,
    @param.query.string('restaurantId') restaurantId: string,
    @param.header.string('authorization') authorization: string,
  ): Promise<Cart | void | null> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const uesrFilter: Where = {where: {email: email}};
    const userRecord = await this.userRepository.findOne(uesrFilter);
    if (userRecord) {
      const cartFilter: Where = {
        where: {userId: userRecord.id, restaurantId: restaurantId},
      };
      return this.cartRepository.findOne(cartFilter);
    }
  }

  @del('/deleteCart')
  @response(204, {
    description: 'Cart DELETE success',
  })
  async deleteCart(
    @param.query.string('restaurantId') restaurantId: string,
    @param.header.string('authorization') authorization: string,
  ): Promise<void> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const uesrFilter: Where = {where: {email: email}};
    const userRecord = await this.userRepository.findOne(uesrFilter);
    if (userRecord) {
      const cartFilter: Where = {
        where: {userId: userRecord.id, restaurantId: restaurantId},
      };
      const cartRecord = await this.cartRepository.findOne(cartFilter);
      if (cartRecord) {
        await this.cartRepository.deleteById(cartRecord.id);
        return;
      } else {
        return;
      }
    } else {
      throw new HttpErrors.NotFound('user not registered');
    }
  }

  @get('/getRestaurantByName')
  @response(200, {
    description: 'Cart model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cart, {includeRelations: false}),
      },
    },
  })
  async getRestaurantByName(
    @param.query.string('restautantName') restautantName: string,
  ): Promise<Restaurant> {
    const restaurantFilter: Where = {
      where: {name: restautantName},
    };
    let restaurant = await this.restaurantRepository.findOne(restaurantFilter);
    if (restaurant) {
      return restaurant;
    } else {
      throw new HttpErrors.NotFound('restaurant not found');
    }
  }

  @get('/getItemsByRestaurantName')
  @response(200, {
    description: 'Cart model instance',
    content: {
      'application/json': {
        schema:
        {
          type: 'array',
          items: getModelSchemaRef(Item)
        }
      }
    },
  })
  async getItemsByRestaurantName(
    @param.query.string('restautantName') restautantName: string,
  ): Promise<Item[]> {
    const restaurantFilter: Where = {
      where: {name: restautantName},
    };
    let restaurant = await this.restaurantRepository.findOne(restaurantFilter);
    if (restaurant) {
      let itemFilter: Where = {where: {restaurantId: restaurant.id}};
      return await this.itemRepository.find(itemFilter);
    } else {
      throw new HttpErrors.NotFound('restaurant not found');
    }
  }
}
