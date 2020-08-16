import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColorPickerDialogComponent } from './components/color-picker-dialog/color-picker-dialog.component';
import { StrokeSizeDialogComponent } from './components/stroke-size-dialog/stroke-size-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild('drawingCanvas') drawingCanvas: ElementRef;

  canvasEl: any;
  currentYear: string;
  isDrawing = false;
  pageX: number;
  pageY: number;

  lineWidth = 1;
  selectedColor = '#000000';
  isUsingEraser = false;

  @HostListener('window:resize', ['$event.target']) onWindowResize(event): void {
    this.canvasEl.width = event.innerWidth * 0.86;
    this.canvasEl.height = event.innerHeight * 0.7;
  }

  constructor(private dialog: MatDialog) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear().toString();
  }

  ngAfterViewInit(): void {
    this.canvasEl = this.drawingCanvas.nativeElement;
    this.canvasEl.width = window.innerWidth * 0.86;
    this.canvasEl.height = window.innerHeight * 0.7;
  }

  startDrawing(event: MouseEvent): void {
    this.isDrawing = true;
    const canvasPosition = this.canvasEl.getBoundingClientRect();

    this.pageX = event.pageX - canvasPosition.x;
    this.pageY = event.pageY - canvasPosition.y;
  }

  penMoved(event: MouseEvent): void {
    if (!this.isDrawing) {
      return;
    }

    const canvasPosition = this.canvasEl.getBoundingClientRect();
    const canvasCtx = this.canvasEl.getContext('2d');

    const currentPageX = event.pageX - canvasPosition.x;
    const currentPageY = event.pageY - canvasPosition.y;

    canvasCtx.beginPath();
    canvasCtx.lineWidth = this.lineWidth;
    canvasCtx.lineJoin = 'round';

    if (!this.isUsingEraser) {
      canvasCtx.globalCompositeOperation = 'source-over';
      canvasCtx.moveTo(this.pageX, this.pageY);
      canvasCtx.lineTo(currentPageX, currentPageY);
      canvasCtx.strokeStyle = this.selectedColor;
      canvasCtx.stroke();
    } else {
      canvasCtx.globalCompositeOperation = 'destination-out';
      canvasCtx.arc(this.pageX, this.pageY, 8, 0, Math.PI * 2, false);
      canvasCtx.fill();
    }

    canvasCtx.closePath();

    this.pageY = currentPageY;
    this.pageX = currentPageX;
  }

  endDrawing(event: MouseEvent): void {
    this.isDrawing = false;
  }

  openColorPickerDialog(): void {
    const dialogRef = this.dialog.open(ColorPickerDialogComponent, {
      data: { selectedColor: this.selectedColor },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => (this.selectedColor = result ? result : this.selectedColor));
  }

  openStrokeSizeDialog(): void {
    const dialogRef = this.dialog.open(StrokeSizeDialogComponent, {
      data: { strokeSize: this.lineWidth },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => (this.lineWidth = result ? result : this.lineWidth));
  }

  clearCanvas(): void {
    const canvasCtx = this.canvasEl.getContext('2d');
    canvasCtx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
  }

  useBrush(): void {
    this.isUsingEraser = false;
  }

  useEraser(): void {
    this.isUsingEraser = true;
  }
}
