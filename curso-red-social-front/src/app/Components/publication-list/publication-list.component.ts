import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Publication} from "../../Models/Publication";
import {UserService} from "../../Services/user.service";
import {UploadService} from "../../Services/upload.service";
import {User} from "../../Models/User";
import {PublicationService} from "../../Services/publication.service";

declare var $:any;

@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.css']
})
export class PublicationListComponent implements OnInit {

  public identity;
  public token;
  public title: string;
  public page;
  public pages;
  public total_publications;
  public page_size;
  public publications: Publication[];

  @Input() user_id:string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private publicationService: PublicationService) {
    this.identity = this.userService.parseStoredUser();
    this.token = this.userService.parseStoredToken();
    this.title = "Publication list";
    this.page = 1;
  }

  ngOnInit() {
    console.log("Publication list component loaded...");
    this.getPublications(this.user_id, this.page);
  }

  getPublications(user_id, page, adding = false) {
    this.publicationService.getPublicationsFromUser(this.token, page, user_id).subscribe(
      response => {
        console.log(response);
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
      },
      error => {
        console.log(error);
      }
    );
  }

  public noMore = false;
  viewMore(){
    if (this.publications.length == this.total_publications) {
      this.noMore = true;
    } else {
      this.page += 1;
    }
    this.getPublications(this.user_id, this.page, true);
  }

}
