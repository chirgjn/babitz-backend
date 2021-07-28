import {DefaultSequence, RequestContext, RestHttpErrors} from '@loopback/rest';
import * as admin from 'firebase-admin';


export class MySequence extends DefaultSequence {
  async authenticateToken(request: Request): Promise<any> {
    // console.log("context in middleware", request);

    if ((request.headers as any).authorization) {
      let authToken = (request.headers as any).authorization;
      if (authToken) {
        return admin
          .auth()
          .verifyIdToken(authToken)
          .then((token: any) => {
            console.log("varified ", token);
            return;
          })
          .catch(async (error: {message: any;}) => {
            console.log("error", error);
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
    let request: any = context.request;
    let response: any = context.response;
    let err = await this.authenticateToken(request);
    if (err != undefined) {
      console.log(err);
      response.status('400');

      return this.reject(context, RestHttpErrors.invalidData(err, "Authorization Header"));
    } else {
      let result = await super.handle(context);
      return result;
    }

  };
}
