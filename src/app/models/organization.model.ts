export class Organization {

    identifier: number;
    name: string;
    typeId: number;
    typeName: string;
    parentId: number;
    parentName: string;
    companyId: number;
  
    constructor(organization?) {
  
      organization = organization || {};
      this.identifier = organization.identifier || '';
      this.name = organization.name || '';
      this.typeId = organization.typeId || '';
      this.typeName = organization.typeName || '';
      this.parentId = organization.parentId || '';
      this.parentName = organization.parentName || '';
      this.companyId = organization.companyId || 0;
    }
  
  }
  