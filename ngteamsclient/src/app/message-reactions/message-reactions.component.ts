import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message-reactions',
  templateUrl: './message-reactions.component.html',
  styleUrls: ['./message-reactions.component.scss']
})
export class MessageReactionsComponent implements OnInit {
  @Input() reactions: any;

  constructor() { }

  ngOnInit() {
  }

}
