import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public title:string;

  constructor() {
    this.title="Direct messages";
  }

  ngOnInit() {
    console.log("Messages main component loaded...");
  }

}
