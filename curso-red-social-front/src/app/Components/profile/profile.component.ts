import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router} from "@angular/router";
import { User } from "../../Models/User";
import { UserService } from "../../Services/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService]
})
export class ProfileComponent implements OnInit {
  public title:string;
  public user: User;
  public identity;
  public token;
  public status:Number = 0;
  constructor(private route:ActivatedRoute, private router:Router, private userService:UserService) {
    this.title = 'My profile';
    this.user = userService.parseStoredUser();
    if(this.user == undefined) this.router.navigate(['/']).then(_ => {});
    this.identity = this.user;
    this.token = userService.parseStoredToken();
  }

  ngOnInit() {
    console.log("Profile component loaded...");
  }

}
