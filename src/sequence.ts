import {DefaultSequence, RequestContext, RestHttpErrors} from '@loopback/rest';
import * as admin from 'firebase-admin';

export class MySequence extends DefaultSequence {
  /* eslint-disable */
  async authenticateToken(request: Request): Promise<any> {
    // console.log("context in middleware", request);

    if ((request.headers as any).authorization) {
      const authToken = (request.headers as any).authorization;
      if (authToken) {
        return admin
          .auth()
          .verifyIdToken(authToken)
          .then((token: any) => {
            console.log('varified ', token);
            return;
          })
          .catch(async (error: {message: any}) => {
            console.log('error', error);
            return error.message;
          });
      } else {
        return;
      }
    } else {
      return;
    }
  }
  async handle(context: RequestContext) {
    const request: any = context.request;
    const response: any = context.response;
    const err = await this.authenticateToken(request);
    if (err != undefined) {
      console.log(err);
      response.status('400');
      return this.reject(
        context,
        RestHttpErrors.invalidData(err, 'Authorization Header'),
      );
    } else {
      const result = await super.handle(context);
      return result;
    }
  }
  /* eslint-enable */
}
