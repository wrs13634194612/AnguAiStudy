import { Component ,OnDestroy,OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-schulte',
  imports: [NgForOf, NgIf],
  templateUrl: './schulte.component.html',
  styleUrl: './schulte.component.css'
})
export class SchulteComponent  implements OnDestroy,OnInit{

  gridSize = 4;
  numbers: number[] = [];
  currentNumber = 1;
  timeUsed = 0;
  isStarted = false;
  private timer: number | undefined;
  gridStyle = {};

  ngOnInit() {
    this.initializeGame();
    this.updateGridStyle();
  }

  private initializeGame() {
    const size =this.gridSize ** 2;
    this.numbers = Array.from({ length: size }, (_, i) => i + 1);

    // Fisher-Yates shuffle
    for (let i = this.numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.numbers[i], this.numbers[j]] = [this.numbers[j], this.numbers[i]];
    }
  }

  updateGridStyle() {
    const cellSizePercentage = 100 / this.gridSize;
    const fontSize = Math.min(4 / this.gridSize, 1.2);

    this.gridStyle = {
      'gridTemplateColumns': `repeat(${this.gridSize}, 1fr)`,
      'fontSize': `${fontSize}rem`
    };
  }

  startGame() {
    this.clearTimer();
    this.isStarted = true;
    this.currentNumber = 1;
    this.timeUsed = 0;

    this.timer = window.setInterval(() => {
      this.timeUsed++;
    }, 1000);
  }

  handleClick(num: number) {
    if (!this.isStarted) return;

    if (num === this.currentNumber) {
      this.currentNumber++;
      if (this.currentNumber > this.gridSize ** 2) {
        this.gameComplete();
      }
    } else {
      this.handleError();
    }
  }

  private gameComplete() {
    this.clearTimer();
    alert(`🎉 完成时间: ${this.timeUsed}秒`);
    this.isStarted = false;
    this.initializeGame();
  }

  private handleError() {
    this.clearTimer();
    this.isStarted = false;
    alert('❌ 点错数字，重新开始!');
    this.initializeGame();
  }

  private clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }


}
