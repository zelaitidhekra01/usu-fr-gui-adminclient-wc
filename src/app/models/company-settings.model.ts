import {Preferences} from './preferences.model';

export class CompanySettingsModel {
  name: string;
  websiteUrl: string;
  languageId: number;
  welcomeMessage: string;
  comments: string;
  isEnabled = true;


  constructor(companySettingsModel?) {
    companySettingsModel = companySettingsModel || {};
    this.name = companySettingsModel.name;
    this.websiteUrl = companySettingsModel.websiteUrl;
    this.languageId = companySettingsModel.languageId;
    this.welcomeMessage = companySettingsModel.welcomeMessage;
    this.comments = companySettingsModel.comments;
    this.isEnabled = companySettingsModel.isEnabled;
  }
}
