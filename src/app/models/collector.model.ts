export class Collector {

    code: string;
    name: string;
    toBeDeleted?: boolean;
  
    constructor(collector?) {
  
      collector = collector || {};
      this.code = collector.code || '';
      this.name = collector.name || '';
      this.toBeDeleted = collector.toBeDeleted || false;
    }
  
}
  