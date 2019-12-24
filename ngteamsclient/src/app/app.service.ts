import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Client, BatchRequestStep, BatchRequestContent, OneDriveLargeFileUploadTask, ResponseType } from '@microsoft/microsoft-graph-client';
import { OAuthSettings } from './oauth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { stringToCssColor } from 'adaptivecards';

export class User {
  displayName: string;
  email: string;
  avatar: string;
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private graphClient: Client;

  public authenticated: boolean;
  public user$ = new BehaviorSubject<User>(undefined);

  constructor(
    private snackService: MatSnackBar,
    private msalService: MsalService
  ) {
    this.authenticated = this.msalService.getUser() != null;

    this.getUser().then((user) => {
      if (user) {
        this.user$.next(user);
        this.snack(`Welcome back ${user.displayName}!`);
      }
    });
  }

  async signIn(): Promise<void> {
    let result = await this.msalService.loginPopup(OAuthSettings.scopes)
      .catch((reason) => {
        console.log('[API ERROR]', reason);
        this.snack('Login failed');
      });

    if (result) {
      const user = await this.getUser();
      console.log('user', user);
      this.snack('Welcome');
    }
  }

  private async getUser(): Promise<User> {
    if (!this.authenticated) return null;

    this.graphClient = Client.init({
      authProvider: async(done) => {
        let token = await this.getAccessToken()
          .catch((reason) => {
            done(reason, null);
          });

        if (token) {
          done(null, token);
        } else {
          done("Could not get an access token", null);
        }
      }
    });

    let graphUser = await this.graphClient.api('/me').get();

    let user = new User();
    user.displayName = graphUser.displayName;
    user.email = graphUser.mail || graphUser.userPrincipalName;

    return user;
  }

  signOut(): void {
    this.msalService.logout();
    this.user$.next(undefined);
    this.authenticated = false;
  }

  async getAccessToken(): Promise<string> {
    let result = await this.msalService.acquireTokenSilent(OAuthSettings.scopes)
      .catch((reason) => {
        console.log('[API ERROR]', reason);
        this.snack('Get token failed');
      });

    return result;
  }

  async getJoinedTeams(): Promise<any> {
    let res = await this.graphClient
      .api('/me/joinedTeams')
      .get();

    return res.value;
  }

  async getChannels(team: string): Promise<any> {
    let res = await this.graphClient
      .api(`/teams/${team}/channels`)
      .get();

    return res.value;
  }

  async getMessages(team, channel): Promise<any> {
    const messages = await this.graphClient
      .api(`/teams/${team}/channels/${channel}/messages`)
      .version('beta')
      .get();

    const batchRequests = [];

    messages.value.forEach((m, i) => {
      const q = new Request(`/teams/${team}/channels/${channel}/messages/${m.id}/replies`);
      batchRequests.push({
        id: m.id,
        request: q
      } as BatchRequestStep);
    });

    const batchRequest = new BatchRequestContent(batchRequests);
    const repliesRequest = await batchRequest.getContent();

    const repliesResponse = await this.graphClient
      .api('/$batch')
      .version('beta')
      .post(repliesRequest);

    const replies = {};
    repliesResponse.responses.forEach(req => {
      replies[req.id] = req.body.value;
    });

    return {
      messages: messages.value.reverse(),
      replies
    };
  }

  async sendMessage(team, channel, message, messageId?: string): Promise<any> {
    // https://graph.microsoft.com/beta/teams/{team-id}/channels/{channel-id}/chatThreads
    let url = `/teams/${team}/channels/${channel}/messages`;
    if (messageId) {
      // It's reply
      url = `${url}/${messageId}/replies`;
    }

    console.log('Message', message);

    let res = await this.graphClient
      .api(url)
      .version('beta')
      .post(this.createMessageObj(message));

    return res;
  }

  async getProfilePicture(upn?: string): Promise<any> {
    // https://graph.microsoft.com/users/{id | userPrincipalName}/photo/$value
    const url = `/users/${upn}/photo/$value`;

    try {
      const blobData = await this.graphClient
        .api(url)
        .responseType(ResponseType.BLOB)
        .get();

      return blobData;

    } catch { return 'Could be an error'; }
  }

  async createImageFromBlob(blob: Blob): Promise<any>  {
    try {
      const contentBuffer = await this.readFileAsync(blob);
      return contentBuffer;
    } catch { return null; }

  }

  readFileAsync(blob: Blob): Promise<any> {
      return new Promise<any>((resolve, reject) => {
        const reader = new FileReader();
        const binaryString = reader.readAsDataURL(blob);
        reader.onload = (event: any) => {
          resolve (event.target.result);
        };
    });

  }

  createMessageObj(content) {
    if ((typeof content === 'string' && content.startsWith('http://kepler') || typeof content !== 'string')) {
      let card: any = {
        title: 'This is a TEST card',
        subtitle: 'It could be even Kepler report, aggregation result or things like that',
        text: 'Report: test.report.namespace.anything.dogs.and.cats/v4<br/>Calc id: #12332',
        buttons: [
          {
            "type": "openUrl",
            "title": "I want to see this report",
            "value": "/"
          }
        ]
      };

      let contentUrl = content;
      let thumbnail = '';

      if (typeof content !== 'string') {
        thumbnail = content.file.webUrl;
        card = {
          title: content.message,
          buttons: [
            {
              "type": "openUrl",
              "title": "See attachment",
              "value": content.file.webUrl
            }
          ],
          images: [
            {
              url: content.file.webUrl
            }
          ]
        };

        contentUrl = content.file.webUrl;
      }

      return {
        body: {
            "contentType": "html",
            "content": "<attachment id=\"1\"></attachment>"
        },
        attachments: [
            {
                "id": "1",
                "contentType": "application/vnd.microsoft.card.thumbnail",
                "contentUrl": contentUrl,
                "content": JSON.stringify(card),
                "name": null,
                "thumbnailUrl": 'https://hu.wikipedia.org/wiki/Johannes_Kepler#/media/F%C3%A1jl:Johannes_Kepler_1610.jpg'
            }
        ]
      };
    }

    return {
      body: { content }
    };
  }

  async fileUpload(file) {
    try {
      let response = await this.largeFileUpload(file);
      console.log(response);
      console.log("File Uploaded Successfully.!!");
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async largeFileUpload(file) {
    try {
      let options = {
        path: "/Documents",
        fileName: file.name,
        rangeSize: 1024 * 1024,
      };
      const uploadTask = await OneDriveLargeFileUploadTask.create(this.graphClient, file, options);
      const response = await uploadTask.upload();
      return response;
    } catch (err) {
      throw err;
    }
  }

  snack(msg: string) {
    this.snackService.open(msg, 'Dismiss', {
      duration: 3000
    });
  }
}
