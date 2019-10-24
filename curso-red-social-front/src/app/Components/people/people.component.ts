import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../../Services/user.service";
import {User} from "../../Models/User";
import {FollowService} from "../../Services/follow.service";
import {Follow} from "../../Models/Follow";

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  providers: [UserService, FollowService]
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
  public users_user_is_following: any[];
  public users_following_user: any[];

  constructor(private userService: UserService,
              private followService: FollowService,
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
      }
      this.next_p = this.page + 1;
      this.prev_p = this.page - 1;
      if (this.prev_p <= 0) this.prev_p = 1;
      this.getUsers(this.page);
      console.log({currentPage: this.page, next: this.next_p, prev: this.prev_p});
    });
  }

  getUsers(page){
    this.userService.getUsers(page).subscribe(
      response => {
        console.log(response);
        if (!response.users)this.status = -1;
        else{
          this.status = 1;
          this.total_users = response.total;
          this.users = response.users;
          this.pages = response.pages;
          this.users_user_is_following = response.users_following ? response.users_following : [];
          this.users_following_user = response.users_followed ? response.users_followed : [];
          if(page > this.pages) this.router.navigate(['/people', 1]).then(()=>{});
        }
      },
      error => {
        console.log(error);
        this.status = -1;
      }
    );
  }

  public followUserOver;
  onMouseEnter(_id: string) {
    this.followUserOver = _id;
  }

  onMouseLeave(_id: string) {
    this.followUserOver = 0;
  }

  unfollowUser(_id: string) {
    this.followService.unfollow(this.token, _id).subscribe(
      response => {
        console.log(response);
        var index = this.users_user_is_following.indexOf(_id);
        if(index != -1){
          this.users_user_is_following.splice(index, 1);
        }
      },
      error => {
        console.log(error);
        this.status = -1;
      }
    );
  }

  followUser(_id: string) {
    //follow._id goes empty because it will be added in the backend
    var follow = new Follow("", this.identity._id, _id);
    this.followService.follow(this.token, follow).subscribe(
      response => {
        console.log(response);
        if(!response.follow) this.status = -1;
        else{
          this.status = 1;
          this.users_user_is_following.push(response.follow.followed);
        }
      },
      error => {
        console.log(error);
        this.status = -1;
      }
    );
  }
}
