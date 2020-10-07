import {Injectable} from '@angular/core';

import {Organization} from '../models/organization.model';
import {OrganizationType} from '../models/organization.type.model';

import * as lodash from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsComponentService {

  uri: string;
  types: OrganizationType[];
  organizations: Organization[];

  constructor() {
  }

  getTypes() {
    return this.types;
  }

  setTypes(types) {
    this.types = types;
  }

  getOrganizations() {
    return lodash.clone(this.organizations);
  }

  setOrganizations(orgs) {
    this.organizations = orgs;
  }

  getParentsByType(typeId, selectedOrg) {
    const parents = [];
    lodash.each(this.organizations, (org) => {

      if (org.typeId === typeId && org.name !== selectedOrg && org.parentId === undefined) {
        parents.push(org);
      }
    });
    return parents;
  }

  getOrganisationType(orgName, currentType) {
    if (!orgName) {
      return currentType;
    }

    let type = null;
    lodash.each(this.organizations, (org) => {
      if (org.identifier === orgName) {
        type = org.typeId;
      }

    });
    return type;
  }

  addRowToTreeGrid(org, organizations) {

    let idx;
    const orgs = lodash.clone(organizations);

    if (!org.parent) {
      org.$$treeLevel = 0;
      orgs.push(org);
    } else {
      lodash.each(orgs, (o, index) => {
        if (o.name === org.parent) {
          idx = index;
          return true;
        }
      });
    }
    if (idx || idx === 0) {
      orgs.splice(idx + 1, 0, org);
    }

    return orgs;
  }

}
