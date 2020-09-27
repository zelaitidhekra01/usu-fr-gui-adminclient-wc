import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {KeycloakService } from './keycloak/keycloak.service';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { from } from 'rxjs';

if (environment.production) {
  enableProdMode();
}

KeycloakService.init()
  .then(() => {
    console.log('======> KeycloakService / main.ts / then');
    platformBrowserDynamic().bootstrapModule(AppModule)
  })
  .catch(e => {
    console.log('======> KeycloakService / main.ts / error:', e);
    console.log(e);
  });