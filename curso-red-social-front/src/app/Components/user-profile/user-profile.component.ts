import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Follow} from "../../Models/Follow";
import {UserService} from "../../Services/user.service";
import {User} from "../../Models/User";
import {FollowService} from "../../Services/follow.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [UserService, FollowService]
})
export class UserProfileComponent implements OnInit {
  public title: string;
  public user: User;
  public status;
  public identity;
  public token;
  public stats;
  public is_following_me: boolean;
  public is_followed_by_me:boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private followService: FollowService
  ) {
    this.title = "Profile";
    this.status = 0;
    this.identity = this.userService.parseStoredUser();
    this.token = this.userService.parseStoredToken();
    this.is_followed_by_me = false;
    this.is_following_me = false;
  }

  ngOnInit() {
    console.log("user profile component loaded...");
    this.route.params.subscribe(
      params => {
        let id = params['id'];
        this.getUser(id);
        this.getStatistics(id);
      }
    );
  }


  getUser(id:string){
    this.userService.getUser(id).subscribe(
      response => {
          console.log(response);
          if(response.user){
            this.user = response.user;
            if (response.following && response.following._id) this.is_followed_by_me = true;
            if(response.followed && response.followed._id) this.is_following_me = true;
          }else this.status = -1;
      },
      error => {
        console.log(error);
        this.status = -1;
        this.router.navigate(['/profile', this.identity._id]).then(() => {});
      }
    );
  }
  getStatistics(id:string){
    this.userService.getStatistics(id).subscribe(
      response => {
        this.stats = response;
      },
      error => {
        console.log(error)
      }
    );
  }

  followUser(_id: string) {
    let follow = new Follow("", this.identity._id, _id);
    this.followService.follow(this.token, follow).subscribe(
      response => {
        this.is_followed_by_me = true;
      },
      error => {
        console.log(error);
      }
    )
  }

  unfollowUser(_id: string) {
    this.followService.unfollow(this.token, _id).subscribe(
      response => {
        console.log(response);
        this.is_followed_by_me = false;
      },
      error => {
        console.log(error)
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
}
