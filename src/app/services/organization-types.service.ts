import {Injectable} from '@angular/core';
import {ApiService} from 'usu-fr-gui-commons/services/api.service';
import {Observable} from 'rxjs/Rx';
import {EasyGlobals} from 'usu-fr-gui-commons/tools/globals.service';
import {map} from 'rxjs/operators';
import {OrganizationType} from '../models/organization.type.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationTypesService {

  uri: string;

  constructor(private apiService: ApiService, private easyGlobals: EasyGlobals) {
    this.uri = 'admin-client/organizationtypes';
  }

  query(params): Observable<OrganizationType[]> {
    return this.apiService.get(this.uri, params).pipe(map((res) => {
      return res;
    }));
  }

  get(id): Observable<OrganizationType> {
    return this.apiService.get(this.uri + id).pipe(map((res) => {
      return res.data;
    }));
  }

  save(organizationType): Observable<OrganizationType> {
    return this.apiService.post(this.uri, organizationType);
  }

  update(organizationType): Observable<OrganizationType> {
    return this.apiService.put(this.uri, organizationType);
  }

  delete(organizationType): Observable<OrganizationType> {
    return this.apiService.post(this.uri + '/' + organizationType.identifier + '/todelete', {companyId: organizationType.companyId});
  }
}
