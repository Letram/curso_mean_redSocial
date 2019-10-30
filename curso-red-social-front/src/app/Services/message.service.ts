import {Injectable} from '@angular/core';
//To allow us to make ajax calls
import {HttpClient, HttpHeaders} from "@angular/common/http";

import {Observable} from "rxjs";
import {Message} from "../Models/Message";
import {GLOBAL} from "./global";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = GLOBAL.url
  }

  sendMessage(authToken: string, message: Message): Observable<any> {
    let params = JSON.stringify(message);
    let headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('Authorization', authToken);
    return this.http.post(this.url + "message", params, {headers: headers});
  }

  getReceivedMessages(authToken: string, page: Number = 1): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('Authorization', authToken);
    return this.http.get(this.url + `my-messages/${page}`, {headers: headers});
  }

  getSentMessages(authToken: string, page: Number = 1): Observable<any> {
    let headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('Authorization', authToken);
    return this.http.get(this.url + `messages/${page}`, {headers: headers});
  }


}
