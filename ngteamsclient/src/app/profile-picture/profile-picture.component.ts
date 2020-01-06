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
   this.profilePicture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8d/LcfgAH+AMmBJXaVQAAAABJRU5ErkJggg==';
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {
    if (changes.upn) {
       this.GetProfilePicture();
    }
  }

  async GetProfilePicture() {
    const rawImage = await this.service.getProfilePicture(this.upn);
    if (!rawImage) {
      const user = await this.service.getUserByUPN(this.upn);
      if (user) {
        console.log(user);
        this.profilePicture = this.service.getFallbackProfilePicture(user.mail, user.displayName);
      }
    } else {
      this.profilePicture = await this.service.createImageFromBlob(rawImage);
    }

  }

}
