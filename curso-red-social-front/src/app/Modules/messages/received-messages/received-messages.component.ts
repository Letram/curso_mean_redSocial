import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-received-messages',
  templateUrl: './received-messages.component.html',
  styleUrls: ['./received-messages.component.css']
})
export class ReceivedMessagesComponent implements OnInit {

  public title:string;

  constructor() {
    this.title = "Received messages";
  }

  ngOnInit() {
    console.log("received-messages component loaded...");
  }

}
