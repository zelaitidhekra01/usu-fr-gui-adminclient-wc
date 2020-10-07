import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrganizationType } from '../../models/organization.type.model';
import { EasyCompanyApp } from 'usu-fr-gui-commons/tools/companyApp.service';
import * as lodash from 'lodash';
import { EasyTools } from 'usu-fr-gui-commons/tools/tools.service';
import { OrganizationTypesService } from '../../services/organization-types.service';

@Component({
  selector: 'app-add-organization-type-dialog',
  templateUrl: './add-organization-type-dialog.component.html',
  styleUrls: ['./add-organization-type-dialog.component.scss']
})
export class AddOrganizationTypeDialogComponent {

  creationSuccess = false;
  sendingData = false;
  form: OrganizationType;

  _companyId: any;
  isCreate = true;

  dialogTitle: string = this.isCreate ? 'ADC.ORGANIZATION.TYPE.ADD.TITLE' : 'ADC.ORGANIZATION.TYPE.ADD.TITLE';


  constructor(public dialogRef: MatDialogRef<AddOrganizationTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private organizationTypesService: OrganizationTypesService,
    public easyCompanyApp: EasyCompanyApp,
    public easyTools: EasyTools) {
    this.form = data;
    this.isCreate = !data.name;
    this._companyId = easyCompanyApp.getCompanyId();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveForm(formData, form): void {

    if (form.valid) {
      const cloned = lodash.cloneDeep(formData);
      cloned.companyId = this._companyId;
      this.sendingData = true;
      if (this.isCreate) {
        // clone to not remove confirm password from form
        cloned.companyId = this._companyId;
        delete cloned.identifier;
        this.organizationTypesService.save(cloned).subscribe();
      } else {
        this.organizationTypesService.update(cloned).subscribe();
      }
    } else {
      this.easyTools.validateForm(form, null);
    }

    this.closeDialog();
  }
}
