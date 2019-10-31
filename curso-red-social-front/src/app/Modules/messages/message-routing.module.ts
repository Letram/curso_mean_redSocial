import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

//components
import {MainComponent} from './main/main.component';
import {SendMessageComponent} from './send-message/send-message.component';
import {ReceivedMessagesComponent} from './received-messages/received-messages.component';
import {SentMessagesComponent} from './sent-messages/sent-messages.component';
import {UserGuard} from "../../Services/user.guard";

//creating the children attribute we say that every path is appended (?) to the parents path. EX: messajes/[childrenPath]
//redirectTo redirects every route that matches the path to the path that is written there. In this case if we go to messages/ it will redirect us to messages/received.

const messageRoutes: Routes = [
  {
    path: "messages",
    component: MainComponent,
    children: [
      {path: "", redirectTo: "received", pathMatch: 'full'},
      {path: "send", component: SendMessageComponent, canActivate:[UserGuard] },
      {path: "sent", component:SentMessagesComponent, canActivate:[UserGuard] },
      {path: "received", component:ReceivedMessagesComponent, canActivate:[UserGuard]}
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(messageRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MessageRoutingModule { }
