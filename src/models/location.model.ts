import {Model, model, property} from '@loopback/repository';

@model()
export class Location extends Model {
  @property({
    type: 'string',
    required: true,
  })
  firstLine: string;

  @property({
    type: 'string',
  })
  secondLine?: string;

  @property({
    type: 'number',
    required: true,
  })
  pincode: number;

  @property({
    type: 'string',
  })
  landmark?: string;

  constructor(data?: Partial<Location>) {
    super(data);
  }
}

export interface LocationRelations {
  // describe navigational properties here
}

export type LocationWithRelations = Location & LocationRelations;
