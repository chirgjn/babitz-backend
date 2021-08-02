import {
  repository,
  Where
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors, param,
  patch, post,
  requestBody,
  response,
  RestHttpErrors
} from '@loopback/rest';
import {getEmailFromHeader} from '../lib/header-parser';
import {User} from '../models';
import {ItemRepository, UserRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @repository(ItemRepository)
    public itemRepository: ItemRepository,
  ) { }

  @post('/registerUser')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id', 'email']
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
    @param.header.string('authorization') authorization: string,
  ): Promise<User> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    user.email = email;
    return this.userRepository.create(user);
  }

  @patch('/updateUserDetails')
  @response(200, {
    description: 'Updated user details',
    content: {'application/json': {schema: User}},
  })
  async updateDetails(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'UserDetails',
            exclude: ['id', 'email'],
            partial: true
          })
        },
      },
    })
    user: Omit<User, 'id'>,
    @param.header.string('authorization') authorization: string,
  ): Promise<User | null> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    let userRecord = await this.userRepository.findOne(whereFilter);
    if (userRecord) {
      await this.userRepository.updateById(userRecord.id, user);
      return this.userRepository.findOne(whereFilter);
    } else {
      throw new HttpErrors.NotFound('user not registered');
    }
  }

  @get('/getUserProfile')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async getMyProfile(
    @param.header.string('authorization') authorization: string,
  ): Promise<User> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    let userRecord = await this.userRepository.findOne(whereFilter);
    if (userRecord) {
      return userRecord;
    } else {
      throw new HttpErrors.NotFound('user not registered');
    }
  }

}
