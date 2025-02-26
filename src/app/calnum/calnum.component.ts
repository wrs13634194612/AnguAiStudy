import { Component } from '@angular/core';

@Component({
  selector: 'app-calnum',
  imports: [],
  templateUrl: './calnum.component.html',
  styleUrl: './calnum.component.css'
})
export class CalnumComponent {

  mainDisplay = '0';
  subDisplay = '';
  currentValue = '';
  operator = '';
  firstOperand: number | null = null;

  handleInput(value: string): void {
    if (value === '.' && this.currentValue.includes('.')) return;

    this.currentValue = this.currentValue === '0' ? value : this.currentValue + value;
    this.mainDisplay = this.currentValue;
  }

  setOperator(op: string): void {
    if (this.currentValue === '') return;

    this.operator = op;
    this.firstOperand = parseFloat(this.currentValue);
    this.subDisplay = `${this.currentValue} ${op}`;
    this.currentValue = '';
  }

  calculate(): void {
    if (!this.firstOperand || !this.operator) return;

    const secondOperand = parseFloat(this.currentValue);
    let result: number;

    switch (this.operator) {
      case '+':
        result = this.firstOperand + secondOperand;
        break;
      case '-':
        result = this.firstOperand - secondOperand;
        break;
      case '×':
        result = this.firstOperand * secondOperand;
        break;
      case '÷':
        result = this.firstOperand / secondOperand;
        break;
      default:
        return;
    }

    this.mainDisplay = result.toString();
    this.subDisplay = `${this.firstOperand} ${this.operator} ${secondOperand} =`;
    this.currentValue = result.toString();
    this.firstOperand = null;
    this.operator = '';
  }

  clear(): void {
    this.mainDisplay = '0';
    this.subDisplay = '';
    this.currentValue = '';
    this.firstOperand = null;
    this.operator = '';
  }

}
