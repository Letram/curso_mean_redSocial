import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User} from '../../Models/User';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public title: string;
  public user: User;
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.title = 'Sign in!';
    this.user = new User('', '', '', '', '', '', '', '');
  }

  ngOnInit() {
    console.log('register component loaded');
  }

  onSubmit(registerForm: NgForm) {
    console.log(this.user);
  }
}
