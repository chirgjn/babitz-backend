import {Entity, model, property} from '@loopback/repository';
import {LocationModel} from '.';

@model()
export class Order extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      dataType: 'uuid',
    },
  })
  id?: string;

  @property({
    type: 'object',
  })
  items?: object;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'number',
    required: true,
  })
  actualAmount: number;

  @property({
    type: 'string',
    enum: ['pending', 'accepted', 'rejected', 'complete'],
    default: 'pending',
    required: false,
  })
  orderStatus?: string;

  @property({
    type: 'string',
    required: true,
  })
  userId?: string;

  @property({
    type: 'object',
  })
  location?: LocationModel;

  @property({
    type: 'string',
    required: true,
  })
  restaurantId: string;

  @property({
    type: 'string',
    required: false,
  })
  paymentId?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  datetime?: string;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
