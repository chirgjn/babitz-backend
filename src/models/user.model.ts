import {Entity, model, property} from '@loopback/repository';
import {LocationModel} from './location-model.model';
@model()
export class User extends Entity {
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
    required: true,
  })
  displayName: string;

  @property({
    type: 'string',
    required: false,
  })
  firstName?: string;

  @property({
    type: 'string',
    required: false,
  })
  lastName: string;

  @property({
    type: 'string',
    required: false,
  })
  email: string;

  @property({
    type: 'string',
  })
  mobileNumber?: string;

  @property({
    type: 'object',
  })
  location?: LocationModel;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
