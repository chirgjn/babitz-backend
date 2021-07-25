import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
const admin = require('firebase-admin');
const firebaseConfig = {
  apiKey: 'AIzaSyBdJSSsIDI2xfAhdWhcIjjzrCAEFoXbo7E',
  authDomain: 'babitz.firebaseapp.com',
  projectId: 'babitz',
  storageBucket: 'babitz.appspot.com',
  messagingSenderId: '500355572360',
  appId: '1:500355572360:web:c04e9f2bf594ac9d79b53d',
};
// admin.initializeApp(firebaseConfig);
export {ApplicationConfig};

export class BabitzApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    admin.initializeApp(firebaseConfig);
    // this.sequence(MyAuthenticatingSequence);
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
