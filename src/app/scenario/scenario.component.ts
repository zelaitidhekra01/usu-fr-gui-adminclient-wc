import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EasyCompanyApp } from 'usu-fr-gui-commons/tools';
import { ScenarioService } from '../services/scenario.service';
import { SaveAsDialogComponent } from './save-as-dialog/save-as-dialog.component';




@Component({
    selector: 'app-senario',
    templateUrl: './scenario.component.html',
    styleUrls: ['./scenario.component.scss']

})
export class ScenarioComponent implements OnInit {
    _companyId: any;

    scenarioGroup: any;
    booleanList = [];
    enumList = [];

    scenarioLabel: string;

    allBooleanTechno = [];
    allEnumTechno = [];

    scenarioList: any;
    _defaultScenarioId: number;
    currentScenarioId: number;

    isCopy = 'COPY';
    isRename = 'RENAME';
    // @ViewChild("changeEl") el!: ElementRef;

    constructor(private dialog: MatDialog,
        private easyCompanyApp: EasyCompanyApp,
        private scenarioService: ScenarioService) {
        this._companyId = this.easyCompanyApp.getCompanyId();
    }

    ngOnInit() {
        this.scenarioGroup = new FormGroup({
            generalInformation: new FormGroup({
                isDefaultScenario: new FormControl(),
                isStandardScenario: new FormControl({ value: '', disabled: true })
            })
        });

        this.getAllScenario();
    }
   
    getAllScenario = () => {
        this.scenarioService.getAllByCompany({ companyId: this._companyId }).subscribe(this._getAllSuccess, this._getAllSuccess);
    };
    getScenarioById = (event) => {
        const { value } = event.target;
        this.scenarioService.getById({ companyId: this._companyId, id: value }).subscribe(this._getByIdSuccess);
        this.currentScenarioId = value;
    };

    defaultHasChange = (event) => {
        this.scenarioGroup.get('generalInformation').get('isDefaultScenario').setValue(event.checked);
    };
    /** update a scenario */
    updateScenario = () => {
        const toSend = this._dataToSend();

        this.scenarioService.update(toSend).subscribe(this._updateSuccess);
    };

    createScenario = () => {
        const toSend = this._dataToSend();
        this.dialog.open(SaveAsDialogComponent, {
            width: '30%', disableClose: false, data: {
                companyId: this._companyId,
                toSend: toSend,
                creationType: this.isCopy,
                title: 'LABEL_SCENARIO_SAVE_AS',
                updateCallback: this.callbackSuccess
            }
        });
    };
    _dataToSend = () => {
        const dataToSend = {
            identifier: this.currentScenarioId,
            companyId: this._companyId,
            isDefault: this.scenarioGroup.get('generalInformation').get('isDefaultScenario').value,
            name: this.scenarioLabel,
            params: []
        };

        const booleanItem = this.scenarioGroup.get('boolean').value;
        const enumItem = this.scenarioGroup.get('enum').value;

        this.booleanList.forEach(current => {
            dataToSend.params.push({
                refParameterId: current.data.refParameterId,
                value: booleanItem[current.data.key] ? 1 : 0,
                optionsList: current.data.optionsList,
                order: current.order
            });
        });

        this.enumList.forEach(current => {
            dataToSend.params.push({
                refParameterId: current.data.refParameterId,
                value: enumItem[current.data.key],
                optionsList: current.data.optionsList,
                order: current.order
            });
        });

        return dataToSend;
    };
    renameScenario = () => {
        this.dialog.open(SaveAsDialogComponent, {
            width: '30%', disableClose: false, data: {
                companyId: this._companyId,
                toSend: this._dataToSend(),
                creationType: this.isRename,
                title: 'LABEL_SCENARIO_RENAME',
                updateCallback: this.callbackSuccess
            }
        });
    };
    removeScenario = () => {
        this.scenarioService.remove(this.currentScenarioId, { companyId: this._companyId }).subscribe(this._removeSuccess);
    };
    /** get scenario by id callback */
    _getByIdSuccess = (res) => {
        const booleanElements = [];
        const enumElements = [];

        this.scenarioLabel = res.name;

        if (res.isDefault) {
            this.scenarioGroup.get('generalInformation').get('isDefaultScenario').disable();
        } else {
            this.scenarioGroup.get('generalInformation').get('isDefaultScenario').enable();
        }

        res.params.forEach((recovery) => {
            if (recovery.type === 'BOOLEAN') {
                booleanElements.push({
                    techInfo: {
                        title: recovery.technoLabelKey,
                    },
                    data: {
                        key: 'item' + recovery.refParameterId,
                        refParameterId: recovery.refParameterId,
                        value: Number(recovery.value),
                        optionsList: recovery.optionsList,
                        nameLabelKey: recovery.nameLabelKey,
                        descriptionLabelKey: recovery.descriptionLabelKey,
                    },
                    order: recovery.order,
                    isEnabledBy: recovery.isEnabledBy
                });
            } else if (recovery.type === 'ENUM') {
                enumElements.push({
                    techInfo: {
                        title: recovery.technoLabelKey
                    },
                    data: {
                        key: 'item' + recovery.refParameterId,
                        refParameterId: recovery.refParameterId,
                        value: Number(recovery.value),
                        optionsList: recovery.optionsList,
                        nameLabelKey: recovery.nameLabelKey,
                        descriptionLabelKey: recovery.descriptionLabelKey,
                    },
                    order: recovery.order
                });
            }
        });

        this.booleanList = this._sortList(booleanElements);
        this.enumList = this._sortList(enumElements);
    
        this.booleanList.forEach(current => {
            if (!this.allBooleanTechno.includes(current.techInfo.title)) {
                this.allBooleanTechno.push(current.techInfo.title);
            }
        });

        this.enumList.forEach(current => {
            if (!this.allEnumTechno.includes(current.techInfo.title)) {
                this.allEnumTechno.push(current.techInfo.title);
            }
        });

        this._toFormGroup(this.booleanList, this.enumList, res.isDefault, res.isStandard);
    };
    /** update scenario callback */
    _updateSuccess = () => {
        console.log('update successful');

        if (this.scenarioGroup.get('generalInformation').get('isDefaultScenario').value) {
            this.scenarioGroup.get('generalInformation').get('isDefaultScenario').disable();
        }
    };

    _removeSuccess = () => {
        this.getAllScenario();
    };

    /** callback function for save as success */
    callbackSuccess = (name) => {
        this.scenarioLabel = name;
        this.scenarioService.getAllByCompany({ companyId: this._companyId }).subscribe(this._getAllCallbackSuccess);
    };
    _getAllCallbackSuccess = (res) => {
        res.forEach(current => {
            if (current.name === this.scenarioLabel) {
                this.scenarioService.getById({ companyId: this._companyId, id: current.identifier }).subscribe(this._getByIdSuccess);
                this.currentScenarioId = current.identifier;
            }
        });

        this.scenarioList = res;
    };
    verifyActivation = () => {
        this.booleanList.forEach(element => {
            if (element.isEnabledBy !== 0) {
                if (this.scenarioGroup.get('boolean').get('item' + element.isEnabledBy).value) {
                    this.scenarioGroup.get('boolean').get('item' + element.data.refParameterId).enable();
                } else {
                    this.scenarioGroup.get('boolean').get('item' + element.data.refParameterId).disable();
                }
            }
        });
    };

    /** sort the list by order information */
    _sortList = (listToSort) => {
        let sortedList: any;

        sortedList = listToSort.sort((n1, n2) => n1.order - n2.order);

        return sortedList;
    };
    /** generate the form group */
    _toFormGroup = (booleanToGroup, enumToGroup, isDefault, isStandard = false) => {
        let booleanGroup: any;
        const booleanTechno: any = {};

        let enumGroup: any;
        const enumTechno: any = {};

        booleanToGroup.forEach((currentValue) => {
            booleanTechno[currentValue.data.key] = new FormControl(!!currentValue.data.value);
        });

        booleanGroup = new FormGroup(booleanTechno);

        enumToGroup.forEach((currentValue) => {
            enumTechno[currentValue.data.key] = new FormControl(currentValue.data.value);

        });
        enumGroup = new FormGroup(enumTechno);

        this.scenarioGroup = new FormGroup({
            generalInformation: new FormGroup({
                isDefaultScenario: new FormControl(isDefault),
                isStandardScenario: new FormControl({ value: isStandard, disabled: true })
            }),
            boolean: booleanGroup,
            enum: enumGroup
        });

        this.verifyActivation();
    };

    /** get all scenario callback */
    _getAllSuccess = (res) => {
        res.forEach(current => {
            if (current.isDefault) {
                this._defaultScenarioId = current.identifier;
                this.currentScenarioId = current.identifier;
                this.scenarioLabel = current.name;
            }
        });

        this.scenarioList = res;

        if (this._defaultScenarioId) {
            this.scenarioService.getById({ companyId: this._companyId, id: this._defaultScenarioId }).subscribe(this._getByIdSuccess);
        }
    };

}