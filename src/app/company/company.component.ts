import { Component , OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EasyCompanyApp, EasyGlobals, EasyUser} from 'usu-fr-gui-commons/tools/index';


@Component({
    selector: 'app-company',
    templateUrl :'./company.component.html',
    styleUrls : ['./company.component.scss']
})

export class CompanyComponent implements OnInit {
    
    
    constructor(){}
    ngOnInit(): void {
      console.log("======> This is company Component !!!");
    }

}