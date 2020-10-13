import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {EasyCompanyApp, EasyUser, EasyGrid, EasyGridColumnFilterService, EasyGlobals} from 'usu-fr-gui-commons/tools';
import * as lodash from 'lodash';
import {MatDialog} from '@angular/material/dialog';
import {gridColumns} from './grid/grid-columns';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs/Subscription';
import {ParamsStorageService} from 'usu-fr-gui-commons/tools/params-storage.service';
import {ErrorLogService} from '../services/error-log.service';
import {DetailMessageDialogComponent} from './detail-message-dialog/detail-message-dialog.component';


@Component({
  selector: 'app-error-log',
  templateUrl: './error-log.component.html',
  styleUrls: ['./error-log.component.scss']
})
export class ErrorLogComponent implements OnInit, AfterViewInit, OnDestroy {
  _ = lodash;
  _companyId = this.easyCompanyApp.getCompanyId();
  _scrollNbLines = 50;

  displayed = false;
  getHeaderHeight = this.easyGrid.getHeaderHeight();
  logsData = [];
  isLoading = false;

  defaultParams: any;

  routerLinkDevice = `${this.easyGlobals.inventoryUrl()}#/main/device-detail`;
  routerLinkSmartcollector = `${this.easyGlobals.inventoryUrl()}#/main/smartcollector-detail`;

  columns = [];
  subscription: Subscription;

  lastRefreshDate = new Date(Date.now());
  isRefreshing = false;
  refreshDateFormat = this.easyUser.getDateFormatOnLang();

  @ViewChild('grid',{static: true}) grid: any;
  @ViewChild('hdrTpl',{static: true}) hdrTpl: TemplateRef<any>;
  @ViewChild('hdrDateTpl',{static: true}) hdrDateTpl: TemplateRef<any>;
  @ViewChild('hdrDetailTpl',{static: true}) hdrDetailTpl: TemplateRef<any>;
  @ViewChild('serverTpl',{static: true}) serverTpl: TemplateRef<any>;
  @ViewChild('quantumTpl',{static: true}) quantumTpl: TemplateRef<any>;
  @ViewChild('detailMessageTpl',{static: true}) detailMessageTpl: TemplateRef<any>;
  @ViewChild('errorMessageTpl',{static: true}) errorMessageTpl: TemplateRef<any>;

  constructor(private easyCompanyApp: EasyCompanyApp,
              private easyUser: EasyUser,
              private errorLogService: ErrorLogService,
              private dialog: MatDialog,
              private translateService: TranslateService,
              private paramsStorageService: ParamsStorageService,
              private easyGridColumnFilterService: EasyGridColumnFilterService,
              public easyGlobals: EasyGlobals,
              public easyGrid: EasyGrid) {
  }

  ngOnInit() {
    /** default params */
    this.defaultParams = {
      companyId: this._companyId,
      orderBy: 'modificationDate_DESC',
      firstResult: 0,
      lastResult: this._scrollNbLines
    };

    /** clear arrays */
    this.easyGrid.clearArrays();
    this.easyGridColumnFilterService.clearAll();

    /** setup the grid */
    this.easyGrid.setup({
      scrollCallback: this.errorLogService.getAll,
      updateScopeData: this._getAllLogs,
      queryParams: this._.cloneDeep(this.defaultParams),
      step: this._scrollNbLines
    }, 0);

    this.subscription = this.easyGridColumnFilterService.observeFilter();

    /** definition of columns */
    this.columns = gridColumns(this);
  }

  /** translate function to grid labels */
  _translate = (key: string): string => {
    return this.translateService.instant(key);
  };

  /** setup grid api after view init and refresh grid */
  ngAfterViewInit() {
    this.grid.appScope = this;
    this.easyGrid.setGridApi(this.grid);
    this.easyGrid.updateContent(0);
  }

  /** unsubscribe to the web service */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /** get all data */
  _getAllLogs = (res) => {
    this.logsData = res;
    this.easyGrid.setData(this.logsData);
    this.isRefreshing = false;
    this.isLoading = false;
    this.displayed = true;
  };

  refresh = () => {
    this.easyGrid.resetGrid({}, 0);
    this.isRefreshing = true;
    this.lastRefreshDate = new Date(Date.now());
    this.easyGrid.updateContent(0);
  };

  /** open server detail */
  openServerDetail = (serverId) => {
    const params = {
      serverId: serverId ? serverId : 0
    };
    this.paramsStorageService.setUrlParams({[this.paramsStorageService.DEVICE_DETAIL]: params});
  };

  /** open smartcollector detail */
  openQuantumDetail = (entity) => {
    const params = {
      quantumId: entity.quantumId ? entity.quantumId : 0,
      serverId: entity.serverId ? entity.serverId : 0
    };
    this.paramsStorageService.setUrlParams({[this.paramsStorageService.SMARTCOLLECTOR_DETAIL]: params});
  };

  /** open popup detail */
  openPopupDetailDialog = (entity, type) => {
    const parameters = {
      companyId: this.defaultParams.companyId,
      type: type
    };
    this.errorLogService.getDetail(entity.identifier, parameters).subscribe(
      res => {
        const data = {
          type: type,
          message: res.data
        };
        this.dialog.open(DetailMessageDialogComponent, {disableClose: true, data: data});
      }
    );
  };
}

