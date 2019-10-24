import { Component, OnInit } from '@angular/core';
import {UserService} from "../../Services/user.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService]
})
export class SidebarComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public status;

  constructor(private userService: UserService) {
    this.identity = this.userService.parseStoredUser();
    this.token = this.userService.parseStoredToken();
    this.stats = this.userService.getStoredStatistics();
  }

  ngOnInit() {
    console.log("Sidebar component loaded...");
    console.log({stats: this.stats});
  }

}
