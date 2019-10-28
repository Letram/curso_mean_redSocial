import { Injectable } from '@angular/core';
import { GLOBAL } from "./global";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public url:string;

  constructor() {
    this.url = GLOBAL.url;
  }

  makeUploadRequest(path:string, params: Array<string>, files: Array<File>, authToken: string, fieldName: string){
    console.log(this.url + path);
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();

      for (let i = 0; i < files.length; i++){
        formData.append(fieldName, files[i], files[i].name);
      }

      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4){
          if(xhr.status == 200)resolve(JSON.parse(xhr.response));
          else reject(xhr.response);
        }
      };
      xhr.open('POST', this.url + path, true);
      xhr.setRequestHeader('Authorization', authToken);
      xhr.send(formData);
    });
  }
}
