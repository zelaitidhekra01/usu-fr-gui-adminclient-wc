import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {UsuAngularComponentsModule } from '@usu/angular-components';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { initializer } from '../keycloak/keycloak.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UsuAngularComponentsModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
