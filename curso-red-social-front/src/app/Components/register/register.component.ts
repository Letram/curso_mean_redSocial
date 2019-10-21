import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User} from '../../Models/User';
import {NgForm} from '@angular/forms';
import {UserService} from "../../Services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public title: string;
  public user: User;
  public status:number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.title = 'Sign in!';
    this.user = new User('', '', '', '', '', '', '', '');
  }

  ngOnInit() {
    console.log('register component loaded');
  }

  onSubmit(registerForm: NgForm) {
    this.userService.register(this.user).subscribe(
      response => {
        if(response.user && response.user._id){
          this.status = 1;
          registerForm.resetForm();
        } else{
          this.status = -1;
        }
    },
      error =>{
        console.log(error);
        this.status = -1;
      }
    );
  }
}
