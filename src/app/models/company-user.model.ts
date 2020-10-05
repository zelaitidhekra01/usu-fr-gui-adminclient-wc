import {Preferences} from './preferences.model';

export class CompanyUser {
  identifier?: number;
  username: string;
  preferences: Preferences;

  constructor(username?: string, preferences?: Preferences) {
    this.username = username || undefined;
    this.preferences = preferences || new Preferences();
  }
}
