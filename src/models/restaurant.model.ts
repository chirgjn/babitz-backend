import {Entity, model, property} from '@loopback/repository';

@model()
export class Restaurant extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      dataType: 'uuid',
    },
  })
  id: string;

  @property({
    type: 'string',
    description: "Restaurant's name",
    index: {unique: true},
  })
  name: string;

  /**
   * Restaurant's email
   */
  @property({
    type: 'string',
    format: 'email',
    description: "Restaurant's email",
    index: {unique: true},
  })
  email?: string;

  /**
   * Restaurant's mobile number
   */
  @property({
    type: 'string',
    description: "Restaurant's mobile number",
  })
  mobileNumber?: string;

  /**
   * Restaurant's address
   */
  @property({
    type: 'string',
    description: "Restaurant's address",
  })
  address?: string;

  /**
   * Restaurant's upi Id on a upi platform
   */
  @property({
    type: 'string',
    description: "Restaurant's upi Id on a upi platform",
  })
  billingInfo?: string;

  /**
   * Restaurant's chosen template Id
   */
  @property({
    type: 'string',
    description: "Restaurant's chosen template Id",
  })
  templateId?: string;

  /**
   * Restaurant's logo url
   */
  @property({
    type: 'string',
    description: "Restaurant's logo url",
  })
  logo?: string;

  /**
   * Restaurant's self description
   */
  @property({
    type: 'string',
    description: "Restaurant's self description",
  })
  description?: string;

  /**
   * Restaurant's banner imageUrl
   */
  @property({
    type: 'string',
    description: "Restaurant's banner imageUrl",
  })
  bannerImage?: string;

  constructor(data?: Partial<Restaurant>) {
    super(data);
  }
}

export interface RestaurantRelations {
  // describe navigational properties here
}

export type RestaurantWithRelations = Restaurant & RestaurantRelations;
