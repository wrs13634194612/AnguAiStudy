import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {NgForOf} from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-canvas',
  imports: [NgForOf,CommonModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements AfterViewInit  {



  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private lastY = 0;
  private initialImageData?: ImageData;

  tools = ['pencil', 'eraser', 'rectangle'];
  selectedTool = 'pencil';
  colors = ['#2c2c2c', '#e63946', '#457b9d', '#588157'];
  selectedColor = '#2c2c2c';
  lineWidth = 4;

  ngAfterViewInit() {
    this.initializeCanvas();
  }

  private initializeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.startX = this.lastX = event.clientX - rect.left;
    this.startY = this.lastY = event.clientY - rect.top;

    if (this.selectedTool === 'rectangle') {
      this.initialImageData = this.ctx.getImageData(0, 0,
        this.canvasRef.nativeElement.width,
        this.canvasRef.nativeElement.height
      );
    }

    if (this.selectedTool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.strokeStyle = 'rgba(0,0,0,1)';
    }
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.lineCap = 'round';

    if (this.selectedTool === 'pencil') {
      this.ctx.strokeStyle = this.selectedColor;
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(currentX, currentY);
      this.ctx.stroke();
      [this.lastX, this.lastY] = [currentX, currentY];
    }
    else if (this.selectedTool === 'eraser') {
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(currentX, currentY);
      this.ctx.stroke();
      [this.lastX, this.lastY] = [currentX, currentY];
    }
    else if (this.selectedTool === 'rectangle') {
      if (this.initialImageData) {
        this.ctx.putImageData(this.initialImageData, 0, 0);
      }
      this.ctx.strokeStyle = this.selectedColor;
      this.ctx.lineWidth = this.lineWidth;
      const width = currentX - this.startX;
      const height = currentY - this.startY;
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    }
  }

  stopDrawing() {
    this.isDrawing = false;
    if (this.selectedTool === 'eraser') {
      this.ctx.globalCompositeOperation = 'source-over';
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height
    );
    this.ctx.fillRect(0, 0,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height
    );
  }






}
