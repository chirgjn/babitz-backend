import {Model, model, property} from '@loopback/repository';
import {Item} from './item.model';

@model()
export class CartItem extends Model {
  @property({
    type: 'number',
    required: true,
  })
  qty?: number;

  @property({
    type: 'object',
    required: true,
  })
  item?: Partial<Item>;

  constructor(data?: Partial<CartItem>) {
    super(data);
  }
}

export interface ItemListRelations {
  // describe navigational properties here
}

export type ItemListWithRelations = CartItem & ItemListRelations;
