import {Injectable} from '@angular/core';
import {ApiService} from 'usu-fr-gui-commons/services/api.service';
import {Observable} from 'rxjs/Rx';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn:'root'
})
export class CollectorService {

  uri: string;

  /**
   * Class constructor
   * @param {ApiService} Common method for build ws urls
   */
  constructor(private apiService: ApiService) {
    this.uri = 'admin-client/ref-collector';
  }

  /**
   * Get Default connection for each product and for a company
   * @param Company identifier and roles
   * @returns {Observable<any>} one line for each product for which exist default connection data
   */
  getAllCollector(params): Observable<any> {
    return this.apiService.get(this.uri, params);
  }

}

