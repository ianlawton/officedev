import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AppService } from '../app.service';
import { AdaptiveCard, HostConfig, IMarkdownProcessingResult } from 'adaptivecards';
import { ChatSharedService } from '../chat-shared.service';
import { MessageReactionsComponent } from '../message-reactions/message-reactions.component';

@Component({
  selector: 'app-chat-client',
  templateUrl: './chat-client.component.html',
  styleUrls: ['./chat-client.component.scss']
})


export class ChatClientComponent implements OnInit {
  @Input() team: any;
  @Input() channel: any;
  messages: any;
  replies = {};
  reactions = {}; //emojis
  adaptiveCard: AdaptiveCard;


  constructor(public service: AppService, private _sharedService: ChatSharedService) {
    this.adaptiveCard = new AdaptiveCard();

    // Listens for messages from the input panel
    this._sharedService.message$.subscribe(
      msg => {
          console.log(msg);
          //this.messages = [...this.messages, msg];
          this.SetMessage(msg);
          //this.messages.push(msg);
      });
    this._sharedService.reply$.subscribe(
        reply => {
          console.log('Chat Client received message from input: ' + reply);
          this.replies[reply.replyToId].push(reply);

      });


  }

  ngOnInit() {

  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    this.GetMessages();

  }

  async GetMessages() {
      if (this.team && this.channel) {
          const { messages, replies } = await this.service.getMessages(this.team.id, this.channel.id);
          this.messages = messages;
          this.replies = replies;
          console.log(this.messages);

          setTimeout(() => {
            const big = document.querySelector('#big');
            big.scrollTo(0, big.scrollHeight);
          }, 100);
      }

    }

    SetMessage(msg){
      this.messages = [...this.messages, msg];
      console.log(this.messages);
    }

    inJSON(json) {
      return JSON.parse(json);
    }


    parseCard(json) {
      // Parse the card payload from the message
      this.adaptiveCard.parse(this.inJSON(json));

      const htmlText = this.adaptiveCard.render();
      return htmlText.innerHTML;

    }

    /* AdaptiveCard.onProcessMarkdown = (text: string, result: IMarkdownProcessingResult) => {
      result.outputHtml = text;
      result.didProcess = true;
    } */

    parseActionCard(json){
      return '<b>MS Outlook Card</b>';
    }

    // In message animated emojis work using CSS animate calls.
    // By adding a Zoetrope tag we can use the css from Teams
    addAnimatedEmojiSupport(msgText){
      // TODO Match on
      // <span class="animated-emoticon-20-angry" contenteditable="false" title="Angry" type="(angry)"><img itemid="angry" itemscope="" itemtype="http://schema.skype.com/Emoji" src="https://statics.teams.microsoft.com/evergreen-assets/skype/v2/angryV2/20.png?v=4" style="width:20px;height:20px;" alt="😡"><span class="zoetrope"></span></span>
    }

}
