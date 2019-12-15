import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MsalModule } from '@azure/msal-angular';
import { OAuthSettings } from './oauth';
import { AppComponent } from './app.component';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { SafePipe } from './app.service';

const routes: Routes = [
  { path: '', component: AppComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    SafePipe
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
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
