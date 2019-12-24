import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

const M = [
  CommonModule,

  MatButtonModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatIconModule,
  MatCardModule,
  MatListModule,
  MatProgressBarModule
]

@NgModule({
  exports: M,
  imports: M
})
export class MaterialModule { }
