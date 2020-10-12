import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ReferentialsService } from 'usu-fr-gui-commons/services';
import { CollectorScheduleComponent } from '../collector-schedule/collector-schedule.component';
import { CompanyComponent } from '../company/company.component';
import { DefaultConnectionComponent } from '../default-connection/default-connection.component';
import { OrganizationsComponent } from '../organizations/organizations.component';
import { ScenarioComponent } from '../scenario/scenario.component';
import { UsersComponent } from '../users/users.component';
import {SmartcollectorFrequencyComponent} from '../smartcollector-frequency/smartcollector-frequency.component';

import {MainComponent} from './main.component';

export const routes: Routes = [
    {
      path: 'main',
      redirectTo: 'settings/users',
      pathMatch: 'full'
    },
    {
      path: 'settings',
      component: MainComponent,
      resolve: {data: ReferentialsService},
      children: [
        {
          path: 'company',
          component: CompanyComponent
        },
        {
          path: 'users',
          component: UsersComponent
        },
        {
          path: 'organizations',
          component: OrganizationsComponent
        },
        {
          path: 'scenario',
          component: ScenarioComponent
        },
        {
          path: 'default-connection',
          component: DefaultConnectionComponent
        },
        {
          path: 'collector-schedule',
          component: CollectorScheduleComponent
        },
        {
          path: 'smartcollector-frequency',
          component: SmartcollectorFrequencyComponent
        }
       
      ]
    }

  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
