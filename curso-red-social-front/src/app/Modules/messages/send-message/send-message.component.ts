import {Component, OnInit} from '@angular/core';
import {Message} from "../../../Models/Message";
import {MessageService} from "../../../Services/message.service";
import {Follow} from "../../../Models/Follow"
import {FollowService} from "../../../Services/follow.service";
import {UserService} from "../../../Services/user.service";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css'],
  providers: [MessageService, FollowService, UserService]
})
export class SendMessageComponent implements OnInit {
  public title: string;
  public message: Message;
  public identity;
  public token;
  public status: Number;
  public follows;
  constructor(
    private messageService: MessageService,
    private followService: FollowService,
    private userService: UserService,
    private router:Router,
    private route:ActivatedRoute
  ) {
    this.title = "Send message";
    this.status = 0;
    this.identity = this.userService.parseStoredUser();
    this.token = this.userService.parseStoredToken();
    this.message = new Message("", "", "", "", this.identity._id, "");
  }

  ngOnInit() {
    console.log("send-message component loaded...");
    this.getMyFollows();
  }

  onSubmit(sendMessageForm: NgForm) {
    console.log(this.message);
    this.messageService.sendMessage(this.token, this.message).subscribe(
      response => {
        console.log(response);
        if(response.message){
          this.status = 1;
          sendMessageForm.reset();
        }
      },
      error => {
        console.log(error);
        this.status = -1;
      }
    );
  }

  getMyFollows(){
    this.followService.getMyFollows(this.token).subscribe(
      response => {
        this.follows = response.follows;
      },
      error => {
        console.log(error);
        this.status = -1;
      }
    );
  }
}
