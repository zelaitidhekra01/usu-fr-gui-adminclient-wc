import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'usu-fr-gui-commons/services';


@Injectable({
    providedIn:'root'
})
export class DefaultConnectionService{
    uri: string;

    /**
     * Class constructor
     * @param {ApiService} Common method for build ws urls
     */
    constructor(private apiService: ApiService) {
      this.uri = 'admin-client/product/instance/default/password';
    }
  
    /**
     * Get Default connection for each product and for a company
     * @param Company identifier and roles
     * @returns {Observable<any>} one line for each product for which exist default connection data
     */
    getDefaultConnectionByCompany(params): Observable<any> {
      return this.apiService.get(this.uri, params);
    }
  
    getById(id, params): Observable<any> {
      return this.apiService.get(`${this.uri}/${id}`, params);
    }
  
    /**
     * Save default connection credential for a specific collector
     * @param body
     * @returns {Observable<any>}
     */
    saveDefaultConnection(body): Observable<any> {
      return this.apiService.post(this.uri, body);
    }
  
    updateDefaultConnection(body): Observable<any> {
      return this.apiService.put(this.uri, body);
    }
  
  
    /**
     * Flag to delete a default connection
     * @param id
     * @param body
     * @returns {Observable<any>}
     */
    remove(id, body): Observable<any> {
      return this.apiService.post(`${this.uri}/${id}/todelete`, body);
    }
  

}