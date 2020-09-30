import {NgModule} from '@angular/core';
import { MainComponent } from './main.component';
import {GuiCommonModule} from 'usu-fr-gui-commons/gui-common.module';
import { MainRoutingModule } from './main-routing.module';
import { CompanyComponent } from '../company/company.component';
import { UsuAngularComponentsModule } from '@usu/angular-components';



@NgModule({
    declarations: [
      MainComponent,
      CompanyComponent
    ],
    imports: [
      MainRoutingModule, 
      GuiCommonModule,
      UsuAngularComponentsModule.forRoot(),
    ],
    entryComponents: [],
    providers: []
      
  })
export class  MainModule {

}
