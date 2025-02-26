import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgClass } from '@angular/common';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [MatDialogModule, NgClass, MatButton],
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string; type: 'success' | 'error' },
    public dialogRef: MatDialogRef<AlertDialogComponent>
  ) {}
}
