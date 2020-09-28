import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {KeycloakService } from '../node_modules/usu-fr-gui-commons/keycloak/';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { from } from 'rxjs';

if (environment.production) {
  enableProdMode();
}

KeycloakService.init()
  .then(() => {
    platformBrowserDynamic().bootstrapModule(AppModule)
  })
  .catch(e => {
    console.log(e);
  });