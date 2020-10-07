import {Injectable} from '@angular/core';
import {ApiService} from 'usu-fr-gui-commons/services/api.service';
import {Observable} from 'rxjs/Rx';
import {Organization} from '../models/organization.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {

  uri: string;

  constructor(private apiService: ApiService) {
    this.uri = 'admin-client/organizations';
  }

  query(params?): Observable<Organization[]> {
    return this.apiService.get('referential/organizations', params);
  }

  get(id, params): Observable<Organization> {
    return this.apiService.get(`${this.uri}/${id}`, params);
  }

  save(organization): Observable<Organization> {
    return this.apiService.post(this.uri, organization);
  }

  update(organization): Observable<Organization> {
    return this.apiService.put(this.uri, organization);
  }

  delete(params, id): Observable<any> {
    return this.apiService.post(`${this.uri}/${id}/todelete`, params);
  }
}
