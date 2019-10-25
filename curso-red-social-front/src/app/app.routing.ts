import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Components for routing
import {LoginComponent} from './Components/login/login.component';
import {RegisterComponent} from './Components/register/register.component';
import {HomeComponent} from "./Components/home/home.component";
import {ProfileComponent} from './Components/profile/profile.component';
import {PeopleComponent} from "./Components/people/people.component";
import {TimelineComponent} from "./Components/timeline/timeline.component";

// in this case depending on the path of the url a different component will be loaded
/**
 * "**" means the 404 route (a link to non existing page)
 */
const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'people', component: PeopleComponent},
  {path: 'people/:page', component: PeopleComponent},
  {path: 'timeline', component:TimelineComponent},
  {path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
