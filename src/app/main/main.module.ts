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
import { ScenarioComponent } from '../scenario/scenario.component';
import { SaveAsDialogComponent } from '../scenario/save-as-dialog/save-as-dialog.component';
import { DefaultConnectionComponent } from '../default-connection/default-connection.component';
import { AddDefaultConnectionDialogComponent } from '../default-connection/add-default-connection-dialog/add-default-connection-dialog.component';
import { CollectorScheduleComponent } from '../collector-schedule/collector-schedule.component';
import { SmartcollectorFrequencyComponent } from '../smartcollector-frequency/smartcollector-frequency.component';




@NgModule({
    declarations: [
      MainComponent,
      CompanyComponent,
      UsersComponent,
      AddUserDialogComponent,
      AddOrganizationDialogComponent,
      AddOrganizationTypeDialogComponent,
      OrganizationsComponent,
      ScenarioComponent,
      SaveAsDialogComponent,
      DefaultConnectionComponent,
      AddDefaultConnectionDialogComponent,
      CollectorScheduleComponent,
      SmartcollectorFrequencyComponent

    ],
    imports: [
      MainRoutingModule, 
      GuiCommonModule,
      UsuAngularComponentsModule.forRoot(),
    ],
    entryComponents: [
      AddUserDialogComponent,
      AddOrganizationDialogComponent,
      AddOrganizationTypeDialogComponent,
      SaveAsDialogComponent,
      AddDefaultConnectionDialogComponent

    ],
    providers: []
      
  })
export class  MainModule {

}
