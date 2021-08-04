import {Client, expect} from '@loopback/testlab';
import {BabitzApplication} from '../..';
import {setupApplication} from './test-helper';

describe('PingController', () => {
  let app: BabitzApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /ping', async () => {
    const res = await client.get('/ping?msg=world').expect(200);
    expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });
  it('invokes GET /ping with random Authorization header', async () => {
    const res = await client
      .get('/ping?msg=world')
      .set({Authorization: 'randomVal'})
      .expect(400);
    expect(res.body).to.ownProperty('error');
  });
});
