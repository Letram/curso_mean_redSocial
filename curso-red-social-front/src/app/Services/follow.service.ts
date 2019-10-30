import {Injectable} from '@angular/core';
//To allow us to make ajax calls
import {HttpClient, HttpHeaders} from "@angular/common/http";

import {Observable} from "rxjs";
import {Follow} from "../Models/Follow";
import {GLOBAL} from "./global";

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  follow(authToken: string, follow: Follow): Observable<any> {
    var params = JSON.stringify(follow);
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', authToken);
    return this.http.post(this.url + 'follow', params, {headers: headers});
  }

  unfollow(authToken: string, user_id: string): Observable<any> {
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', authToken);
    return this.http.delete(this.url + 'follow/' + user_id, {headers: headers})
  }

  getUsersIFollow(authToken: string, user_id: string = null, page: Number = 1): Observable<any> {
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', authToken);

    if (user_id != null)
      return this.http.get(this.url + "following/" + user_id + "/" + page, {headers: headers});
    else
      return this.http.get(this.url + "following", {headers: headers});
  }

  getFollowers(authToken: string, user_id: string = null, page: Number = 1): Observable<any> {
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', authToken);

    if (user_id != null)
      return this.http.get(this.url + "followed/" + user_id + "/" + page, {headers: headers});
    else
      return this.http.get(this.url + "followed", {headers: headers});
  }

  getMyFollows(authToken: string): Observable<any> {
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', authToken);
    return this.http.get(this.url + 'follows/' + 'true', {headers: headers})
  }
}
