import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ApiService} from 'usu-fr-gui-commons/services/api.service';


@Injectable({
    providedIn:'root'
})
export class ErrorLogService {
  uri = 'admin-client/debug-message';

  constructor(private apiService: ApiService) {
  }

  getAll = (params): Observable<any> => {
    return this.apiService.get(`${this.uri}`, params);
  };

  getDetail = (id, params): Observable<any> => {
    return this.apiService.get(`${this.uri}/${id}`, params);
  };
}
