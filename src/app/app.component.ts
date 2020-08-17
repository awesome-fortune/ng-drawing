import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColorPickerDialogComponent } from './components/color-picker-dialog/color-picker-dialog.component';
import { StrokeSizeDialogComponent } from './components/stroke-size-dialog/stroke-size-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { colourPalette } from './models/colour-palette';

enum CanvasTools {
  Brush,
  Rectangle,
  Eraser,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild('drawingCanvas') drawingCanvas: ElementRef;
  @ViewChild('downLoadLink') downloadLink: ElementRef;

  canvasEl: HTMLCanvasElement;
  currentYear: string;
  isDrawing = false;
  pageX: number;
  pageY: number;

  lineWidth = 7;
  selectedColor = colourPalette[0].value;
  canvasTool: CanvasTools = CanvasTools.Brush;
  CanvasTools = CanvasTools;

  @HostListener('window:resize', ['$event.target']) onWindowResize(event): void {
    this.canvasEl.width = event.innerWidth * 0.86;
    this.canvasEl.height = event.innerHeight * 0.7;
  }

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

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
    canvasCtx.globalCompositeOperation = 'source-over';
    canvasCtx.lineWidth = this.lineWidth;
    canvasCtx.strokeStyle = this.selectedColor;

    switch (this.canvasTool) {
      case CanvasTools.Brush:
        this.useBrush(canvasCtx, currentPageX, currentPageY);
        break;
      case CanvasTools.Rectangle:
        this.useRectangle(canvasCtx, currentPageX, currentPageY);
        break;
      case CanvasTools.Eraser:
        this.useEraser(canvasCtx, currentPageX, currentPageY);
        break;
      default:
        throw new Error('Unsupported canvas tool!');
    }

    canvasCtx.closePath();
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Clear canvas', content: 'Would you like to clear the canvas?' },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          const canvasCtx = this.canvasEl.getContext('2d');
          canvasCtx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);

          this.snackBar.open('Successfully cleared canvas!', 'Dismiss', {
            duration: 3000,
          });
        }
      });
  }

  exportImage(): void {
    this.downloadLink.nativeElement.href = this.canvasEl.toDataURL();
    this.downloadLink.nativeElement.click();
  }

  setCanvasTool(canvasTool: CanvasTools): void {
    this.canvasTool = canvasTool;
  }

  useBrush(canvasCtx, currentPageX, currentPageY): void {
    canvasCtx.lineCap = 'round';
    canvasCtx.moveTo(this.pageX, this.pageY);
    canvasCtx.lineTo(currentPageX, currentPageY);
    canvasCtx.stroke();

    this.pageX = currentPageX;
    this.pageY = currentPageY;
  }

  useEraser(canvasCtx, currentPageX, currentPageY): void {
    canvasCtx.globalCompositeOperation = 'destination-out';
    canvasCtx.arc(this.pageX, this.pageY, this.lineWidth, 0, Math.PI * 2, false);
    canvasCtx.fill();

    this.pageX = currentPageX;
    this.pageY = currentPageY;
  }

  useRectangle(canvasCtx, currentPageX, currentPageY): void {
    const width = currentPageX - this.pageX;
    const height = currentPageY - this.pageY;
    canvasCtx.fillStyle = this.selectedColor;
    canvasCtx.fillRect(this.pageX, this.pageY, width, height);
  }
}
