import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CollectorScheduleService} from '../services/collector-schedule.service';
import * as lodash from 'lodash';
import {gridColumns} from './grid/grid-columns';
import {EasyCompanyApp} from 'usu-fr-gui-commons/tools/companyApp.service';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {EasyGridColumnFilterService} from 'usu-fr-gui-commons/tools/easy-grid-column-filter.service';
import {EasyGrid} from 'usu-fr-gui-commons/tools/easy.grid.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from 'usu-fr-gui-commons/services/api.service';

@Component({
  selector: 'app-collector-schedule',
  templateUrl: './collector-schedule.component.html',
  styleUrls: ['./collector-schedule.component.scss']
})
export class CollectorScheduleComponent implements OnInit {
  /** format minute: fmi_ */
  FORMAT_MINUTE = 'minute';
  /** format hour: fho_ */
  FORMAT_HOUR = 'hour';
  /** format day: fda_ */
  FORMAT_DAY = 'day';
  /** format month: fmo_ */
  FORMAT_MONTH = 'month';

  scheduleGroup: any;
  validSave = true;
  _companyId = this.easyCompanyApp.getCompanyId();
  currentCollectorCode: string;
  currentCollectorName: string;

  displayed = false;
  collectorsData = [];
  isLoading = false;
  disableButtons = true;

  defaultParams = {
  };

  columns = [];
  rows = [];
  _temp = [];

  fmi_week = [];
  fho_week = [];
  fda_week = [];
  fmi_daysInWeek = [];
  fho_daysInWeek = [];
  fda_daysInWeek = [];
  noDaySelect = true;

  minutesList: any = [];
  sixHoursList: any = [];
  hoursList: any = [];
  daysList: any = [];

  label_format_minute = 'LABEL_COLLECTOR_SCHEDULE_EVERY_MINUTES';
  label_format_minute0 = '';
  label_format_minute1 = '';
  label_format_minute2 = '';
  label_format_minute3 = '';
  label_format_hour = 'LABEL_COLLECTOR_SCHEDULE_EVERY_HOURS';
  label_format_hour0 = '';
  label_format_hour1 = '';
  label_format_hour2 = '';
  label_format_hour3 = '';
  label_format_day = 'LABEL_COLLECTOR_SCHEDULE_EVERY_DAY';
  label_format_day0 = '';
  label_format_day1 = '';
  label_format_day2 = '';
  label_format_month = 'LABEL_COLLECTOR_SCHEDULE_EVERY_MONTH';
  label_format_month0 = '';
  label_format_month1 = '';
  label_format_month2 = '';
  label_format_month3 = '';

  @ViewChild('grid', {static: true}) grid: any;

  @ViewChild('idxTpl', {static: true}) idxTpl: TemplateRef<any>;
  @ViewChild('hdrTpl',{static: true}) hdrTpl: TemplateRef<any>;
  @ViewChild('cellTpl', {static: true}) cellTpl: TemplateRef<any>;

  constructor(private collectorScheduleService: CollectorScheduleService,
              private easyCompanyApp: EasyCompanyApp,
              private dialog: MatDialog,
              private translate: TranslateService,
              private easyGridColumnFilterService: EasyGridColumnFilterService,
              public easyGrid: EasyGrid) {
    this.defaultParams = {
      companyId: this.easyCompanyApp.getCompanyId()
    };
  }

  ngOnInit() {
    this._tradDynamicLabel(this.label_format_minute, 'label_format_minute');

  
    
    this._tradDynamicLabel(this.label_format_hour, 'label_format_hour');
    this._tradDynamicLabel(this.label_format_day, 'label_format_day');
    this._tradDynamicLabel(this.label_format_month, 'label_format_month');

    this.minutesList = this.collectorScheduleService.getAllMinutes();
    
    this.sixHoursList = this.collectorScheduleService.getSixHours();
    this.hoursList = this.collectorScheduleService.getAllHours();
    this.daysList = this.collectorScheduleService.getAllDays();

    this.fmi_week = this.collectorScheduleService.getFullWeek();
    this.fho_week = this.collectorScheduleService.getFullWeek();
    this.fda_week = this.collectorScheduleService.getFullWeek();

    this.scheduleGroup = new FormGroup({
      fmi_minute: new FormControl({value: '', disabled: true}, [Validators.required]),
      fmi_startHour: new FormControl({value: '', disabled: true}, [Validators.required]),
      fmi_endHour: new FormControl({value: '', disabled: true}, [Validators.required]),
      fho_hour: new FormControl({value: '', disabled: true}, [Validators.required]),
      fho_startHour: new FormControl({value: '', disabled: true}, [Validators.required]),
      fho_endHour: new FormControl({value: '', disabled: true}, [Validators.required]),
      fda_startHour: new FormControl({value: '', disabled: true}, [Validators.required]),
      fda_endHour: new FormControl({value: '', disabled: true}, [Validators.required]),
      fmo_dayOfMonth: new FormControl({value: '', disabled: true}, [Validators.required]),
      fmo_startHour: new FormControl({value: '', disabled: true}, [Validators.required]),
      fmo_endHour: new FormControl({value: '', disabled: true}, [Validators.required]),
      formatSelect: new FormControl({value: this.FORMAT_MINUTE}, [Validators.required]),
    });

    /** clear arrays */
    this.easyGrid.clearArrays();
    this.easyGridColumnFilterService.clearAll();

    this.easyGrid.setup({
      scrollCallback: this.collectorScheduleService.getCollectorList,
      updateScopeData: this._successGetAll,
      queryParams: lodash.cloneDeep(this.defaultParams)
    });

    this.grid.appScope = this;
    this.easyGrid.setGridApi(this.grid);
    this.easyGrid.updateContent(0);

    /** definition of columns */
    this.columns = gridColumns(this);
  }

  getErrorMessage = () => {
    return this.translate.instant('LABEL_REQUIRED');
  };

  /** change schedule format and list of day selected: unselect the*/
  changeFormat = (event) => {
    this.scheduleGroup.get('formatSelect').setValue(event.target.value);
    this.fmi_week.forEach((current) => {
      current.isSelected = false;
    });
    this.fho_week.forEach((current) => {
      current.isSelected = false;
    });
    this.fda_week.forEach((current) => {
      current.isSelected = false;
    });

    this._disableAll();

    if (this.scheduleGroup.get('formatSelect').value === this.FORMAT_MINUTE) {
  
      this.scheduleGroup.get('fmi_minute').enable();
      this.scheduleGroup.get('fmi_startHour').enable();
      this.scheduleGroup.get('fmi_endHour').enable();
    } else if (this.scheduleGroup.get('formatSelect').value === this.FORMAT_HOUR) {
      this.scheduleGroup.get('fho_hour').enable();
      this.scheduleGroup.get('fho_startHour').enable();
      this.scheduleGroup.get('fho_endHour').enable();
    } else if (this.scheduleGroup.get('formatSelect').value === this.FORMAT_DAY) {
      this.scheduleGroup.get('fda_startHour').enable();
      this.scheduleGroup.get('fda_endHour').enable();
    } else if (this.scheduleGroup.get('formatSelect').value === this.FORMAT_MONTH) {
      this.scheduleGroup.get('fmo_dayOfMonth').enable();
      this.scheduleGroup.get('fmo_startHour').enable();
      this.scheduleGroup.get('fmo_endHour').enable();
    }
  };

  changeDaysInWeek(day, formatSelect) {
    if (day) {
      if (formatSelect === this.FORMAT_MINUTE) {
        const fmi_weekList = this._changeForWeek(day, this.fmi_week, this.fmi_daysInWeek);
        this.fmi_week = fmi_weekList.week;
        this.fmi_daysInWeek = fmi_weekList.currentDayInWeek;
      } else if (formatSelect === this.FORMAT_HOUR) {
        const fho_weekList = this._changeForWeek(day, this.fho_week, this.fho_daysInWeek);
        this.fho_week = fho_weekList.week;
        this.fho_daysInWeek = fho_weekList.currentDayInWeek;
      } else if (formatSelect === this.FORMAT_DAY) {
        const fda_weekList = this._changeForWeek(day, this.fda_week, this.fda_daysInWeek);
        this.fda_week = fda_weekList.week;
        this.fda_daysInWeek = fda_weekList.currentDayInWeek;
      }
    }
  }

  onSelectRow = (row) => {
    this.currentCollectorCode = row.code;
    this.currentCollectorName = row.name;
    this.collectorScheduleService.getDetail(row.code, this.defaultParams).subscribe(this._getCollectorDetail);
  };

  /** validate the schedule and collector config */
  validateSchedule = () => {
    
    let scheduleParamstoSend = {};

    /** format minute schedule */
    if (this.scheduleGroup.get('formatSelect').value === this.FORMAT_MINUTE) {
      scheduleParamstoSend = {
        companyId: this._companyId,
        daysOfWeek: this.fmi_week.filter(week => week.isSelected).map(weekSelected  => {
        return weekSelected.identifier;
        }),
        minute: this.scheduleGroup.get('fmi_minute').value,
        startHour: this.scheduleGroup.get('fmi_startHour').value,
        endHour: this.scheduleGroup.get('fmi_endHour').value
     

      };
    }

    /** format hour schedule */
    if (this.scheduleGroup.get('formatSelect').value === this.FORMAT_HOUR) {
      const hour = this.scheduleGroup.get('fho_hour').value;
      const start = this.scheduleGroup.get('fho_startHour').value;
      const end = this.scheduleGroup.get('fho_endHour').value;
      if (end - start - (2 * hour) >= 1) {
        scheduleParamstoSend = {
          companyId: this._companyId,
          daysOfWeek: this.fho_week.filter(week => week.isSelected).map(weekSelected  => {
            return weekSelected.identifier;
          }),
          hour: this.scheduleGroup.get('fho_hour').value,
          startHour: this.scheduleGroup.get('fho_startHour').value,
          endHour: this.scheduleGroup.get('fho_endHour').value
        };
      } else {
        this.validSave = false;
      }
    }

    /** format day schedule */
    if (this.scheduleGroup.get('formatSelect').value === this.FORMAT_DAY) {
      scheduleParamstoSend = {
        companyId: this._companyId,
        daysOfWeek: this.fda_week.filter(week => week.isSelected).map(weekSelected  => {
          return weekSelected.identifier;
        }),
        startHour: this.scheduleGroup.get('fda_startHour').value,
        endHour: this.scheduleGroup.get('fda_endHour').value
      };
    }

    /** format month schedule */
    if (this.scheduleGroup.get('formatSelect').value === this.FORMAT_MONTH) {
      scheduleParamstoSend = {
        companyId: this._companyId,
        dayOfMonth: this.scheduleGroup.get('fmo_dayOfMonth').value,
        startHour: this.scheduleGroup.get('fmo_startHour').value,
        endHour: this.scheduleGroup.get('fmo_endHour').value
      };
    }

    if (this.validSave) {
      scheduleParamstoSend['isScheduled'] = true;
      this.collectorScheduleService.saveCollectorDefaultSchedule(this.currentCollectorCode, scheduleParamstoSend).subscribe(
        this._successSaveSchedule, this._failedSaveSchedule);
    } else {

    }
  };

  applySchedule = () => {
    this.collectorScheduleService.applySchedule(this.defaultParams).subscribe(this._successApplying);
  };

  updateFilter = (event, column) => {
    this.easyGrid.updateFilter(event, column, this._temp, this, 'rows', 0);
  };

  fmiChangeMinHour = (data) => {
   const minHourValid = parseInt(data.target.value) + 1;
   this.scheduleGroup.get('fmi_endHour').setValidators(Validators.min(minHourValid));


  };

  fhoChangeMinHour = (data) => {
    const frequency = this.scheduleGroup.get('fho_hour').value ? this.scheduleGroup.get('fho_hour').value : 1;
    const minHourValid = parseInt(data.target.value) + ((2 * frequency) + 1);

    this.scheduleGroup.get('fho_endHour').setValidators(Validators.min(minHourValid));
  };

  /** translate function to grid labels */
  _translate = (key: string): string => {
    return this.translate.instant(key);
  };

  /** translate the dynamic labels and affect them to the corresponding field */
  _tradDynamicLabel = (label, field) => {
    const splitted = this.translate.instant(label).split(/\[[A-Z]\]/);

    splitted.forEach((l, index) => {
      this[field + index] = l.trim();
    });
  };

  /** function to change current days selected (add/remove) */
  _changeForWeek = (day, currentWeek, currentDayInWeek) => {
    const week = currentWeek;
    // const daysInWeek = currentDayInWeek;
    const cron_day = day;
    if (currentDayInWeek.indexOf(cron_day) === -1) {
      currentDayInWeek.push(cron_day);
      week.forEach((current) => {
        if (current.identifier === day) {
          current.isSelected = true;
        }
      });
    } else {
      const temp_week = [];
      currentDayInWeek.forEach((current_day) => {
        if (cron_day !== current_day) {
          temp_week.push(current_day);
        } else {
          week.forEach((current) => {
            if (current.identifier === day) {
              current.isSelected = false;
            }
          });
        }
      });
      currentDayInWeek = temp_week;
    }
    this.noDaySelect = currentDayInWeek.length === 0;

    return {week: week, currentDayInWeek: currentDayInWeek};
  };

  /** success callback from get all collectors */
  _successGetAll = (res) => {
    this.isLoading = true;
    this.collectorsData = [];
    res.forEach(current => {
      if (current.code !== 'fr.usu.collector.diagnostic') {
        this.collectorsData.push(current);
      }
    });
    this.rows = this.collectorsData;
    this._temp = this.collectorsData;
    this.easyGrid.setData(this.rows);

    this.displayed = true;
    this.isLoading = false;
  };

  _getCollectorDetail = (res) => {

    this._removeAllData();

    if (res.isScheduled) {
      if (res.minute !== 0) {
        this.scheduleGroup.get('formatSelect').setValue(this.FORMAT_MINUTE);

        this.scheduleGroup.get('fmi_minute').enable();
        this.scheduleGroup.get('fmi_startHour').enable();
        this.scheduleGroup.get('fmi_endHour').enable();
        this.scheduleGroup.get('fmi_minute').setValue(res.minute);
        this.scheduleGroup.get('fmi_startHour').setValue(res.startHour);
        this.scheduleGroup.get('fmi_endHour').setValue(res.endHour);

        if (res.daysOfWeek.length !== 0) {
          this.fmi_daysInWeek = res.daysOfWeek;

          // add color for selected days
          for (let i = 0; i < res.daysOfWeek.length; i++) {
            this.fmi_week.forEach((current) => {
              if (current.identifier === res.daysOfWeek[i]) {
                current.isSelected = true;
                this.noDaySelect = false;
              }
            });
          }
        }
      } else if (res.hour !== 0) {
        this.scheduleGroup.get('formatSelect').setValue(this.FORMAT_HOUR);
        this.scheduleGroup.get('fho_hour').enable();
        this.scheduleGroup.get('fho_startHour').enable();
        this.scheduleGroup.get('fho_endHour').enable();
        this.scheduleGroup.get('fho_hour').setValue(res.hour);
        this.scheduleGroup.get('fho_startHour').setValue(res.startHour);
        this.scheduleGroup.get('fho_endHour').setValue(res.endHour);

        if (res.daysOfWeek.length !== 0) {
          this.fho_daysInWeek = res.daysOfWeek;

          // add color for selected days
          for (let i = 0; i < res.daysOfWeek.length; i++) {
            this.fho_week.forEach((current) => {
              if (current.identifier === res.daysOfWeek[i]) {
                current.isSelected = true;
                this.noDaySelect = false;
              }
            });
          }
        }
      } else if (res.dayOfMonth !== 0 && res.startHour !== 0 && res.endHour !== 0) {
        this.scheduleGroup.get('formatSelect').setValue(this.FORMAT_MONTH);
        this.scheduleGroup.get('fmo_dayOfMonth').enable();
        this.scheduleGroup.get('fmo_startHour').enable();
        this.scheduleGroup.get('fmo_endHour').enable();
        this.scheduleGroup.get('fmo_dayOfMonth').setValue(res.dayOfMonth);
        this.scheduleGroup.get('fmo_startHour').setValue(res.startHour);
        this.scheduleGroup.get('fmo_endHour').setValue(res.endHour);
      } else if (res.dayOfMonth === 0 && res.startHour !== 0 && res.endHour !== 0) {
        this.scheduleGroup.get('formatSelect').setValue(this.FORMAT_DAY);
        this.scheduleGroup.get('fda_startHour').enable();
        this.scheduleGroup.get('fda_endHour').enable();
        this.scheduleGroup.get('fda_startHour').setValue(res.startHour);
        this.scheduleGroup.get('fda_endHour').setValue(res.endHour);

        if (res.daysOfWeek.length !== 0) {
          this.fda_daysInWeek = res.daysOfWeek;

          // add color for selected days
          for (let i = 0; i < res.daysOfWeek.length; i++) {
            this.fda_week.forEach((current) => {
              if (current.identifier === res.daysOfWeek[i]) {
                current.isSelected = true;
                this.noDaySelect = false;
              }
            });
          }
        }
      }
    }
    this.disableButtons = false;
  };

  /** remove all parametrized data */
  _removeAllData = () => {
    this.fmi_week.forEach((current) => {
      current.isSelected = false;
    });
    this.fho_week.forEach((current) => {
      current.isSelected = false;
    });
    this.fda_week.forEach((current) => {
      current.isSelected = false;
    });

    this._disableAll();

    this.scheduleGroup.get('formatSelect').setValue('');

    this.scheduleGroup.get('fmi_minute').setValue('');
    this.scheduleGroup.get('fmi_startHour').setValue('');
    this.scheduleGroup.get('fmi_endHour').setValue('');
    this.scheduleGroup.get('fho_hour').setValue('');
    this.scheduleGroup.get('fho_startHour').setValue('');
    this.scheduleGroup.get('fho_endHour').setValue('');
    this.scheduleGroup.get('fda_startHour').setValue('');
    this.scheduleGroup.get('fda_endHour').setValue('');
    this.scheduleGroup.get('fmo_dayOfMonth').setValue('');
    this.scheduleGroup.get('fmo_startHour').setValue('');
    this.scheduleGroup.get('fmo_endHour').setValue('');
  };

  /** disable all format data */
  _disableAll = () => {
    this.scheduleGroup.get('fmi_minute').disable();
    this.scheduleGroup.get('fmi_startHour').disable();
    this.scheduleGroup.get('fmi_endHour').disable();
    this.scheduleGroup.get('fho_hour').disable();
    this.scheduleGroup.get('fho_startHour').disable();
    this.scheduleGroup.get('fho_endHour').disable();
    this.scheduleGroup.get('fda_startHour').disable();
    this.scheduleGroup.get('fda_endHour').disable();
    this.scheduleGroup.get('fmo_dayOfMonth').disable();
    this.scheduleGroup.get('fmo_startHour').disable();
    this.scheduleGroup.get('fmo_endHour').disable();
  };

  /** success callback from save a collector schedule */
  _successSaveSchedule = () => {
    console.log('Success saving default collector schedule...');
  };

  /** failed callback from save a collector schedule */
  _failedSaveSchedule = () => {
    console.log('Failure saving default collector schedule...');
  };

  /** success callback from applying all collectors update */
  _successApplying = () => {
    console.log('Success applying schedule...');

    ApiService.openSnackBar('COLLECTOR_DEFAULT_SCHEDULE_ALL_200', null, 'success');
  };
}
