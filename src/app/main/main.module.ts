import {NgModule} from '@angular/core';
import { MainComponent } from './main.component';
import {GuiCommonModule} from 'usu-fr-gui-commons/gui-common.module';
import { MainRoutingModule } from './main-routing.module';
import { CompanyComponent } from '../company/company.component';



@NgModule({
    declarations: [
      MainComponent,
      CompanyComponent
    
    ],
    imports: [
      MainRoutingModule, 
      GuiCommonModule
    ],
    entryComponents: [],
    providers: []
      
  })
export class  MainModule {

}
