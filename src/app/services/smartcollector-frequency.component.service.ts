import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {ApiService} from 'usu-fr-gui-commons/services/api.service';


@Injectable({
    providedIn:'root'
})
export class SmartcollectorFrequencyComponentService {
  uri = '';

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.uri = 'admin-client/quantum'
  }

  getScFrequencyList = (params): Observable<any> => {
    return this.apiService.get(this.uri, params);
  };

  applyScFrequency = (params): Observable<any> => {
    return this.apiService.post(`${this.uri}/apply`, params);
  };

  saveScFrequency = (params): Observable<any> => {
    return this.apiService.post(`${this.uri}`, params);
  };
}
