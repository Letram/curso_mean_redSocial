import {Component, OnInit} from '@angular/core';
import {Message} from "../../../Models/Message";
import {MessageService} from "../../../Services/message.service";
import {Follow} from "../../../Models/Follow"
import {FollowService} from "../../../Services/follow.service";
import {UserService} from "../../../Services/user.service";
import {Router, ActivatedRoute, Params} from "@angular/router";

declare var $:any;

@Component({
  selector: 'app-received-messages',
  templateUrl: './received-messages.component.html',
  styleUrls: ['./received-messages.component.css'],
  providers: [UserService, FollowService, MessageService]
})
export class ReceivedMessagesComponent implements OnInit {

  public title: string;
  public messages: any[];
  public identity;
  public token;
  public pages: number;
  public page: number;
  public total_messages: number;
  public page_size: number;
  public status: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
    private followService: FollowService
  ) {
    this.title = "Received messages";
    this.identity = userService.parseStoredUser();
    this.token = userService.parseStoredToken();
    this.page = 1;
  }

  ngOnInit() {
    console.log("received-messages component loaded...");
    this.getReceivedMessages(this.page);
  }

  getReceivedMessages(page: Number, adding: boolean = false) {
    this.messageService.getReceivedMessages(this.token, page).subscribe(
      response => {
        console.log(response);
        if (response.messages) {
          this.total_messages = response.totalMessages;
          this.pages = response.pages;
          this.page_size = response.page_size;
          if (!adding)
            this.messages = response.messages;
          else {
            let messagesAux = this.messages;
            let messagesToAppend = response.messages;
            this.messages = messagesAux.concat(messagesToAppend);
            console.log({current_messages: this.messages.length, total: this.total_messages});
            $('html, body').animate({scrollTop: $('body').prop('scrollHeight')}, 500);
          }
          if (this.total_messages == this.messages.length) this.noMore = true;
          this.status = 1;
        }
      },
      error => {
        console.log(error);
        this.status = -1;
      }
    );
  }

  public noMore: boolean = false;

  viewMore() {
    if (this.messages.length == this.total_messages) {
      this.noMore = true;
    } else {
      this.page += 1;
    }
    this.getReceivedMessages(this.page, true);
  }

}
