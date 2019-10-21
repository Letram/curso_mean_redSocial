//To allow us inject this service into other classes
import {Injectable} from '@angular/core';

//To allow us to make ajax calls
import {HttpClient, HttpHeaders} from "@angular/common/http";

import {Observable} from "rxjs";
import {User} from "../Models/User";
import {GLOBAL} from "./global";
import {JSDocTagName} from "@angular/compiler/src/output/output_ast";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url: string;

  //user data and auth token
  public identity: User;
  public token: string;

  constructor(public http: HttpClient) {
    this.url = GLOBAL.url;
  }

  register(user_to_register: User): Observable<any> {
    let userJson = JSON.stringify(user_to_register);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    //api address, body content, {http headers}
    return this.http.post(this.url + "register", userJson, {headers: headers})
  }

  login(user_to_login: User, getToken = null): Observable<any> {
    if (getToken) {
      // @ts-ignore
      user_to_login.getToken = getToken
    }
    let userJson = JSON.stringify(user_to_login);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.url + "login", userJson, {headers: headers});
  }

  parseStoredUser() {
    let identity = JSON.parse(localStorage.getItem('identity'));

    if (identity != undefined) {
      this.identity = identity;
    } else this.identity = null;

    return this.identity;
  }

  parseStoredToken() {
    let token = localStorage.getItem('token');
    if (token != undefined) {
      this.token = token;
    } else this.token = null;
    return this.token;
  }
}
