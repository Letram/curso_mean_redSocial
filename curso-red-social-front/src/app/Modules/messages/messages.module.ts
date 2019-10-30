import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
//components
import {MainComponent} from './main/main.component';
import {SendMessageComponent} from './send-message/send-message.component';
import {ReceivedMessagesComponent} from './received-messages/received-messages.component';
import {SentMessagesComponent} from './sent-messages/sent-messages.component';
import {MessageRoutingModule} from './message-routing.module';

//other modules
import {MomentModule} from "ngx-moment";

@NgModule({
  declarations: [
    MainComponent,
    SendMessageComponent,
    ReceivedMessagesComponent,
    SentMessagesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MessageRoutingModule,
    MomentModule
  ],
  //we can export both services or components to use in other parts of the app. Here we just export the components we created in case we need them outside this module.
  exports: [
    MainComponent,
    SendMessageComponent,
    ReceivedMessagesComponent,
    SentMessagesComponent
  ],

  //here we can add the services used in our module.
  providers: []
})
export class MessagesModule {
}
