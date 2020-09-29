import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Offer } from 'usu-fr-gui-commons/model';
import { ApiService } from 'usu-fr-gui-commons/services';

@Injectable({
    providedIn: 'root'
})

export class CompanyService {

    uri: string;

    constructor(private apiService: ApiService){

        this.uri = 'referential/access-control/companies';
    }
    getCompanyById(companyId): Observable<Offer> {
        return this.apiService.get(this.uri + '/' + companyId);
    }

    update(company) {
        return this.apiService.put(this.uri, company);
    }
}