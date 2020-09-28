// import config from './config';
// import components from './components/components';
// import resources from './resources/resources';
// import services from './services/services';
// import runner from './run';
//
// // import icons from './assets/icons/icomoon/style.css';
//
// import scss from './index.scss';

// import common from '../node_modules/easytrust-gui-common/common');

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export default function(keycloak) {
//
    keycloak.init({
        onLoad: 'login-required',
        responseMode: 'query'
    }).success(function(res) {
        console.log("====> res:", res);
        successCallback(keycloak);
    }).error(function(err) {
        console.log("====> err:", err);
        console.error('err', err);
    });

    function successCallback(keycloakInst) {

        // angular.module('app', [
        //     'ngMaterial',
        //     'ngMessages',
        //     common,
        //     components,
        //     resources,
        //     services
        // ])
        // /**
        //  * settings for $translateProvider
        //  * settings for date format for material datePicker
        //  */
        // .config(config)
        // /**
        //  * authentication when first page loading
        //  */
        // .run(runner(keycloak));
        //
        // const appDiv = document.getElementById("reportApp");
        //
        // angular.bootstrap(angular.element(appDiv), ['app']);

        if (environment.production) {
          enableProdMode();
        }


        platformBrowserDynamic().bootstrapModule(AppModule);
    }
};
