import {Injectable} from '@angular/core';
import {ApiService} from 'usu-fr-gui-commons/services/api.service';
import {Observable} from 'rxjs/Rx';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

  uri: string;

  constructor(private apiService: ApiService) {
    this.uri = 'admin-client/users';
  }

  getUsersByCompany(params): Observable<any> {
    return this.apiService.get(this.uri, params);
  }

  getById(id, params): Observable<any> {
    return this.apiService.get(`${this.uri}/${id}`, params);
  }

  saveUser(body): Observable<any> {
    return this.apiService.post(this.uri, body);
  }

  updateUser(id, body): Observable<any> {
    return this.apiService.put(`${this.uri}/${id}/preferences`, body);
  }

  remove(id, body): Observable<any> {
    return this.apiService.post(`${this.uri}/${id}/todelete`, body);
  }

  addProfile(id, body): Observable<any> {
    return this.apiService.put(`${this.uri}/${id}/profiles/add`, body);
  };

  removeProfile(id, body): Observable<any> {
    return this.apiService.put(`${this.uri}/${id}/profiles/remove`, body);
  }

}
