import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ReferentialsService } from 'usu-fr-gui-commons/services';

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
      //resolve: {data: ReferentialsService},
      children: [
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
