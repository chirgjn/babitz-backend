import {Entity, model, property} from '@loopback/repository';

/**
 * The model class is generated from OpenAPI schema - Restaurant
 * Restaurant
 */
@model({name: 'Restaurant'})
export class Restaurant extends Entity {
  constructor(data?: Partial<Restaurant>) {
    super(data);
    if (data != null && typeof data === 'object') {
      Object.assign(this, data);
    }
  }


  /**
   *  id.
   */
  @property({
    type: 'string',
    id: true,
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      dataType: 'uuid',
    }
  })
  id?: string;
  /**
   * Restaurant's name
   */
  @property({
    jsonSchema: {
      type: 'string',
      maxLength: 50,
      description: "Restaurant's name",
    }
  })
  name?: string;

  /**
   * Restaurant's email
   */
  @property({
    jsonSchema: {
      type: 'string',
      maxLength: 50,
      format: 'email',
      description: "Restaurant's email",
    }
  })
  email?: string;

  /**
   * Restaurant's mobile number
   */
  @property({
    jsonSchema: {
      type: 'string',
      description: "Restaurant's mobile number",
    }
  })
  mobileNumber?: string;

  /**
   * Restaurant's address
   */
  @property({
    jsonSchema: {
      type: 'string',
      description: "Restaurant's address",
    }
  })
  address?: string;

  /**
   * Restaurant's upi Id on a upi platform
   */
  @property({
    jsonSchema: {
      type: 'string',
      description: "Restaurant's upi Id on a upi platform",
    }
  })
  billingInfo?: string;

  /**
   * Restaurant's chosen template Id
   */
  @property({
    jsonSchema: {
      type: 'string',
      description: "Restaurant's chosen template Id",
    }
  })
  templateId?: string;

  /**
   * Restaurant's logo url
   */
  @property({
    jsonSchema: {
      type: 'string',
      description: "Restaurant's logo url",
    }
  })
  logo?: string;

  /**
   * Restaurant's self description
   */
  @property({
    jsonSchema: {
      type: 'string',
      description: "Restaurant's self description",
    }
  })
  description?: string;

  /**
   * Restaurant's banner imageUrl
   */
  @property({
    jsonSchema: {
      type: 'string',
      description: "Restaurant's banner imageUrl",
    }
  })
  bannerImage?: string;

}

export interface RestaurantRelations {
  // describe navigational properties here
}

export type RestaurantWithRelations = Restaurant & RestaurantRelations;


