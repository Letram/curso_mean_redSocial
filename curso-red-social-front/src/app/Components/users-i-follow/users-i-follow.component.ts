import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../../Services/user.service";
import {User} from "../../Models/User";
import {FollowService} from "../../Services/follow.service";
import {Follow} from "../../Models/Follow";

@Component({
  selector: 'app-users-i-follow',
  templateUrl: './users-i-follow.component.html',
  styleUrls: ['./users-i-follow.component.css'],
  providers: [UserService, FollowService]
})
export class UsersIFollowComponent implements OnInit {

  public title: string = "";
  public identity;
  public token;
  public page;
  public next_p;
  public prev_p;
  public status: Number = 0;
  public total_users;
  public pages;
  public follows: any[];
  public users_user_is_following: any[];
  public users_following_user: any[];
  public currentUserId: string;
  public currentUser: User;

  constructor(
    private userService: UserService,
    private followService: FollowService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.title = "";
    this.identity = userService.parseStoredUser();
    this.token = userService.parseStoredToken();
  }

  ngOnInit() {
    console.log("Users I follow component loaded...");
    this.getCurrentPage();
  }

  getCurrentPage() {
    this.route.params.subscribe(params => {
      let page = +params['page'];
      let user_id = params['user_id'];
      this.currentUserId = user_id;
      if (!page) this.page = 1;
      else {
        this.page = page;
      }
      this.next_p = this.page + 1;
      this.prev_p = this.page - 1;
      if (this.prev_p <= 0) this.prev_p = 1;
      //this.getUsersIFollow(user_id, this.page);
      this.getUser(user_id, this.page);
      console.log({currentPage: this.page, next: this.next_p, prev: this.prev_p});
    });
  }

  getUsersIFollow(user_id, page) {
    this.followService.getUsersIFollow(this.token, user_id, page).subscribe(
      response => {
        console.log(response);
        if (!response.follows) this.status = -1;
        else {


          this.status = 1;
          this.total_users = response.total;
          this.follows = response.follows;
          this.pages = response.pages;
          this.users_user_is_following = response.users_following ? response.users_following : [];
          this.users_following_user = response.users_follow_me ? response.users_follow_me : [];
          if (page > this.pages) this.router.navigate(['/people', 1]).then(() => {
          });


        }
      },
      error => {
        console.log(error);
        this.status = -1;
      }
    );
  }

  getUser(user_id, page) {
    this.userService.getUser(user_id).subscribe(
      response => {
        if (response.user) {
          this.currentUser = response.user;
          this.getUsersIFollow(user_id, page);
        } else this.router.navigate(['/home'])
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
        if (index != -1) {
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
        if (!response.follow) this.status = -1;
        else {
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
