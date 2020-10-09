import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ConfirmationDialogComponent } from 'usu-fr-gui-commons/components';
import { DialogData } from 'usu-fr-gui-commons/model';
import { EasyCompanyApp, EasyGrid } from 'usu-fr-gui-commons/tools';
import { Collector } from '../models/collector.model';
import { DefaultConnection } from '../models/default-connection.model';
import { DefaultConnectionService } from '../services/default-connection.service';
import { AddDefaultConnectionDialogComponent } from './add-default-connection-dialog/add-default-connection-dialog.component';
import { collectors } from './constants';




@Component({
  selector: 'app-default-connection',
  templateUrl: './default-connection.component.html',
  styleUrls: ['./default-connection.component.scss']
})

export class DefaultConnectionComponent implements OnInit {


  rows = [];
  _temp = [];
  _companyId: any;

  @ViewChild(DatatableComponent) _gridApi: DatatableComponent;

  constructor(private easyCompanyApp: EasyCompanyApp,
    private defaultConnectionService: DefaultConnectionService,
    public dialog: MatDialog,
    public easyGrid: EasyGrid) {
  }
  ngOnInit(): void {
    this.easyGrid.clearArrays();
    this.easyGrid.setup({ updateScopeData: this._successCallback });
    this._companyId = this.easyCompanyApp.getCompanyId();
    this.query();


  }

  ngAfterViewInit() {

    this.easyGrid.setGridApi(this._gridApi);
  }

  query() {
    const params = { companyId: this._companyId, profileName: ['Admin', 'Standard', 'LC4Oracle'] };
    this.defaultConnectionService.getDefaultConnectionByCompany(params).subscribe(this._successCallback);
  }

  private _successCallback = (res) => {
    res.forEach(i => {
      const collector: Collector = collectors.filter(c => c.code === i.collectorCode)[0];
      i.refCollectorDto = {};
      i.refCollectorDto.code = collector.code;
      i.refCollectorDto.name = collector.name;
    });
    this.rows = res;
    this._temp = res;
    this.easyGrid.setData(this.rows);
  };

  addDefaultConnection(): void {
    this.dialog.open(AddDefaultConnectionDialogComponent, { width: '600px', disableClose: true, data: new DefaultConnection() })
  }

  updateFilter = (event, column) => {
    this.easyGrid.updateFilter(event, column, this._temp, this, 'rows', 0);
  };

  editDefaultConnection(row: DefaultConnection): void {
    this.dialog.open(AddDefaultConnectionDialogComponent, { width: '600px', disableClose: true, data: row });
  }

  deleteDefaultConnection = (row: DefaultConnection) => {
    const dialogData: DialogData = {
      title: 'LABEL_DELETE',
      message: 'INFO_DELETE_CONFIRM',
      buttonLabel: 'LABEL_DELETE',
      lineName: `${row.refCollectorDto.name} ${row.login}`,
      callBack: (hideDialog) => {
        const queryParams = {
          companyId: this.easyCompanyApp.getCompanyId()
        };
        this.defaultConnectionService.remove(row.identifier, queryParams).subscribe(res => {
          this.query();
          hideDialog();
        });
      }
    };
    this.dialog.open(ConfirmationDialogComponent, { disableClose: true, data: dialogData });
  }
}