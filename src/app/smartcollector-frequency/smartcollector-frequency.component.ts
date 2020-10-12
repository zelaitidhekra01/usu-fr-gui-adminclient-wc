import {Component, OnInit, Output} from '@angular/core';
import {SmartcollectorFrequencyComponentService} from '../services/smartcollector-frequency.component.service';
import {EasyCompanyApp} from 'usu-fr-gui-commons/tools/companyApp.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-smartcollector-frequency',
  templateUrl: './smartcollector-frequency.component.html',
  styleUrls: ['./smartcollector-frequency.component.scss']
})
export class SmartcollectorFrequencyComponent implements OnInit {
  HEARTBEAT_CODE = 'heartbeat.period.time';
  HEARTBEAT_DELAY_CODE = 'heartbeat.period.delay';
  SAVEDATA_CODE = 'save.data.period.time';
  SAVEDATA_DELAY_CODE = 'save.data.period.delay';
  minValue = 2;
  maxValue = 480;

  scFrequencyGroup: any;
  disableButton = true;
  defaultParams: any = {
    companyId: this.easyCompanyApp.getCompanyId()
  };

  // @Output() valueChange;

  formatLabel = (value: number | null) => {
    if (!value) {
      return 2;
    }
    return value;
  };

  constructor(private easyCompanyApp: EasyCompanyApp,
              private scFrequancyService: SmartcollectorFrequencyComponentService) {
  }

  ngOnInit() {
    this.scFrequencyGroup = new FormGroup({
      heartbeat: new FormControl(2),
      savedata: new FormControl(2),
    });
    this.scFrequancyService.getScFrequencyList(this.defaultParams).subscribe(this.successGetFrequency);
  }

  onChange = (event) => {
    this.disableButton = false;
  };

  validateFrequency = () => {
    const paramsToSend = {
      companyId: this.easyCompanyApp.getCompanyId(),
      quantumParameterList: [
        {
          code: this.HEARTBEAT_CODE,
          value: this.scFrequencyGroup.get('heartbeat').value
        }, {
          code: this.HEARTBEAT_DELAY_CODE,
          value: 'minutly'
        }, {
          code: this.SAVEDATA_CODE,
          value: this.scFrequencyGroup.get('savedata').value
        }, {
          code: this.SAVEDATA_DELAY_CODE,
          value: 'minutly'
        }
      ]
    };
    this.scFrequancyService.saveScFrequency(paramsToSend).subscribe(this.successValidateFrequency);
  };

  applyFrequency = () => {
    this.scFrequancyService.applyScFrequency(this.defaultParams).subscribe(this.successApplyFrequency);
  };

  successGetFrequency = (res) => {
    res.forEach(current => {
      if (current.code === this.HEARTBEAT_CODE) {
        this.scFrequencyGroup.get('heartbeat').setValue(current.value)
      } else if (current.code === this.SAVEDATA_CODE) {
        this.scFrequencyGroup.get('savedata').setValue(current.value)
      }
    });
  };

  successValidateFrequency = (res) => {

  };

  successApplyFrequency = (res) => {

  };
}
