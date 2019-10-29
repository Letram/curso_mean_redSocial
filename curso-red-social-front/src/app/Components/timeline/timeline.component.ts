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

    $('#modal_confirmation').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget); // Button that triggered the modal
      var publication_text = button.data('publication_text'); // Extract info from data-* attributes
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      var modal = $(this);
      modal.find('.modal-body p.text-muted').text(publication_text);
    })

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

  public publicationImageShowing: string;

  showImage(pub_id){
    this.publicationImageShowing = pub_id;
  }

  public publicationForRemoval = "";
  removePublication() {
    if(this.publicationForRemoval != ""){
      this.publicationService.removePublication(this.token, this.publicationForRemoval).subscribe(
        response => {
          this.refresh();
        },
        error => {
          console.log(error)
        }
      );
    }
  }

  preparePublicationForRemoval(_id: string) {
    this.publicationForRemoval = _id;
  }
}
