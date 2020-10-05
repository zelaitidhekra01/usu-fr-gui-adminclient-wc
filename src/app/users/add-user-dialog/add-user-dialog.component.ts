import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { CompanyUser } from 'src/app/models/company-user.model';
import { Profile } from 'src/app/models/profile.model';
import { UsersService } from 'src/app/services/users.service';
import {SecurityService} from '../../services/security.service';
import { EasyCompanyApp, EasyGrid, EasyTools, EasyUser } from 'usu-fr-gui-commons/tools';



@Component({
    selector: 'app-add-user-dialog',
    templateUrl: './add-user-dialog.component.html',
    styleUrls: ['./add-user-dialog.component.scss']
})


export class AddUserDialogComponent implements OnInit {

    dialogTitle: string;
    openUserDetailPane = true;
    openProfilePane = false;
    profilesPaneDisabled = true;
    isCreate: boolean;
    creationSuccess = false;
    sendingData = false;
    regexPhoneNumber: RegExp;
    regexPassword: RegExp;
    regexEmail: RegExp;
    user: CompanyUser;
  
    profiles: Profile[] = [];
    userProfiles: Profile[] = [];
  
    _companyId: any;

    constructor(public dialogRef: MatDialogRef<AddUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CompanyUser,
        private usersService: UsersService,
        public securityService: SecurityService,
        public easyCompanyApp: EasyCompanyApp,
        public easyTools: EasyTools,
        public easyUser: EasyUser,
        public easyGrid: EasyGrid){

    this.user = _.cloneDeep(data);
    this.isCreate = !data.username;
    this._companyId = easyCompanyApp.getCompanyId();
    this.regexEmail = easyTools.regexEmail();
    this.regexPassword = easyTools.regexPassword();
    this.regexPhoneNumber = easyTools.regexPhoneNumber();
    
    }

    ngOnInit() {
      this._initDialog();
    }
  
    /**
     * close popup
     */
    closeDialog(): void {
      this.dialogRef.close();
    }
  
  
    /**
     * save or update user detail
     * @param formData
     * @param form
     */
    saveUser(formData, form): void {
      if (this.isCreate) {
        // clone to not remove confirm password from form
        const cloned = _.cloneDeep(formData);
        cloned.companyId = this._companyId;
        delete cloned.preferences.passwordConfirm;
        cloned.preferences.languageId = this.easyUser.getLangId();
        this.sendingData = true;
        this.usersService.saveUser(cloned).subscribe(this._createSuccess, this._saveError);
      } else {
        const cloned = _.cloneDeep(formData.preferences);
        cloned.companyId = this._companyId;
        this.sendingData = true;
        this.usersService.updateUser(this.user.identifier, cloned).subscribe(this._updateSuccess, this._saveError);
      }
    };
  
    addAllUserProfiles = () => {
      const profilesToAdd = this.profiles.slice();
      const profileIds = profilesToAdd.map((profile) => {
        return profile.identifier;
      });
  
      const data = {
        profileIds: profileIds,
        companyId: this._companyId
      };
      this.usersService.addProfile(this.user.identifier, data).subscribe(res => {
        profilesToAdd.forEach(profile => {
          // profile.moved = true;
          this.profiles.splice(this.profiles.indexOf(profile), 1);
          this.userProfiles.push(profile);
        });
      });
    };
  
  
    addUserProfile = (profile) => {
      const data = {
        profileIds: [profile.identifier],
        companyId: this._companyId
      };
      this.usersService.addProfile(this.user.identifier, data).subscribe((res) => {
        const index = this.profiles.indexOf(profile);
        if (index !== -1) {
          profile.moved = true;
          this.profiles.splice(index, 1);
          this.userProfiles.push(profile);
        }
      });
    };
  
    removeAllUserProfiles = () => {
      const profilesToRemove = this.userProfiles.filter((profile) => {
        return profile.name !== 'Admin';
      });
      const profileIds = profilesToRemove.map((profile) => {
        return profile.identifier;
      });
  
      const data = {
        profileIds: profileIds,
        companyId: this._companyId
      };
  
      this.usersService.removeProfile(this.user.identifier, data).subscribe(res => {
        profilesToRemove.forEach(profile => {
          // profile.moved = true;
          this.userProfiles.splice(this.userProfiles.indexOf(profile), 1);
          this.profiles.push(profile);
        });
      });
    };
  
    removeUserProfile = (profile, $index) => {
      // cannot remove Company profile
      if (profile.name === 'Admin') {
        return false;
      }
  
      const data = {
        profileIds: [profile.identifier],
        companyId: this._companyId
      };
      this.usersService.removeProfile(this.user.identifier, data).subscribe(res => {
        const index = this.userProfiles.indexOf(profile);
        if (index !== -1) {
          profile.moved = true;
          this.userProfiles.splice(index, 1);
          this.profiles.push(profile);
        }
      });
    };
  
    _initDialog() {
      if (this.isCreate) {
        this.profilesPaneDisabled = true;
        this.userProfiles = [];
        this.dialogTitle = 'PLAT.USERS.ADD.INFO';
      } else {
        this.profilesPaneDisabled = false;
        this.dialogTitle = 'PLAT.USERS.EDIT.INFO';
        this.usersService.getById(this.user.identifier, {companyId: this._companyId}).subscribe(this._populateForm);
      }
    }
  
    /**
     * EDIT - populate form
     */
    _populateForm = res => {
      this.user = _.clone(res);
      this.userProfiles = res.profiles;
      this._loadProfiles();
    }
  
    _loadProfiles = () => {
      // do nothing if profiles loaded
      if (this.profiles.length !== 0) {
        return false;
      }
      this.securityService.queryProfiles({companyId: this._companyId}).subscribe((res) => {
        this.profiles = this._filterAvailables(res, this.userProfiles);
      });
    };
  
    /**
     * remove the user profile from the available profiles
     */
    _filterAvailables = (availables, userData) => {
      const availableProfile = [];
      availables.forEach(avl => {
        let isAssociated = false;
        userData.forEach(usr => {
          if (avl.identifier === usr.identifier) {
            isAssociated = true;
          }
        });
        if (!isAssociated && (avl.name === 'LC4Oracle' || avl.name === 'Standard' || avl.name === 'Admin')) {
          availableProfile.push(avl);
        }
      });
      return availableProfile;
    };
  
    /**
     * create success callback
     */
    _createSuccess = (res) => {
      this.user = _.cloneDeep(res);
      this.easyGrid.addRow(this.user);
      this.userProfiles = res.profiles;
      this._loadProfiles();
      this.profilesPaneDisabled = false;
      this.creationSuccess = true;
      this.sendingData = false;
      this.openProfilePane = true;
      this.openUserDetailPane = false;
    };
  
    /**
     * update success callback
     */
    _updateSuccess = (res) => {
      this.user = _.cloneDeep(res);
      this.easyGrid.updateRow(this.user.identifier, this.user);
      this.sendingData = false;
      this.openUserDetailPane = false;
      this.openProfilePane = true;
    };
  
    /**
     * save/update user error callback
     */
    _saveError = () => {
      this.creationSuccess = false;
      this.sendingData = false;
    }
  
  }
  