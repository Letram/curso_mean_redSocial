import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// routes config importing these consts to then load them into the import section (routing is a ModuleWithProviders module) and providers'
// (appRoutingProviders will be an array of providers)
import {routing, appRoutingProviders} from './app.routing';
// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';

// Other modules
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
