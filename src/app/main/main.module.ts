import {NgModule} from '@angular/core';
import { MainComponent } from './main.component';
import {GuiCommonModule} from 'usu-fr-gui-commons/gui-common.module';
import { MainRoutingModule } from './main-routing.module';
import { CompanyComponent } from '../company/company.component';
import { UsuAngularComponentsModule } from '@usu/angular-components';
import { UsersComponent } from '../users/users.component';
import { AddUserDialogComponent } from '../users/add-user-dialog/add-user-dialog.component';




@NgModule({
    declarations: [
      MainComponent,
      CompanyComponent,
      UsersComponent,
      AddUserDialogComponent,

    ],
    imports: [
      MainRoutingModule, 
      GuiCommonModule,
      UsuAngularComponentsModule.forRoot(),
    ],
    entryComponents: [
      AddUserDialogComponent,
    ],
    providers: []
      
  })
export class  MainModule {

}
