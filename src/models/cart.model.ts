import {Entity, model, property} from '@loopback/repository';
import {Item} from '.';

@model()
export class Cart extends Entity {
  @property({
    type: 'number',
    default: 0,
  })
  amount: number;

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
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'string',
  })
  restaurantId?: string;

  @property({
    schema: {
      type: 'array',
      items: {
        qty: {
          type: 'number',
        },
        item: {
          type: Item
        }
      },
      default: [],
    },
  })
  items: object;

  constructor(data?: Partial<Cart>) {
    super(data);
  }
}

export interface CartRelations {
  // describe navigational properties here
}

export type CartWithRelations = Cart & CartRelations;
