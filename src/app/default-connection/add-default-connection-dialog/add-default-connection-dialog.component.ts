import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DefaultConnection } from '../../models/default-connection.model';
import { DefaultConnectionService } from '../../services/default-connection.service';
import { CollectorService } from '../../services/collector.service';
import { EasyCompanyApp } from 'usu-fr-gui-commons/tools/companyApp.service';
import * as _ from 'lodash';
import { Collector } from '../../models/collector.model';
import { EasyGrid } from 'usu-fr-gui-commons/tools/index';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidation } from '../../services/password-validation';
import { collectors } from "../constants";

@Component({
  selector: 'app-add-default-connection-dialog',
  templateUrl: './add-default-connection-dialog.component.html',
  styleUrls: ['./add-default-connection-dialog.component.scss']
})
export class AddDefaultConnectionDialogComponent implements OnInit {
  defaultConnectionGroup: FormGroup;
  collectors: Collector[];
  creationSuccess = false;
  defaultConnection: any;
  dialogTitle = 'PLAT.DEFAULT.CONNECTION.ADD.INFO';
  isCreate: boolean;
  openDefaultConnectionDetailPane = true;

  sendingData = false;

  _companyId: any;



  constructor(public dialogRef: MatDialogRef<AddDefaultConnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DefaultConnection,
    private collectorService: CollectorService,
    private defaultConnectionService: DefaultConnectionService,
    public easyCompanyApp: EasyCompanyApp,
    public easyGrid: EasyGrid) {
    this.defaultConnection = _.cloneDeep(data);
    this.isCreate = !data.refCollectorDto.name;
    this._companyId = easyCompanyApp.getCompanyId();
  }

  ngOnInit() {
    this.defaultConnectionGroup = new FormGroup({
      identifier: new FormControl(''),
      refCollectorDto: new FormControl(null, [Validators.required]),
      newLog_in: new FormControl('', [Validators.required]),
      newPass_word: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, PasswordValidation.NotMatching);
    this.collectors = collectors;
    this._initDialog();
  }


  /** Save or Update Default connection */
  saveDefaultConnection = (): void => {

    // clone to not remove confirm password from form
    const cloned = _.cloneDeep(this.defaultConnectionGroup.value);
    cloned.login = cloned.newLog_in;
    cloned.password = cloned.newPass_word;
    delete cloned.newLog_in;
    delete cloned.newPass_word;
    cloned.collectorCode = cloned.refCollectorDto;
    delete cloned.refCollectorDto;

    if (this.isCreate) {
      cloned.companyId = this._companyId;
      delete cloned.identifier;
      delete cloned.confirmPassword;

      this.sendingData = true;
      this.defaultConnectionService.saveDefaultConnection(cloned)
        .subscribe(res => this._createSuccess(res), error => this._saveError(error));



    } else {
      delete cloned.confirmPassword;
      this.defaultConnectionService.updateDefaultConnection(cloned)
        .subscribe(res => this._updateSuccess(res), error => this._saveError(error));
    }
  };

  /**
   * Define query parameters : company and profile parameters
   * Build and execute querry, if success call function to process and display result
   */
  getCollectorQuery = () => {
    const params = { companyId: this._companyId, profileName: ['Admin', 'Standard', 'LC4Oracle'] };
    this.collectorService.getAllCollector(params).subscribe(this._successCallback);
  };


  /** Init default connection data */
  _initDialog() {
    if (this.isCreate) {
      this.dialogTitle = 'PLAT.DEFAULT.CONNECTION.ADD.INFO';
    } else {
      this.dialogTitle = 'PLAT.DEFAULT.CONNECTION.EDIT.INFO';
      this.defaultConnectionGroup.get('identifier').setValue(this.defaultConnection.identifier);
      this.defaultConnectionGroup.get('refCollectorDto').setValue(this.defaultConnection.refCollectorDto);
      this.defaultConnectionGroup.get('newLog_in').setValue(this.defaultConnection.login);
      this.defaultConnectionGroup.get('newPass_word').setValue(this.defaultConnection.password);
      this.defaultConnectionGroup.get('confirmPassword').setValue(this.defaultConnection.password);
    }
  }

  /** Add success callback */
  _createSuccess = (res) => {

    this.defaultConnection = _.cloneDeep(res);
    this.easyGrid.addRow(this.defaultConnection);
    this.creationSuccess = true;
    this.sendingData = false;
    this.closeDialog();
  };

  /** update success callback */
  _updateSuccess = res => {
    this.defaultConnection = _.cloneDeep(res);
    this.easyGrid.updateRow(this.defaultConnection.identifier, this.defaultConnection);
    this.sendingData = false;
    this.closeDialog();
  };

  _saveError = (error) => {
    console.log(error);
  };

  _successCallback = (res) => {
    this.collectors = res;
  };

  /** close popup */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
