import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { colourPalette } from '../../models/colour-palette';

@Component({
  selector: 'app-color-picker-dialog',
  templateUrl: './color-picker-dialog.component.html',
  styleUrls: ['./color-picker-dialog.component.scss'],
})
export class ColorPickerDialogComponent implements OnInit {
  colors = colourPalette;

  selectedColor: string;

  constructor(private dialogRef: MatDialogRef<ColorPickerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.selectedColor = this.data.selectedColor;
  }

  setSelectedColor(color: string): void {
    this.selectedColor = color;
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
}
