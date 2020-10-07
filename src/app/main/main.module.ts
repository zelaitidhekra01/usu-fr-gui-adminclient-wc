import {NgModule} from '@angular/core';
import { MainComponent } from './main.component';
import {GuiCommonModule} from 'usu-fr-gui-commons/gui-common.module';
import { MainRoutingModule } from './main-routing.module';
import { CompanyComponent } from '../company/company.component';
import { UsuAngularComponentsModule } from '@usu/angular-components';
import { UsersComponent } from '../users/users.component';
import { AddUserDialogComponent } from '../users/add-user-dialog/add-user-dialog.component';
import { OrganizationsComponent } from '../organizations/organizations.component';
import { AddOrganizationDialogComponent } from '../organizations/add-organization-dialog/add-organization-dialog.component';
import { AddOrganizationTypeDialogComponent } from '../organizations/add-organization-type-dialog/add-organization-type-dialog.component';




@NgModule({
    declarations: [
      MainComponent,
      CompanyComponent,
      UsersComponent,
      AddUserDialogComponent,
      AddOrganizationDialogComponent,
      AddOrganizationTypeDialogComponent,
      OrganizationsComponent,

    ],
    imports: [
      MainRoutingModule, 
      GuiCommonModule,
      UsuAngularComponentsModule.forRoot(),
    ],
    entryComponents: [
      AddUserDialogComponent,
      AddOrganizationDialogComponent,
      AddOrganizationTypeDialogComponent

    ],
    providers: []
      
  })
export class  MainModule {

}
