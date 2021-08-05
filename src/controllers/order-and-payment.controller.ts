import {service} from '@loopback/core';
import {repository, Where} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors, param,
  response,
  RestHttpErrors
} from '@loopback/rest';
import {getEmailFromHeader} from '../lib/header-parser';
import {Order} from '../models';
import {OrderHistory} from '../models/order-history.model';
import {CartRepository, ItemRepository, OrderRepository, RestaurantRepository, UserRepository} from '../repositories';
import {OrderHistoryRepository} from '../repositories/order-history.repository';
import {RazorpayService} from '../services';
/**
 * operations with order:
 * place order ( cartId )
 * start payment: ( orderId )
 * move order to history ( restaurant makes it complete. )
 */
export class OrderAndPaymentController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(CartRepository)
    public cartRepository: CartRepository,
    @repository(ItemRepository)
    public itemRepository: ItemRepository,
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
    @repository(OrderHistoryRepository)
    public orderHistoryRepository: OrderHistoryRepository,
    @repository(RestaurantRepository)
    public restaurantRepository: RestaurantRepository,
    @service(RazorpayService) public razorpayService: RazorpayService
  ) { }

  @get('/placeOrder')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async placeOrder(
    @param.header.string('authorization') authorization: string,
    @param.query.string('restaurantId') restaurantId: string,
  ): Promise<Order> {
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
      const userCart = await this.cartRepository.findOne(cartFilter);
      const restaurantExists = await this.restaurantRepository.exists(restaurantId);
      if (!restaurantExists) throw new HttpErrors.NotFound("restaurant doesn't exist");
      if (!userRecord.location) {
        throw new HttpErrors.NotFound('no location set for user');
      }
      if (userCart && restaurantExists) {

        const newOrder: Order = new Order({
          items: userCart.items,
          amount: userCart.amount,
          actualAmount: userCart.amount,
          orderStatus: "pending",
          location: userRecord.location,
          restaurantId: restaurantId,
          paymentId: undefined,
          userId: userRecord.id
        });
        let razorpayOrder = await this.razorpayService.createOrder(newOrder);
        console.log("razorpayOrder", razorpayOrder);
        newOrder.paymentId = razorpayOrder.id;
        const placedOrder = this.orderRepository.create(newOrder);
        await this.cartRepository.deleteById(userCart.id);
        return placedOrder;
      } else {
        throw new HttpErrors.NotFound('no cart found for user');
      }
    } else {
      throw new HttpErrors.NotFound('user not registered');
    }
  }


  @get('/getCurrentOrders')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Order, {includeRelations: true}),
        },
      },
    },
  })
  async getCurrentOrders(
    @param.query.string('restaurantId') restaurantId: string,
    @param.header.string('authorization') authorization: string,
  ): Promise<Order[]> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const restaurantExists = await this.restaurantRepository.exists(restaurantId);
    if (!restaurantExists) throw new HttpErrors.NotFound("restaurant doesn't exist");

    const uesrFilter: Where = {where: {email: email}};
    const userRecord = await this.userRepository.findOne(uesrFilter);
    if (userRecord) {
      const orderFilter: Where = {
        where: {userId: userRecord.id, restaurantId: restaurantId, status: {inq: ['pending', 'accepted']}},
      };
      const orders = await this.orderRepository.find(orderFilter);
      if (orders) {
        return orders;
      } else {
        throw new HttpErrors.NotFound('no orders found');
      }
    } else {
      throw new HttpErrors.NotFound('user not registered');
    }
  }

  @get('/pastOrdersForUser')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: Order
        },
      },
    },
  })
  async pastOrdersForUser(
    @param.header.string('authorization') authorization: string,
    @param.query.string('restaurantId') restaurantId: string,
  ): Promise<OrderHistory[]> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const restaurantExists = await this.restaurantRepository.exists(restaurantId);
    if (!restaurantExists) throw new HttpErrors.NotFound("restaurant doesn't exist");

    const uesrFilter: Where = {where: {email: email}};
    const userRecord = await this.userRepository.findOne(uesrFilter);
    if (userRecord) {
      const orderFilter: Where = {
        where: {userId: userRecord.id, restaurantId: restaurantId},
      };
      const orders = await this.orderHistoryRepository.find(orderFilter);
      if (orders) {
        return orders;
      } else {
        throw new HttpErrors.NotFound('no orders found');
      }
    } else {
      throw new HttpErrors.NotFound('user not registered');
    }
  };

  @get('/pastOrdersForRestaurant')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: Order
        },
      },
    },
  })
  async pastOrdersForRestaurant(
    @param.header.string('authorization') authorization: string,
  ): Promise<OrderHistory[]> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    const restaurant = await this.restaurantRepository.findOne(whereFilter);
    if (restaurant) {
      const orderFilter: Where = {where: {restaurantId: restaurant.id}};
      return this.orderHistoryRepository.find(orderFilter);
    } else {
      throw new HttpErrors.NotFound('restaurant not registered');
    }
  };

  @get('/acceptOrRejectOrder')
  @response(200, {
    description: 'Order model instances',
    content: {
      'application/json': {
        schema: {
          type: Order
        },
      },
    },
  })
  async acceptOrRejectOrder(
    @param.header.string('authorization') authorization: string,
    @param.query.string('decision') decision: string,
    @param.query.string('orderId') orderId: string,
  ): Promise<Order> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    const restaurant = await this.restaurantRepository.findOne(whereFilter);
    if (restaurant) {
      const orderFilter: Where = {where: {restaurantId: restaurant.id, orderId: orderId}};
      const orderRecord = await this.orderRepository.findOne(orderFilter);
      if (!orderRecord) {
        throw new HttpErrors.NotFound('order not found');
      }
      if (orderRecord && ['accepted', 'rejected', 'complete', 'pending'].includes(decision)) {
        orderRecord.orderStatus = decision;
        await this.orderRepository.updateById(orderRecord.id, orderRecord);
        return orderRecord;
      } else {
        throw RestHttpErrors.missingRequired('orderstatus not valid');
      }
    } else {
      throw RestHttpErrors.missingRequired('restaurant not registered');
    }
  };

  @get('/acceptOrder')
  @response(200, {
    description: 'Order model instances',
    content: {
      'application/json': {
        schema: {
          type: Order
        },
      },
    },
  })
  async acceptOrder(
    @param.query.string('orderId') orderId: string,
    @param.header.string('authorization') authorization: string,
  ): Promise<Order> {
    return this.acceptOrRejectOrder(authorization, 'accepted', orderId);
  };

  @get('/rejectOrder')
  @response(200, {
    description: 'Order model instances',
    content: {
      'application/json': {
        schema: {
          type: Order
        },
      },
    },
  })
  async rejectOrder(
    @param.query.string('orderId') orderId: string,
    @param.header.string('authorization') authorization: string,
  ): Promise<Order> {
    const order = await this.acceptOrRejectOrder(authorization, 'rejected', orderId);
    this.orderHistoryRepository.create(order);
    return order;
  };

  @get('/completeOrder')
  @response(200, {
    description: 'Order model instances',
    content: {
      'application/json': {
        schema: {
          type: Order
        },
      },
    },
  })
  async completeOrder(
    @param.query.string('orderId') orderId: string,
    @param.header.string('authorization') authorization: string,
  ): Promise<Order> {
    const order = await this.acceptOrRejectOrder(authorization, 'complete', orderId);
    this.orderHistoryRepository.create(order);
    return order;
  };

  @get('/currentOrdersForRestaurant')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: Order
        },
      },
    },
  })
  async currentOrdersForRestaurant(
    @param.header.string('authorization') authorization: string,
  ): Promise<Order[]> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    const restaurant = await this.restaurantRepository.findOne(whereFilter);
    if (restaurant) {
      const orderFilter: Where = {where: {restaurantId: restaurant.id}};
      return this.orderRepository.find(orderFilter);
    } else {
      throw new HttpErrors.NotFound('restaurant not registered');
    }
  };

  @get('/pay')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: Order
        },
      },
    },
  })
  async pay(
    @param.query.string('orderId') orderId: string,
    @param.header.string('authorization') authorization: string,

  ): Promise<Order> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }

    const orderFilter: Where = {where: {id: orderId}};
    const order = await this.orderRepository.findOne(orderFilter);
    if (order) {
      order.paymentId = orderId;
      await this.orderRepository.updateById(order.id, orderFilter);
      return order;
    } else {
      throw new HttpErrors.NotFound('order not found');
    }
  }
};


