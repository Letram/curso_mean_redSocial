import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {UserService} from "../../Services/user.service";
import {Publication} from "../../Models/Publication";
import {PublicationService} from "../../Services/publication.service";
import {Router, ActivatedRoute, Params, Route} from '@angular/router';
import {UploadService} from "../../Services/upload.service";

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public status = 0;
  public publication: Publication;

  //outputs
  @Output() publicationCreated = new EventEmitter();

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.identity = this.userService.parseStoredUser();
    this.token = this.userService.parseStoredToken();
    this.stats = this.userService.getStoredStatistics();
    this.publication = new Publication("", "", "", "", this.identity._id);
  }

  ngOnInit() {
    console.log("Sidebar component loaded...");
    console.log({stats: this.stats});

    //For the filechooser
    $(document).on('change', '.btn-file :file', function () {
      var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [numFiles, label]);
    });

    $(document).ready(function () {
      $('.btn-file :file').on('fileselect', function (event, numFiles, label) {

        var input = $(this).parents('.input-group').find(':text'),
          log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
          input.val(log);
        } else {
          if (log) alert(log);
        }

      });
    });
  }

  onSubmit(form) {
    this.publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        console.log(response);
        if (!response.publication) this.status = -1;
        else {
          //if the publication has any file we have to upload it.
          this.uploadService.makeUploadRequest('upload-image-pub/' + response.publication._id, [], this.filesToUpload, this.token, 'image')
            .then(
              (onSuccess:any) => {
                this.publication.file = onSuccess.image;
                form.reset();
                this.status = 1;
                this.stats.publications++;
                this.userService.updateStats(this.stats);
                this.router.navigate(['/timeline']);
              }
            );
        }
      },
      error => {
        console.log(error);
        this.status = -1;
      }
    );
  }

  emitPublcationCreatedEvent(event) {
    console.log("Se ha disparado el evento!");
    this.publicationCreated.emit({publicationCreated: true});
  };

  public filesToUpload: Array<File>;

  fileChangedEvent(event: any) {

    //event.target is a file input that has a property files in which files are stored.
    this.filesToUpload = <Array<File>>event.target.files;
  }
}
