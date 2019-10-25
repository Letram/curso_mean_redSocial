import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Publication} from "../../Models/Publication";
import {UserService} from "../../Services/user.service";
import {UploadService} from "../../Services/upload.service";
import {User} from "../../Models/User";
import {PublicationService} from "../../Services/publication.service";
import {error} from "util";

declare var $: any;

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit {
  public identity;
  public token;
  public title: string;
  public page;
  public pages;
  public total_publications;
  public page_size;
  public publications: Publication[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private publicationService: PublicationService) {
    this.identity = this.userService.parseStoredUser();
    this.token = this.userService.parseStoredToken();
    this.title = "Timeline";
    this.page = 1;
  }

  ngOnInit() {
    console.log("Timeline component loaded...");
    this.getPublications(this.page);
  }

  getPublications(page, adding = false) {
    this.publicationService.getPublications(this.token, page).subscribe(
      response => {
        console.log(response);
        if (response.publications) {
          this.total_publications = response.total_items;
          this.pages = response.pages;
          this.page_size = response.page_size;
          if (!adding)
            this.publications = response.publications;
          else {
            let publicationsAux = this.publications;
            let publicationsToAppend = response.publications;
            this.publications = publicationsAux.concat(publicationsToAppend);
            if(this.total_publications == this.publications.length) this.noMore = true;
            console.log({total_publications: response.total_items, current_publications: this.publications.length});
            $('html, body').animate({scrollTop: $('body').prop('scrollHeight')}, 500);
          }
          if (page > this.pages) this.router.navigate(['/home']).then(() => {
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  public noMore = false;

  viewMore() {
    if (this.publications.length == this.total_publications) {
      this.noMore = true;
    } else {
      this.page += 1;
    }
    this.getPublications(this.page, true);
  }

  onPublicationCreated($event: any) {
    this.refresh();
  }

  refresh(){
    this.getPublications(1);
    this.noMore = false;
  }
}
