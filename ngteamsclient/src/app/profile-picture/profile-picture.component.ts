import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AppService } from '../app.service';
import '@microsoft/mgt/dist/es6/components/mgt-person/mgt-person';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent implements OnInit {
  @Input() upn: string;
  profilePicture: any;

  constructor(public service: AppService) { }

  public async ngOnInit(): Promise<void> {
    this.profilePicture = await this.service.getProfilePicture(this.upn);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.


  }


  async GetProfilePicture() {
    console.log(this.upn);
    if (this.upn) {
      this.profilePicture = await this.service.getProfilePicture(this.upn);
      console.log(this.profilePicture);
       // this.profilePicture = 'data:image/png;base64,' + rawImage;
    }
  }

  async getSafeImage() {
    if (this.upn) {
      return await this.service.getProfilePicture(this.upn);
    }
  }

}
