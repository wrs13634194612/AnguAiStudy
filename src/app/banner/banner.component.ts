import { Component , Input, OnInit, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-banner',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
  animations: [
    trigger('slide', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition('* => void', [
        animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class BannerComponent implements OnInit, OnDestroy, OnChanges  {
  @Input() images: string[] = [];
  currentIndex = 0;
  autoPlayInterval: any;
  isDragging = false;
  startX = 0;
  threshold = 50;
  defaultImages = [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/men/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/men/4.jpg',
    'https://randomuser.me/api/portraits/men/5.jpg',
    'https://randomuser.me/api/portraits/men/6.jpg'
  ];

  ngOnInit() {
    this.initImages();
    this.startAutoPlay();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['images']) {
      this.initImages();
    }
  }

  private initImages() {
    if (this.images.length === 0) {
      this.images = [...this.defaultImages];
    }
  }

  ngOnDestroy() {
    clearInterval(this.autoPlayInterval);
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, 3000);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }

  pauseAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }

  resumeAutoPlay() {
    this.startAutoPlay();
  }

  onTouchStart(e: TouchEvent) {
    this.startX = e.touches[0].clientX;
    this.isDragging = true;
    this.pauseAutoPlay();
  }

  onTouchMove(e: TouchEvent) {
    if (!this.isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = this.startX - currentX;

    if (Math.abs(diff) > this.threshold) {
      diff > 0 ? this.next() : this.prev();
      this.isDragging = false;
    }
  }

  onTouchEnd() {
    this.isDragging = false;
    this.resumeAutoPlay();
  }

}
