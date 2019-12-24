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
    ProfilePictureComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    RouterModule.forRoot(routes),

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
