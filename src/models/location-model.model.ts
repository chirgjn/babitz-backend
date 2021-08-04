import {Model, model, property} from '@loopback/repository';

@model()
export class LocationModel extends Model {
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

  constructor(data?: Partial<LocationModel>) {
    super(data);
  }
}

export interface LocationModelRelations {
  // describe navigational properties here
}

export type LocationModelWithRelations = LocationModel & LocationModelRelations;
