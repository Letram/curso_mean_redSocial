import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// routes config importing these consts to then load them into the import section (routing is a ModuleWithProviders module) and providers'
// (appRoutingProviders will be an array of providers)
import {routing, appRoutingProviders} from './app.routing';
// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';

// Other modules
import {FormsModule} from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
