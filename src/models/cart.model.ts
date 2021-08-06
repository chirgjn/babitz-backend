import {Entity, model, property} from '@loopback/repository';
import {CartItem} from './item-list.model';

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
    item: 'array',
    itemType: CartItem,
  })
  items?: Partial<CartItem>[];

  constructor(data?: Partial<Cart>) {
    super(data);
  }
}

export interface CartRelations {
  // describe navigational properties here
}

export type CartWithRelations = Cart & CartRelations;
