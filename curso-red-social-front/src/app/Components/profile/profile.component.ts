import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router} from "@angular/router";
import { User } from "../../Models/User";
import { UserService } from "../../Services/user.service";
import {NgForm} from "@angular/forms";
import {UploadService} from "../../Services/upload.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, UploadService]
})
export class ProfileComponent implements OnInit {
  public title:string;
  public user: User;
  public identity;
  public token;
  public status:Number = 0;
  constructor(private route:ActivatedRoute,
              private router:Router,
              private userService:UserService,
              private uploadService: UploadService) {
    this.title = 'My profile';
    this.user = userService.parseStoredUser();
    if(this.user == undefined) this.router.navigate(['/']).then(_ => {});
    this.identity = this.user;
    this.token = userService.parseStoredToken();
  }

  ngOnInit() {
    console.log("Profile component loaded...");
  }

  onSubmit() {
    this.userService.updateUser(this.user).subscribe(
      response => {
        console.log(response);
        if(!response.updatedUser)this.status = -1;
        else{
          this.status = 1;
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;
          //Avatar image upload
          this.uploadService.makeUploadRequest("upload-image-user/" + this.user._id, [],  this.filesToUpload, this.token, "image")
            .then((result: any) => {
              console.log({result});
              this.user.image = result.updatedUser.image;
              localStorage.setItem('identity', JSON.stringify(this.user));
              this.identity = this.user;
            });
        }
      },
      error => {
        console.log(error);
        this.status = -1;
      }
    );
  }

  public filesToUpload: Array<File>;
  onFileChanged(fileInput: any) {
    this.filesToUpload = <Array<File>> fileInput.target.files;
    console.log(this.filesToUpload);
  }
}
