import {Collector} from './collector.model';

export class DefaultConnection {
  identifier?: number;
  refCollectorDto: Collector;
  login: string;
  password: string;
  passwordConfirm?: string;

  constructor(defaultConnection?) {
    defaultConnection = defaultConnection || {};
    this.refCollectorDto = defaultConnection.refCollectorDto || new Collector();
    this.login = defaultConnection.login || '';
    this.password = defaultConnection.password || '';
    this.passwordConfirm = defaultConnection.passwordConfirm || '';
  }
}
