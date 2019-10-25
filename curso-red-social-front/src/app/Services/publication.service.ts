import {Injectable} from '@angular/core';
//To allow us to make ajax calls
import {HttpClient, HttpHeaders} from "@angular/common/http";

import {Observable} from "rxjs";
import {Publication} from "../Models/Publication";
import {GLOBAL} from "./global";

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addPublication(authToken, publication: Publication): Observable<any> {
    var params = JSON.stringify(publication);
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', authToken);
    return this.http.post(this.url + "publication", params, {headers: headers});
  }

  getPublications(authToken, page = 1): Observable<any> {
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', authToken);
    return this.http.get(this.url + "publications/" + page, {headers});
  }

  removePublication(authToken, pub_id): Observable<any> {
    var headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', authToken);
    return this.http.delete(this.url + "publication/" + pub_id, {headers});
  }

}
