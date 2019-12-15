import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import { MatSnackBar } from '@angular/material';
import html2canvas from 'html2canvas';
import { DomSanitizer } from '@angular/platform-browser';
import { AdaptiveCard, HostConfig } from 'adaptivecards';

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
  adaptiveCard: AdaptiveCard;

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
  )
  {
    this.adaptiveCard = new AdaptiveCard();
   /* this.adaptiveCard.hostConfig = new HostConfig({
      fontFamily: 'Segoe UI, Helvetica Neue, sans-serif'
      // More host config options
    });*/
    // this.adaptiveCard.onExecuteAction(action => { alert (action); });

  }

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

    const { messages, replies } = await this.service.getMessages(this.team.id, channel.id);
    this.messages = messages;
    this.replies = replies;

    console.log('messages', this.messages);
    console.log('replies', this.replies);
  //  this.messages.forEach(m => {
  //    console.log(m.body.contentType);
  //  });

    setTimeout(() => {
      const big = document.querySelector('#big');
      big.scrollTo(0, big.scrollHeight);
    }, 100);
  }

  async send(e: Event) {
    e.preventDefault();
    console.log('Attachments', this.uploadedFile);

    if (this.uploadedFile) {
      const msg = {
        file: this.uploadedFile,
        message: this.message
      }

      const thread = await this.service.sendMessage(this.team.id, this.channel.id, msg);
      console.log('Uploaded media', thread);
      this.uploadedFile = undefined;
      this.message = '';
      this.messages = [...this.messages, thread];
      this.replies[thread.id] = [];
      return;
    }

    if (this.quote) {
      const reply = await this.service.sendMessage(this.team.id, this.channel.id, this.message, this.quote.id);
      this.replies[reply.replyToId].push(reply);
      this.quote = null;
    } else {
      console.log('creating new message thread..');
      const thread = await this.service.sendMessage(this.team.id, this.channel.id, this.message);
      this.messages = [...this.messages, thread];
      this.replies[thread.id] = [];
    }

    this.message = '';
    setTimeout(() => {
      const big = document.querySelector('#big');
      big.scrollTo(0, big.scrollHeight);
    }, 100);
  }

  inJSON(json) {
    return JSON.parse(json);
  }


  parseCard(json) {
    console.log(json);
    // Parse the card payload from the message
    this.adaptiveCard.parse(this.inJSON(json));
    const htmlText = this.adaptiveCard.render();
    return htmlText.innerHTML;

  }

  parseActionCard(json){
    return '<b>MS Outlook Card</b>';
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
