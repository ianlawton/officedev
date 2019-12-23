import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';
import { ChatSharedService } from '../chat-shared.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {
  @Input() team: any;
  @Input() channel: any;

  message = '';
  quote: any;

  selectedArea = [];
  selectingArea = false;
  uploading = false;
  uploadedFile: any;

  constructor(public service: AppService, private _sharedService: ChatSharedService) { }

  ngOnInit() {
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
      // this.messages = [...this.messages, thread];
      // this.replies[thread.id] = [];
      this._sharedService.publishMessage(thread);
      return;
    }

    if (this.quote) {
      const reply = await this.service.sendMessage(this.team.id, this.channel.id, this.message, this.quote.id);
      // this.replies[reply.replyToId].push(reply);
      this._sharedService.publishReply(reply);
      this.quote = null;
    } else {
      console.log('Creating new message thread..');

      const thread = await this.service.sendMessage(this.team.id, this.channel.id, this.message);
      // this.messages = [...this.messages, thread];
      this._sharedService.publishMessage(thread);
      //this.replies[thread.id] = [];
    }

    this.message = '';
    setTimeout(() => {
      const big = document.querySelector('#big');
      big.scrollTo(0, big.scrollHeight);
    }, 100);
  }

}
