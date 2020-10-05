import { Component , OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { OfferService } from 'usu-fr-gui-commons/services';
import {EasyCompanyApp, EasyGlobals, EasyUser} from 'usu-fr-gui-commons/tools/index';
import { CompanySettingsModel } from '../models/company-settings.model';
import {CompanyService} from '../services/company.service';
import {EasyReferentials} from 'usu-fr-gui-commons/tools/easy.referentials.service';
import { FormControl } from '@angular/forms';
import { UsuThemingService } from '@usu/angular-components';

@Component({
    selector: 'app-company',
    templateUrl :'./company.component.html',
    styleUrls : ['./company.component.scss']
})

export class CompanyComponent implements OnInit {
    
  _companyId: any;
  formValid = true;
  languages = [];
  offers = [];

  names: string[] = [];
  currentName = '';


  companyInfo: CompanySettingsModel = new CompanySettingsModel();
  companyOffersList = [];

  contracts: number;
  completnessServer: number;
  completnessInstance: number;

  regexUrl: RegExp = /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;

    
    constructor(private translate: TranslateService,
      private easyUser: EasyUser,
      private easyCompanyApp: EasyCompanyApp,
      private easyGlobals: EasyGlobals,
      private companyService: CompanyService,
      private offerService: OfferService,
      private referentialService: EasyReferentials)
      {

      
    
      }


    ngOnInit(): void {
      this.formValid = true;
      this._companyId = this.easyCompanyApp.getCompanyId();
      this.query();
    }

    _setOfferChecked() {
      if (this.companyOffersList && this.companyOffersList.length) {
        const tmp = [];
        for (const offer of this.companyOffersList) {
          if (!offer.toBeDeleted) {
            tmp[offer.offerId] = {
              isChecked: true,
              nbServer: offer.nbServer
            };
          }
        }
        this.companyOffersList = tmp;
        console.log("===> _setOfferChecked()/ this.companyOffersList", this.companyOffersList);
      }
  
    }
      /*
   prepare data to persist
   and call @put service
   */
  onClickSaveButton() {
    const formDataToSend = this._prepreDataForSave();
    this.companyService.update(formDataToSend).subscribe(res => {
    });
  }
  /*
    create json obj to persist
   */
  _prepreDataForSave() {

    const data: any = {};
    // set form data

    data.identifier = this._companyId;
    data.name = this.companyInfo.name;
    data.websiteUrl = this.companyInfo.websiteUrl;
    data.languageId = this.companyInfo.languageId;
    data.welcomeMessage = this.companyInfo.welcomeMessage;
    data.comments = this.companyInfo.comments;
    data.languageId = this.companyInfo.languageId;
    data.isEnabled = this.companyInfo.isEnabled;

    data.tiles = this._prapareTilesForSave();
    data.companyOfferList = this._prepareResponseMultichoice(this.companyOffersList);
    return data;
  }


  /*
    build list of offers
   */

  _prepareResponseMultichoice(options) {
    const responses = [];
    for (const id in options) {
      if (options[id].isChecked) {
        responses.push({
          offerId: id,
          nbServer: options[id].nbServer
        });
      } else {
        responses.push({
          offerId: id,
          toBeDeleted: true
        });
      }
    }
    return responses;
  }
/*
    build tiles to persist
    starting  from value set in form input
   */
  _prapareTilesForSave() {
    const responses = [];
    responses.push({
      refTileId: 6,
      targetValue: this.contracts
    });

    responses.push({
      refTileId: 2,
      targetValue: this.completnessServer
    });

    responses.push({
      refTileId: 4,
      targetValue: this.completnessInstance
    });

    return responses;
  }

  /*
    retrieve companyInfo and offers
   */
  query() {
    this.companyService.getCompanyById(this._companyId).subscribe(this._successCallbackComp);
    this.languages = this.referentialService.languages();
  }

  private _successCallback = (res) => {
    this.offers = res;
  };

  private _successCallbackComp = (res) => {

    this.companyInfo = res;

    this.contracts = res.tiles.filter(tile => tile.refTileId === 6)[0].targetValue;
    this.completnessServer = res.tiles.filter(tile => tile.refTileId === 2)[0].targetValue;
    this.completnessInstance = res.tiles.filter(tile => tile.refTileId === 4)[0].targetValue;

    this.companyOffersList = res.companyOfferList;
    this.offerService.getAll().subscribe(this._successCallback);
    this._setOfferChecked();
  }

  public addName(): void {
    this.names.push(this.currentName);
    this.currentName = '';
  }
   


}