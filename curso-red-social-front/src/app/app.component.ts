import {Component, OnInit, DoCheck} from '@angular/core';
import { UserService } from "./Services/user.service";
import {ActivatedRoute, Router, Params} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck{
  title:string = '';
  public identity;

  constructor(
    private userService:UserService,
    private route: ActivatedRoute,
    private router: Router,
  ){
    this.title = "MEAN Social network";
  }

  ngOnInit(){
    this.identity = this.userService.parseStoredUser();
    console.log(this.identity);
  }

  //everytime a change has been made (changes in localstorage, event in the app, ...) this function is called.
  ngDoCheck(){
    this.identity = this.userService.parseStoredUser();
  }

  logout() {
    localStorage.clear();
    this.identity = null;
    this.router.navigate(['/']).then(_ => {});
  }
}
