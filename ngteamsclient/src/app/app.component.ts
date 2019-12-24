import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import html2canvas from 'html2canvas';
import { DomSanitizer } from '@angular/platform-browser';


/*
  Teams API documentation
  https://docs.microsoft.com/en-us/graph/api/resources/teams-api-overview?view=graph-rest-1.0

  API explorer
  https://developer.microsoft.com/en-us/graph/graph-explorer/preview
*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  channels = [];
  teams = [];
  team: any;
  channel: any;
  messages: any;
  replies = {};

  message = '';
  quote: any;

  selectedArea = [];
  selectingArea = false;
  uploading = false;
  uploadedFile: any;


  constructor(
    private sanitizer: DomSanitizer,
    public service: AppService,
    private snack: MatSnackBar,
  ){}

  ngOnInit() {
    this.service.user$.subscribe(user => {
      if (user) {
        this.service.getJoinedTeams().then(this.listTeams.bind(this));
      }
    });

  }

  async signIn() {
    await this.service.signIn();
  }

  singOut() {
    this.service.signOut();
  }

  async enterTeam(team) {
    this.team = team;

    this.channels = await this.service.getChannels(team.id);
  }

  async enterChannel(channel) {
    this.channel = channel;
  }

  toQuote(message) {
    this.quote = message;
  }

  listTeams(teams) {
    this.teams = teams;
  }

  selectArea() {
    this.selectingArea = true;
  }

  startSelect(e) {
    console.log('start', e.x, e.y);
    this.selectedArea[0] = e.x;
    this.selectedArea[1] = e.y;
  }

  endSelect(e) {
    console.log('start', e.x, e.y);
    this.selectedArea[2] = e.x;
    this.selectedArea[3] = e.y;

    this.selectingArea = false;
    this.takeScreenshot();
  }

  takeScreenshot() {
    html2canvas(document.body, {
      x: this.selectedArea[0],
      y: this.selectedArea[1],
      width: this.selectedArea[2] - this.selectedArea[0],
      height: this.selectedArea[3] - this.selectedArea[1]
    }).then((canvas) => {
      canvas.toBlob(async (blob) => {
        this.uploading = true;
        this.selectedArea = [];
        const rand = Math.random().toString(16).substring(2, 8);
        const f = new File([blob], `screengrab_${rand}.png`);
        const fileObj = await this.service.fileUpload(f);
        this.uploadedFile = fileObj;
        this.uploading = false;
      }, 'image/jpeg', 0.95);
    });
  }

  clearScreenshot() {
    document.querySelector('#screengrabContainer').innerHTML = '';
    console.log('clear', document.querySelector('#screengrabContainer').innerHTML)
    this.selectedArea = [];
  }
}
