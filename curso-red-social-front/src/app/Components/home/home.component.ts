import { Component, OnInit } from '@angular/core';
import {UserService} from "../../Services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public title:string;
  public loggedIn:boolean;

  constructor(private userService:UserService) {
    this.title = "Welcome to a MEAN Social network";
  }

  ngOnInit() {
    console.log("Home component loaded");
    this.loggedIn = this.userService.parseStoredUser() != undefined;
  }

}
