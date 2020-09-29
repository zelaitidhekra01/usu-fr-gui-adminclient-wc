import {NgModule} from '@angular/core';
import { MainComponent } from './main.component';
import {GuiCommonModule} from 'usu-fr-gui-commons/gui-common.module';
import { MainRoutingModule } from './main-routing.module';



@NgModule({
    declarations: [
      MainComponent,
    
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
