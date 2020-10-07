import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'usu-fr-gui-commons/services';


@Injectable({
    providedIn: 'root'
})
export class ScenarioService {
   
    uri: string;
    uriRef: string;

    constructor(private apiService: ApiService){
        this.uri = 'admin-client/scenario';
        this.uriRef = 'referential/scenario';
    }
    getAllByCompany(params): Observable<any> {
        return this.apiService.get(`${this.uriRef}`, params);
      }
    
      getById(params): Observable<any> {
        return this.apiService.get(`${this.uri}/details`, params);
      }
    
      update(body): Observable<any> {
        return this.apiService.put(`${this.uri}`, body);
      }
    
      create(body): Observable<any> {
        return this.apiService.post(`${this.uri}`, body);
      }
    
      remove(id, body): Observable<any> {
        return this.apiService.delete(`${this.uri}/${id}/todelete?companyId=${body.companyId}`);
      }

}