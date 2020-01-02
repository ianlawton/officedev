import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.scss']
})
export class ChatPanelComponent implements OnInit {
  @Input() team: any;
  @Input() channel: any;

  constructor() { }

  ngOnInit() {
  }

}
