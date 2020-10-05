import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ApiService} from 'usu-fr-gui-commons/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {
  uri: string;
  constructor(private apiService: ApiService) {
    this.uri = 'admin-client/users';
  }

  queryProfiles(params): Observable<any> {
    return this.apiService.get(this.uri + '/profiles', params);
  }



}
