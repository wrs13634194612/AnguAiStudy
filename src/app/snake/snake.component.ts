import { Component , OnInit, OnDestroy, HostListener } from '@angular/core';


interface Position {
  x: number;
  y: number;
}

@Component({
  selector: 'app-snake',
  imports: [],
  templateUrl: './snake.component.html',
  styleUrl: './snake.component.css'
})
export class SnakeComponent implements OnInit, OnDestroy{
  private ctx!: CanvasRenderingContext2D;
  private gameLoop!: any;
  private gridSize = 20;

  snake: Position[] = [{ x: 10, y: 10 }];
  food: Position = this.generateFood();
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'RIGHT';
  score = 0;
  gameSpeed = 150;
  isPaused = false;

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    this.handleDirection(event.key.replace('Arrow', '').toUpperCase());
  }

  ngOnInit() {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d')!;
    this.startGame();
  }

  ngOnDestroy() {
    clearInterval(this.gameLoop);
  }

  handleDirection(newDirection: string) {
    const validMoves: Record<string, boolean> = {
      'UP': this.direction !== 'DOWN',
      'DOWN': this.direction !== 'UP',
      'LEFT': this.direction !== 'RIGHT',
      'RIGHT': this.direction !== 'LEFT'
    };

    if (validMoves[newDirection]) {
      this.direction = newDirection as any;
    }
  }

  private startGame() {
    this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
  }

  private update() {
    if (this.isPaused) return;

    const head = { ...this.snake[0] };
    switch (this.direction) {
      case 'UP': head.y--; break;
      case 'DOWN': head.y++; break;
      case 'LEFT': head.x--; break;
      case 'RIGHT': head.x++; break;
    }

    if (this.checkCollision(head)) {
      clearInterval(this.gameLoop);
      alert(`游戏结束! 得分: ${this.score}`);
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.food = this.generateFood();
      this.gameSpeed = Math.max(50, this.gameSpeed - 2);
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  private draw() {
    // 游戏区域背景
    this.ctx.fillStyle = '#1a1b26';
    this.ctx.fillRect(0, 0, 400, 400);

    // 食物绘制
    this.ctx.fillStyle = '#f7768e';
    this.ctx.beginPath();
    this.ctx.roundRect(
      this.food.x * this.gridSize + 2,
      this.food.y * this.gridSize + 2,
      this.gridSize - 4,
      this.gridSize - 4,
      4
    );
    this.ctx.fill();

    // 蛇身绘制
    this.snake.forEach((segment, index) => {
      this.ctx.fillStyle = index === 0 ? '#9ece6a' : '#73daca';
      this.ctx.beginPath();
      this.ctx.roundRect(
        segment.x * this.gridSize + 2,
        segment.y * this.gridSize + 2,
        this.gridSize - 4,
        this.gridSize - 4,
        index === 0 ? 6 : 4
      );
      this.ctx.fill();
    });
  }

  private generateFood(): Position {
    return {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20)
    };
  }

  private checkCollision(pos: Position): boolean {
    return pos.x < 0 || pos.x >= 20 || pos.y < 0 || pos.y >= 20 ||
      this.snake.some(segment => segment.x === pos.x && segment.y === pos.y);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  resetGame() {
    this.snake = [{ x: 10, y: 10 }];
    this.direction = 'RIGHT';
    this.score = 0;
    this.gameSpeed = 150;
    this.food = this.generateFood();
    this.isPaused = false;
    clearInterval(this.gameLoop);
    this.startGame();
  }
}
