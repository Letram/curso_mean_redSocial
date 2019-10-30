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
import {PublicationListComponent} from './Components/publication-list/publication-list.component';
import {UserProfileComponent} from './Components/user-profile/user-profile.component';
import {UsersIFollowComponent} from './Components/users-i-follow/users-i-follow.component';
import {FollowersComponent} from './Components/followers/followers.component';

// Other modules
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {MomentModule} from "ngx-moment";

//my modules
import {MessagesModule} from "./Modules/messages/messages.module";

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
    UserProfileComponent,
    UsersIFollowComponent,
    FollowersComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    MomentModule,
    MessagesModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
