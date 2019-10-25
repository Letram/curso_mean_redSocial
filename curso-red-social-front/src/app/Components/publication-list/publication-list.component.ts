import {Component, OnInit} from '@angular/core';
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
            var publicationsAux = this.publications;
            var publicationsToAppend = response.publications;
            this.publications = publicationsAux.concat(publicationsToAppend);

            $('html, body').animate({scrollTop: $('body').prop('scrollHeight')}, 500);
          }
          if (page > this.pages && !adding) this.router.navigate(['/home']).then(() => {});
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  public moreAvailable = true;
  viewMore(){
    if(this.publications.length >= this.total_publications) this.moreAvailable = false;
    else{
      this.page++;
    }
    this.getPublications(this.page, true);
  }

}
