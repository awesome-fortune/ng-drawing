import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-color-picker-dialog',
  templateUrl: './color-picker-dialog.component.html',
  styleUrls: ['./color-picker-dialog.component.scss'],
})
export class ColorPickerDialogComponent implements OnInit {
  colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Cinnabar', value: '#E53935' },
    { name: 'Amaranth', value: '#D81B60' },
    { name: 'Seance', value: '#8E24AA' },
    { name: 'Purple Heart', value: '#5E35B1' },
    { name: 'Sapphire', value: '#3949AB' },
    { name: 'Curious Blue', value: '#1E88E5' },
    { name: 'Cerulean', value: '#039BE5' },
    { name: 'Pacific Blue', value: '#00ACC1' },
    { name: 'Teal', value: '#00897B' },
    { name: 'Apple', value: '#43A047' },
    { name: 'Sushi', value: '#7CB342' },
    { name: 'Earls Green', value: '#C0CA33' },
    { name: 'Bright Sun', value: '#FDD835' },
    { name: 'Selective Yellow', value: '#FFB300' },
    { name: 'Pizazz', value: '#FB8C00' },
    { name: 'Pomegranate', value: '#F4511E' },
    { name: 'Kabul', value: '#6D4C41' },
    { name: 'Boulder', value: '#757575' },
    { name: 'Cutty Sark', value: '#546E7A' },
  ];

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
