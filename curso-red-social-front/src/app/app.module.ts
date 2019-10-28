import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
// routes config importing these consts to then load them into the import section (routing is a ModuleWithProviders module) and providers'
// (appRoutingProviders will be an array of providers)
import {routing, appRoutingProviders} from './app.routing';
// Components
import {AppComponent} from './app.component';
import {LoginComponent} from './Components/login/login.component';
import {RegisterComponent} from './Components/register/register.component';
import {HomeComponent} from './Components/home/home.component';
import {ProfileComponent} from './Components/profile/profile.component';
import {PeopleComponent} from './Components/people/people.component';
import {SidebarComponent} from './Components/sidebar/sidebar.component';
import {TimelineComponent} from './Components/timeline/timeline.component';
import { PublicationListComponent } from './Components/publication-list/publication-list.component';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';

// Other modules
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {MomentModule} from "ngx-moment";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    PeopleComponent,
    SidebarComponent,
    TimelineComponent,
    PublicationListComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    MomentModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
