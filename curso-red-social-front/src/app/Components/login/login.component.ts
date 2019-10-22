import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from "../../Models/User";
import {UserService} from "../../Services/user.service";
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public title = '';
  public user: User;
  public status: Number;

  //object of the identified user and token given by the api
  public identity: User;
  public token: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.title = 'Log in!';
    this.user = new User("", "", "", "", "", "", "", "");
    this.status = 0;
  }

  ngOnInit() {
    console.log('login component loaded');
  }

  onSubmit(loginForm: NgForm) {
    this.userService.login(this.user).subscribe(
      response => {
        this.identity = response.user;
        if (!this.identity || !this.identity._id)
          this.status = -1;
        else {
          //persist user data. REMEMBER THAT LOCALSTORAGE ONLY STORES DATA AS STRING OR NUMBER -> USE JSON
          localStorage.setItem('identity', JSON.stringify(this.identity));
          //get user token
          this.getToken();
        }
      },
      error => {
        console.log(error);
        this.status = -1;
      }
    );
  }

  getToken() {
    this.userService.login(this.user, 'true').subscribe(
      response => {
        this.token = response.token;
        if (!this.token)
          this.status = -1;
        else {
          //persist token REMEMBER THAT LOCALSTORAGE ONLY STORES DATA AS STRING OR NUMBER -> USE JSON
          localStorage.setItem('token', this.token);
          //get user statistics
          this.getStatistics();
        }
      },
      error => {
        console.log(error);
        this.status = -1;
      }
    )
  }

  getStatistics() {
    this.userService.getStatistics().subscribe(
      response => {
        console.log({stats: response});
        localStorage.setItem("stats", JSON.stringify(response));
        this.status = 1;
        this.router.navigate(['/']).then(_ => {
        });
      },
      error => {
        console.log(error);
      }
    );
  }
}
