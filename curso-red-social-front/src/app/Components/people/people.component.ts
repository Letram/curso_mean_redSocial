import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../../Services/user.service";
import {User} from "../../Models/User";

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  providers: [UserService]
})
export class PeopleComponent implements OnInit {
  public title: string = "";
  public identity;
  public token;
  public page;
  public next_p;
  public prev_p;
  public status:Number = 0;
  public total_users;
  public pages;
  public users: User[];
  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
    this.title = "People";
    this.identity = userService.parseStoredUser();
    this.token = userService.parseStoredToken();
  }

  ngOnInit() {
    console.log("People component loaded...");
    this.getCurrentPage();
  }

  getCurrentPage(){
    this.route.params.subscribe(params => {
      let page = +params['page'];
      if(!page) this.page = 1;
      else {
        this.page = page;
        this.next_p = page + 1;
        this.prev_p = page - 1;

        if(this.prev_p <= 0) this.prev_p = 1;
      }
      this.getUsers(this.page)
    });
  }

  getUsers(page){
    this.userService.getUsers(page).subscribe(
      response => {
        if (!response.users)this.status = -1;
        else{
          this.status = 1;
          this.total_users = response.total;
          this.users = response.users;
          this.pages = response.pages;
          if(page > this.pages) this.router.navigate(['/people', 1]).then(()=>{});
        }
      },
      error => {
        this.status = -1;
      }
    );
  }
}
