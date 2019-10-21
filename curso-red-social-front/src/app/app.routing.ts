import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Components for routing
import {LoginComponent} from './Components/login/login.component';
import {RegisterComponent} from './Components/register/register.component';
import {HomeComponent} from "./Components/home/home.component";

// in this case depending on the path of the url a different component will be loaded
const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
