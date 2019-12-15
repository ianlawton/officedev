import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatButtonModule, MatSnackBarModule, MatIconModule, MatCardModule, MatListModule, MatProgressBarModule } from '@angular/material';

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
