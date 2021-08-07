import {inject} from '@loopback/core';
import {repository, Where} from '@loopback/repository';
import {
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
  RestHttpErrors
} from '@loopback/rest';
import {FILE_UPLOAD_SERVICE} from '../keys';
import {getEmailFromHeader} from '../lib/header-parser';
import {ItemRepository, RestaurantRepository} from '../repositories';
import {FileUploadHandler} from '../types';

/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileUploadController {
  /**
   * Constructor
   * @param handler - Inject an express request handler to deal with the request
   */
  constructor(
    @repository(ItemRepository)
    public itemRepository: ItemRepository,
    @repository(RestaurantRepository)
    public restaurantRepository: RestaurantRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
  ) { }
  @post('/restaurantImageUpload', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async restaurantResourceUpload(
    @requestBody.file()
    request: Request,
    @param({"name": "authorization", "in": "header", "required": true}) authorization: string,
    @param({"name": "type", "in": "query", "required": true}) type: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    const res = await this.restaurantRepository.findOne(whereFilter);
    if (res) {
      const restaurantId = res.id;
      request.query.restaurantId = restaurantId;
      return this.callFileUploadService(request, response);
    } else {
      throw new HttpErrors.NotFound('restaurant not registered');
    }
  }
  async callFileUploadService(request: Request, response: Response) {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(FileUploadController.getFilesAndFields(request));
        }
      });
    });
  }

  @post('/itemImageUpload', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async itemImageUpload(
    @requestBody.file()
    request: Request,
    @param({"name": "authorization", "in": "header", "required": true}) authorization: string,
    @param({"name": "itemId", "in": "query", "required": true}) itemId: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    const email = await getEmailFromHeader(authorization);
    if (!email) {
      throw RestHttpErrors.missingRequired('{ authorization Header }');
    }
    const whereFilter: Where = {where: {email: email}};
    const res = await this.restaurantRepository.findOne(whereFilter);
    if (res) {
      const restaurantId = res.id;
      request.query.restaurantId = restaurantId;
      request.query.type = 'item';
      const itemFilter: Where = {where: {id: itemId}};
      const item = await this.itemRepository.findOne(itemFilter);
      if (item && item.restaurantId === restaurantId) {
        return this.callFileUploadService(request, response);
      } else {
        throw new HttpErrors.NotFound('item not found for restaurant');
      }
    } else {
      throw new HttpErrors.NotFound('restaurant not registered');
    }
  }

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private static getFilesAndFields(request: Request) {
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
    });
    let files: object[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    return {files, fields: request.body};
  }
}
