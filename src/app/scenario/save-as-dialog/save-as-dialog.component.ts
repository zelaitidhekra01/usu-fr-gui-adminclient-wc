import {Component, Inject, OnInit} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ScenarioService } from 'src/app/services/scenario.service';

@Component({
    selector:'app-save-as-dialog',
    templateUrl: './save-as-dialog.component.html',
    styleUrls: ['./save-as-dialog.component.scss']
})
export class SaveAsDialogComponent implements OnInit {
    static allScenario: any;

    saveAsGroup: any;
    dataToSend: any;
    dialogTitle: string;
    dataType: any;

    constructor(public dialogRef: MatDialogRef<SaveAsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private scenarioService: ScenarioService,
        public translate: TranslateService){
        this.dataToSend = data.toSend;
        this.dataToSend.companyId = data.companyId;
        this.dataType = data.creationType;
        this.dialogTitle = data.title;
            
        }
    
    ngOnInit(): void {

    this.scenarioService.getAllByCompany({companyId: this.dataToSend.companyId}).subscribe(this._getAllScenario);
    this.saveAsGroup = new FormGroup({
      saveName: new FormControl('Standard')
    });
    }

    _getAllScenario = (res) => {
        SaveAsDialogComponent.allScenario = res;
    
        this.saveAsGroup = new FormGroup({
          saveName: new FormControl(this.translate.instant('LABEL_COPY_OF') + ' ' + this.dataToSend.name,
            [Validators.required, this.nameAlreadyExists])
        });
    
        if (this.dataType === 'RENAME') {
          this.saveAsGroup.get('saveName').setValue(this.dataToSend.name);
        }
      };
      
      nameAlreadyExists(control: AbstractControl) {
        let alreadyExist = true;
    
        SaveAsDialogComponent.allScenario.forEach(scenario => {
          if (scenario.name === control.value) {
            alreadyExist = false;
          }
        });
        return alreadyExist ? null : {
          nameAlreadyExists: true
        }
      }
      saveForm = () => {
        this.dataToSend.name = this.saveAsGroup.get('saveName').value;
        if (this.dataType === 'COPY') {
          this.dataToSend.identifier = null;
          this.scenarioService.create(this.dataToSend).subscribe(this._createSuccess);
        } else if (this.dataType === 'RENAME') {
          this.scenarioService.update(this.dataToSend).subscribe(this._createSuccess);
        }
      };
      _createSuccess = () => {
        this.data.updateCallback(this.saveAsGroup.get('saveName').value);
        this.closeDialog();
      };
    
      closeDialog = () => {
        this.dialogRef.close();
      };

}