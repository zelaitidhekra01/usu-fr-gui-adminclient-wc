import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {ApiService} from 'usu-fr-gui-commons/services/api.service';
import {TranslateService} from '@ngx-translate/core';


@Injectable({
    providedIn: 'root'
})
export class CollectorScheduleService {
  uri = '';

  constructor(private http: HttpClient, private apiService: ApiService, private translate: TranslateService) {
    this.uri = 'admin-client/collector-schedule'
  }

  getCollectorList = (params): Observable<any> => {
    return this.apiService.get(this.uri, params);
  };

  getDetail = (id, params): Observable<any> => {
    return this.apiService.get(`${this.uri}/${id}`, params);
  };

  applySchedule = (params): Observable<any> => {
    return this.apiService.get(`${this.uri}/schedule`, params);
  };

  saveCollectorDefaultSchedule = (id, params): Observable<any> => {
    return this.apiService.post(`${this.uri}/${id}`, params);
  };

  getAllMinutes = () => {
    const hours: any = [];
  
    for (let i = 0; i < 30; i++) {
      hours.push(i);
    }
    return hours;
  };

  getSixHours = () => {
    const hours: any = [];
    for (let i = 0; i < 6; i++) {
      hours.push(i);
    }
    return hours;
  };

  getAllHours = () => {
    const hours: any = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  getAllDays = () => {
    const hours: any = [];
    for (let i = 0; i < 30; i++) {
      hours.push(i + 1);
    }
    return hours;
  };

  getFullWeek = () => {
    return [
      {
        identifier: 1,
        label: this.translate.instant('LABEL_SUNDAY'),
        value: this.translate.instant('LABEL_SUNDAY').charAt(0) +
          this.translate.instant('LABEL_SUNDAY').charAt(1) +
          this.translate.instant('LABEL_SUNDAY').charAt(2),
        isSelected: false
      },
      {
        identifier: 2,
        label: this.translate.instant('LABEL_MONDAY'),
        value: this.translate.instant('LABEL_MONDAY').charAt(0) +
          this.translate.instant('LABEL_MONDAY').charAt(1) +
          this.translate.instant('LABEL_MONDAY').charAt(2),
        isSelected: false
      },
      {
        identifier: 3,
        label: this.translate.instant('LABEL_TUESDAY'),
        value: this.translate.instant('LABEL_TUESDAY').charAt(0) +
          this.translate.instant('LABEL_TUESDAY').charAt(1) +
          this.translate.instant('LABEL_TUESDAY').charAt(2),
        isSelected: false
      },
      {
        identifier: 4,
        label: this.translate.instant('LABEL_WEDNESDAY'),
        value: this.translate.instant('LABEL_WEDNESDAY').charAt(0) +
          this.translate.instant('LABEL_WEDNESDAY').charAt(1) +
          this.translate.instant('LABEL_WEDNESDAY').charAt(2),
        isSelected: false
      },
      {
        identifier: 5,
        label: this.translate.instant('LABEL_THURSDAY'),
        value: this.translate.instant('LABEL_THURSDAY').charAt(0) +
          this.translate.instant('LABEL_THURSDAY').charAt(1) +
          this.translate.instant('LABEL_THURSDAY').charAt(2),
        isSelected: false
      },
      {
        identifier: 6,
        label: this.translate.instant('LABEL_FRIDAY'),
        value: this.translate.instant('LABEL_FRIDAY').charAt(0) +
          this.translate.instant('LABEL_FRIDAY').charAt(1) +
          this.translate.instant('LABEL_FRIDAY').charAt(2),
        isSelected: false
      },
      {
        identifier: 7,
        label: this.translate.instant('LABEL_SATURDAY'),
        value: this.translate.instant('LABEL_SATURDAY').charAt(0) +
          this.translate.instant('LABEL_SATURDAY').charAt(1) +
          this.translate.instant('LABEL_SATURDAY').charAt(2),
        isSelected: false
      }
    ];
  };
}
