import {Injectable} from '@angular/core';
import * as Keycloak from 'keycloak-js';
import {environment} from '../environments/environment';



@Injectable()
export class KeycloakService {
    static auth: any = {};
    static KeycloakAuth: any = {};
    static _localhosts = ['localhost', '10.170.8.150', '10.170.8.151', '10.170.8.152', '10.170.8.153', '10.170.8.154'];
    static redirectionUrl;

    static init(): Promise<any> {
        console.log('======> KeycloakService / init');
        let _hostname = window.location.hostname;
        let _origin = window.location.origin;
        let kcBaseUrl = '';
        if (this._localhosts.indexOf(_hostname) !== -1) {
            kcBaseUrl = `https://dev2.aspera-cloud.com/auth`;
            KeycloakService.redirectionUrl = 'https://dev2.aspera-cloud.com';
        } else {
            kcBaseUrl = `${_origin}/auth`;
            KeycloakService.redirectionUrl = _origin;
        }
        console.log('======> KeycloakService / kcBaseUrl:', kcBaseUrl);
          const obj = {
            url: kcBaseUrl,
            'realm-public-key': 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApZvmSjFi6cgumUSVpt/ZoibTJHQTCqIcL39jVCwzF8DXU+hGnWyAfEpnGJUyqqOgwKopxeP5DzsW1JhQjGnapDDcpn8yEtx3R11zpH5GTl6ajBl5YMV/O4QddcXP3PNrTixW1P60BSWMQLAj2rOAIOlYFruwxayzr/G+is0nK2X2qo/NuAZJqvHl970crH2yPGbHOYojere7mYdX1NX9uNw7SMNNIBGF5XufSvayKa9oqXpZ2mTzVBnQcixFV4cNSkSpCKCiXtcleIrYy8OeD8kIZnbN4EGkeL8LNZQj2gBq76nXTYVPkztMYJ//SIf/n2yUFPw1cHu038FazuFpmwIDAQAB',
            realm: 'SmartCollect',
            clientId: 'GUI',
            'ssl-required': 'all',
            'public-client': true
        };
        const _keycloakAuth: Keycloak.KeycloakInstance = Keycloak(obj);
        KeycloakService.KeycloakAuth = _keycloakAuth;
        KeycloakService.auth.loggedIn = false;

        return new Promise((resolve, reject) => {
            _keycloakAuth.init({ onLoad: 'login-required', checkLoginIframe: false, responseMode: 'query' })
              .success(() => {
                console.log('======> tKeycloakService / success');
                KeycloakService.auth.loggedIn = true;
                KeycloakService.auth.authz = _keycloakAuth;
                console.log(KeycloakService.auth.authz.tokenParsed);KeycloakService.auth.logoutUrl = _keycloakAuth.authServerUrl
                + '/realms/SmartCollect/protocol/openid-connect/logout?redirect_uri='
                + document.baseURI;
                resolve();
              })
              .error(e => {
                console.log('======> tKeycloakService / error:', e);
                reject();
              });
          });
    }

    getKeycloak(): any {
        console.log('======> tKeycloakService / getKeycloak');
        return KeycloakService.KeycloakAuth;
    }

    logout() {
        console.log('======> tKeycloakService / logout');
        KeycloakService.auth.loggedIn = false;
        KeycloakService.auth.authz = null;
        KeycloakService.KeycloakAuth.logout();
        window.location.href = KeycloakService.auth.logoutUrl;
    }

    // static getUsername(): string {
    // 	return KeycloakService.auth.authz.tokenParsed.preferred_username;
    // }

    getUsername(): string {
        console.log('======> tKeycloakService / getUsername');
        return KeycloakService.auth.authz.tokenParsed.preferred_username;
    }

    static getFullName(): string {
        console.log('======> tKeycloakService / getFullName');
        return KeycloakService.auth.authz.tokenParsed.name;
    }

    getToken(): Promise<string> {
        console.log('======> tKeycloakService / getToken');
        return new Promise<string>((resolve, reject) => {
            if (KeycloakService.auth.authz.token) {
                KeycloakService.auth.authz
                    .updateToken(10)
                    .success(() => {
                        resolve(<string>KeycloakService.auth.authz.token);
                    })
                    .error(() => {
                        window.location.href = KeycloakService.redirectionUrl;
                        reject('Failed to refresh token');
                    });
            } else {
                reject('Not logged in');
            }
        });
    }
}
