import {Entity, model, property} from '@loopback/repository';
import {LocationModel} from '.';

@model()
export class OrderHistory extends Entity {
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
    required: true,
  })
  orderStatus: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'object',
    required: false,
  })
  Location?: LocationModel;

  @property({
    type: 'string',
    required: true,
  })
  restaurantId: string;

  @property({
    type: 'string',
    required: true,
  })
  paymentId: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  datetime?: string;

  constructor(data?: Partial<OrderHistory>) {
    super(data);
  }
}

export interface OrderHistoryRelations {
  // describe navigational properties here
}

export type OrderHistoryWithRelations = OrderHistory & OrderHistoryRelations;
