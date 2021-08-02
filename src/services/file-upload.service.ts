import {
  BindingScope,
  config,
  ContextTags,
  injectable,
  Provider,
} from '@loopback/core';
import {RestHttpErrors} from '@loopback/rest';
import multer from 'multer';
import multerS3 from 'multer-s3';
import {FILE_UPLOAD_SERVICE} from '../keys';
import restaurantImageTypes from '../lib/constants';
import {FileUploadHandler} from '../types';
const AWS = require('aws-sdk');
// Set the region

/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
@injectable({
  scope: BindingScope.TRANSIENT,
  tags: {[ContextTags.KEY]: FILE_UPLOAD_SERVICE},
})
export class FileUploadProvider implements Provider<FileUploadHandler> {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  constructor(@config() private options: multer.Options = {}) {
    AWS.config.update({
      accessKeyId: process.env.S3_ACCESSKEYID,
      secretAccessKey: process.env.S3_SECRETACCESSKEY,
      region: process.env.S3_REGION,
    });
    const s3 = new AWS.S3();
    this.options.storage = multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET ?? 'babitz-s3',
      key: function (req, file, cb) {
        //req.query
        console.log(file);
        if (fileFilter(req, file, (req as any).query.id)) {
          return cb(
            null,
            generateFileNameForAWS(
              (req as any).query.type,
              (req as any).query.restaurantId,
              (req as any).query.itemId,
            ),
          );
        } else {
          return cb(
            RestHttpErrors.unsupportedMediaType('our mediatype', [
              'image/jpeg',
              'image/png',
            ]),
          );
        }
      },
    });
  }

  value(): FileUploadHandler {
    return multer(this.options).any();
  }
}
function fileFilter(
  req: Express.Request,
  file: Express.Multer.File,
  arg2: (err: any, res: any) => void,
) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    return true;
  } else {
    return false;
  }
}
/**
 * @param type
 * @param restaurantId
 * @param id
 * @returns
 */
function generateFileNameForAWS(
  type: string,
  restaurantId: string,
  id?: string,
): string | undefined {
  if (restaurantImageTypes.includes(type)) {
    return `root/${restaurantId}/${type}`;
  } else if (type === 'item') {
    return `root/${restaurantId}/${type}/${id}`;
  } else {
    return undefined;
  }
  /* eslint-enable  @typescript-eslint/no-explicit-any */
}
