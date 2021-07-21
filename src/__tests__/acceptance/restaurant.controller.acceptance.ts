import {Client, expect} from '@loopback/testlab';
import {BabitzApplication} from '../..';
import {setupApplication} from './test-helper';

describe('RestaurantController', () => {
  let app: BabitzApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes POST /restaurants', async () => {
    const res = await client.post('/restaurants').send({
      "name": "string",
      "email": "user@example.com",
      "mobileNumber": "string",
      "address": "string",
      "billingInfo": "string",
      "templateId": "string",
      "logo": "string",
      "description": "string",
      "bannerImage": "string"
    }).expect(200);
    expect(res.body).hasOwnProperty('id');
    expect(res.body.id).to.be.String();
  });
  it('invokes GET /restaurants', async () => {
    const res = await client.get('/restaurants').expect(200);
  });
});
