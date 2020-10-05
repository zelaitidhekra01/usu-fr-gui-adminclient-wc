import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from 'usu-fr-gui-commons/components/confirmation-dialog/confirmation-dialog.component';
import { EasyCompanyApp, EasyGrid } from 'usu-fr-gui-commons/tools';
import { CompanyUser } from '../models/company-user.model';
import { DialogData } from '../models/dialog-data.model';
import { UsersService } from '../services/users.service';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import {gridColumns} from './grid/grid-columns';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit, AfterViewInit {
   
    displayed = false;
    rows = [];
    loadingIndicator = true;
    timeout: any;
    _companyId: string;
    _temp = [];
  
    reorderable = true;
    swapColumns = false;
  
    gridColumns: any;
  
    templates: any;

    @ViewChild('grid',{static: true}) grid: any;
    @ViewChild('hdrTpl',{static: true}) hdrTpl: TemplateRef<any>;
    @ViewChild('actionTpl',{static: true}) actionTpl: TemplateRef<any>;
  
    constructor(private easyCompanyApp: EasyCompanyApp,
              private usersService: UsersService,
              public dialog: MatDialog,
              public translate: TranslateService,
              public easyGrid: EasyGrid){

    }
    
    ngOnInit() {

      this.easyGrid.clearArrays();
      this.easyGrid.setup({updateScopeData: this._successCallback});
      this._companyId = this.easyCompanyApp.getCompanyId();
      this.query();
  
      this.templates = this.easyGrid.getTemplates();
  
      this.gridColumns = this.gridColumns = gridColumns(this);
    }
  
    ngAfterViewInit() {
      this.easyGrid.setGridApi(this.grid);
    }
  
    onPage(event) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        console.log('paged!', event);
      }, 100);
    }
  
    query() {
      this.displayed = false;
      const params = {companyId: this._companyId, profileName: ['Admin', 'Standard', 'LC4Oracle']};
      this.usersService.getUsersByCompany(params).subscribe(this._successCallback);
    }
  
    addUser(): void {
      this.dialog.open(AddUserDialogComponent, {width: '800px', disableClose: true, data: new CompanyUser()});
    }
  
    editUser(row: CompanyUser): void {
      this.dialog.open(AddUserDialogComponent, {width: '800px', disableClose: true, data: row});
  
    }
  
    deleteUser = (row: CompanyUser) => {
      const dialogData: DialogData = {
        title: 'LABEL_DELETE',
        message: 'INFO_DELETE_CONFIRM',
        buttonLabel: 'LABEL_DELETE',
        lineName: `${row.preferences.firstName} ${row.preferences.lastName}`,
        callBack: (hideDialog) => {
          const queryParams = {
            companyId: this.easyCompanyApp.getCompanyId()
          };
          this.usersService.remove(row.identifier, queryParams).subscribe(res => {
            this.easyGrid.removeRow(row.identifier, false);
            hideDialog();
  
          });
        }
      };
  
      this.dialog.open(ConfirmationDialogComponent, {disableClose: true, data: dialogData});
    };
  
    updateFilter = (event, column) => {
      this.easyGrid.updateFilter(event, column, this._temp, this, 'rows', 0);
    };
  
  
    private _successCallback = (res) => {
      this._temp = [...res];
      this.rows = res;
      this.easyGrid.setData(this.rows);
      this.easyGrid.updateFilter(undefined, undefined, this._temp, this, 'rows', 0)
      this.loadingIndicator = false;
      this.displayed = true;
    };
  }
  