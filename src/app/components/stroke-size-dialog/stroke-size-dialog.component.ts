import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-stroke-size-dialog',
  templateUrl: './stroke-size-dialog.component.html',
  styleUrls: ['./stroke-size-dialog.component.scss'],
})
export class StrokeSizeDialogComponent implements OnInit {
  strokeSize: number;

  constructor(private dialogRef: MatDialogRef<StrokeSizeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.strokeSize = this.data.strokeSize;
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
}
