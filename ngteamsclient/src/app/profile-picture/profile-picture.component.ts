import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AppService } from '../app.service';


@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})

export class ProfilePictureComponent implements OnInit {
  @Input() upn: string;
  profilePicture: any;

  constructor(public service: AppService) {
  }

 ngOnInit() {
   console.log(this.upn);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {
    if (changes.upn) {
       this.GetProfilePicture();
    }
  }

  async GetProfilePicture() {
    const rawImage = await this.service.getProfilePicture(this.upn);
    this.profilePicture = await this.service.createImageFromBlob(rawImage);

  }

}
