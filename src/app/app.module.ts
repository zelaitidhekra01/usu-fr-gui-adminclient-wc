import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// import gui-common
//
import {GuiCommonModule} from 'usu-fr-gui-commons/gui-common.module';
import {languageLoader} from 'usu-fr-gui-commons/services/translate.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AppLoadModule} from 'usu-fr-gui-commons/app-load.module';

import {UsuAngularComponentsModule } from '@usu/angular-components';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MainModule} from './main/main.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppLoadModule,
    BrowserModule,
    UsuAngularComponentsModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    GuiCommonModule,
    ReactiveFormsModule,
    MainModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: (languageLoader)
      }
    })
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
