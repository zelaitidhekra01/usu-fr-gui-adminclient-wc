import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EasyCompanyApp} from 'usu-fr-gui-commons/tools/';
import * as _ from 'lodash';
import {EasyTools} from 'usu-fr-gui-commons/tools/tools.service';


import {Organization} from '../../models/organization.model';
import {OrganizationsService} from '../../services/organizations.service';

import {OrganizationType} from '../../models/organization.type.model';
import {OrganizationTypesService} from '../../services/organization-types.service';

import {OrganizationsComponentService} from '../organizations.component.service';

@Component({
  selector: 'app-add-organization-dialog',
  templateUrl: './add-organization-dialog.component.html',
  styleUrls: ['./add-organization-dialog.component.scss']
})
export class AddOrganizationDialogComponent implements OnInit {

  creationSuccess = false;
  sendingData = false;
  form: Organization;
  parents: Organization[];
  types: OrganizationType[];
  _companyId: any;
  isCreate = true;

  dialogTitle: string = this.isCreate ? 'ADC.ORGANIZATION.TYPE.ADD.TITLE' : 'ADC.ORGANIZATION.TYPE.ADD.TITLE';


  constructor(public dialogRef: MatDialogRef<AddOrganizationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private organizationsService: OrganizationsService,
              private organizationTypeService: OrganizationTypesService,
              private easyOrganizations: OrganizationsComponentService,
              private easyCompanyApp: EasyCompanyApp,
              private easyTools: EasyTools) {
    this.form = data;
    this.isCreate = !data.name;
    this._companyId = easyCompanyApp.getCompanyId();
  }


  ngOnInit() {
    this._initDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }


  saveForm(formData, form): void {
    if (form.valid) {
      const cloned = _.cloneDeep(formData);
      cloned.companyId = this._companyId;
      this.sendingData = true;
      if (this.isCreate) {
        // clone to not remove confirm password from form
        this.organizationsService.save(cloned).subscribe();
      } else {
        this.organizationsService.update(cloned).subscribe();
      }
    } else {
      this.easyTools.validateForm(form, null);
    }

    this.closeDialog();
  }

  changeOrgType = (type) => {

    this.parents = this.easyOrganizations.getParentsByType(type.target.value, this.form.name);
    this.form.parentId =  null;
    this.form.parentName = null;
  };

  changeParent = (parent) => { 
    this.form.typeId = this.easyOrganizations.getOrganisationType(parent.target.value, this.form.typeId);
  };

  _initDialog() {

    if (this.isCreate) {
      this.dialogTitle = 'ADC.ORGANIZATION.ADD.TITLE';
      this.form.companyId = this._companyId;

      this.parents = this.easyOrganizations.getOrganizations();
      if (this.parents !== undefined) {
        this.parents.unshift(new Organization());
      }
    } else {
      this.dialogTitle = 'ADC.ORGANIZATION.EDIT.TITLE';
      this.organizationsService.get(this.form.identifier, {companyId: this._companyId}).subscribe(res => {
        this.parents = this.easyOrganizations.getParentsByType(res.typeId, res.name);
      });
    }
    this.types = this.easyOrganizations.getTypes();
  }
}
