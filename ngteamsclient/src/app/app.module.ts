import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MsalModule } from '@azure/msal-angular';
import { OAuthSettings } from './oauth';
import { AppComponent } from './app.component';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { SafePipe } from './app.service';
import { ChatClientComponent } from './chat-client/chat-client.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { MessageReactionsComponent } from './message-reactions/message-reactions.component';
import { ProfilePictureComponent } from './profile-picture/profile-picture.component';
import { AngularSplitModule } from 'angular-split';
import { MatSelectModule } from '@angular/material/select';
import { ChatPanelComponent } from './chat-panel/chat-panel.component';

const routes: Routes = [
  { path: '', component: AppComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    ChatClientComponent,
    ChatInputComponent,
    MessageReactionsComponent,
    ProfilePictureComponent,
    ChatPanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    MatSelectModule,
    RouterModule.forRoot(routes),
    AngularSplitModule.forRoot(),
    MsalModule.forRoot({
      clientID: OAuthSettings.appId,
      authority: OAuthSettings.authority
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
