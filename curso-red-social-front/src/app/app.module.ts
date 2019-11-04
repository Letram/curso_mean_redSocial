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
import { LoaderComponent } from './Components/loader/loader.component';

// Other modules
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {MomentModule} from "ngx-moment";
import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";

//my modules
import {MessagesModule} from "./Modules/messages/messages.module";

//my services
import {UserService} from "./Services/user.service";
import {UserGuard} from "./Services/user.guard";
import {LoaderService} from "./Services/loader.service";
import{LoaderInterceptor} from "./Helpers/loader.interceptor";

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
    FollowersComponent,
    LoaderComponent
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
    appRoutingProviders,
    UserService,
    UserGuard,
    LoaderService,
    {provide: HTTP_INTERCEPTORS, useClass:LoaderInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
