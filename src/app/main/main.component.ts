import { Component, OnDestroy, OnInit } from '@angular/core';
import {config} from '../config//common-config';

import {BaseMain} from 'usu-fr-gui-commons/classes/BaseMain';
import {EasyContent, EasyCompanyApp, EasyUser} from '../../../node_modules/usu-fr-gui-commons/tools/index';
import {CompaniesService} from 'usu-fr-gui-commons/services/companies.service';

import { UsuThemingService } from '@usu/angular-components';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-main-menu',
    templateUrl:'./main.component.html',
    styleUrls: ['./main.component.scss']
})
  

export class MainComponent extends BaseMain implements OnInit, OnDestroy {
    
    names: string[] = [];
    currentName = '';
    company: any;
    companyName: string;
    userName: string;
    default_versionName = 'SmartCollect';
    versionName: string;
    version: string;
    visible = true;
    orangeThemeControl = new FormControl(false);

    constructor(
        private easyContent: EasyContent,
        private companiesService: CompaniesService,
        private easyUser: EasyUser,
        protected easyCompanyApp: EasyCompanyApp){

        super(easyCompanyApp); 
    }
    ngOnInit(): void {
        super.ngOnInit();

        console.log("====> Main Component");

    const companyId = this.easyCompanyApp.getCompanyId();
    if (companyId !== null) {
      this.companiesService.getById(companyId).subscribe(res => {
        this.company = res;
        this.companyName = this.company.name;
      })
    }

    this.userName = this.easyUser.getName();
    this.versionName = !config.versionName ? this.default_versionName : config.versionName;
    this.version = config.version;
    }

    
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}