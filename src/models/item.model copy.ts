import {Entity, model, property} from '@loopback/repository';

@model()
export class Item extends Entity {
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
  name: string;

  @property({
    type: 'string',
  })
  description?: string | null;

  @property({
    type: 'string',
  })
  restaurantId?: string | null;

  @property({
    type: 'string',
  })
  image?: string | null;

  @property({
    type: 'string',
  })
  tags?: string | null;

  @property({
    type: 'number',
    default: 0,
  })
  price: number;

  @property({
    type: 'boolean',
    default: true,
  })
  status?: boolean | null;

  constructor(data?: Partial<Item>) {
    super(data);
  }
}

export interface ItemRelations {
  // describe navigational properties here
}

export type ItemWithRelations = Item & ItemRelations;
