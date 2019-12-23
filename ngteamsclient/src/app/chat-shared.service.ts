import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class ChatSharedService {

  constructor() { }

    // Observable string sources
    private message = new Subject<any>();
    private reply = new Subject<any>();

    // Observable string streams
    message$ = this.message.asObservable();
    reply$ = this.reply.asObservable();

      // Service message commands
    publishMessage(msg: any) {
      this.message.next(msg);
    }

    publishReply(reply: any) {
      this.reply.next(reply);
    }
}
