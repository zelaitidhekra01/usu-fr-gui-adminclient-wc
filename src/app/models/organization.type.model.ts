export class OrganizationType {

    identifier: number;
    name: string;
    rank: string;
    toBeDeleted: boolean;
  
    constructor(organizationType?) {
  
      organizationType = organizationType || {};
      this.identifier = organizationType.identifier || '';
      this.name = organizationType.name || '';
      this.rank = organizationType.rank || '';
      this.toBeDeleted = organizationType.toBeDeleted || false;
    }
  
  }
  