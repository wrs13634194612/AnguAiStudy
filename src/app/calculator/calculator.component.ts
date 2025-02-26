import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';

interface LoanResult {
  monthlyPayment?: number;
  firstMonthPayment?: number; // 等额本金首月还款
  monthlyDecrease?: number;   // 每月递减金额
  totalPayment: number;
  totalInterest: number;
}

interface Installment {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  remaining: number;
}

@Component({
  selector: 'app-calculator',
  imports: [
    FormsModule,
    CurrencyPipe,
    NgIf,
    NgFor
  ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  // 新增还款方式选择
  repaymentMethod: 'equal-installment' | 'equal-principal' = 'equal-installment';

  // 新增还款计划明细
  installments: Installment[] = [];

  // 原有属性保持不变
  loanType: 'commercial' | 'fund' = 'commercial';
  loanAmount = 100;
  loanYears = 20;
  customRate?: number;
  useCustomRate = false;
  result?: LoanResult;

  private get defaultRate() {
    const isShortTerm = this.loanYears <= 5;
    return this.loanType === 'commercial'
      ? (isShortTerm ? 4.75 : 4.90)
      : (isShortTerm ? 2.75 : 3.25);
  }

  updateRate() {
    if (!this.useCustomRate) {
      this.customRate = this.defaultRate;
    }
  }

  toggleRate() {
    this.useCustomRate = !this.useCustomRate;
    if (!this.useCustomRate) this.customRate = this.defaultRate;
  }

  calculate() {
    if (this.repaymentMethod === 'equal-installment') {
      this.calculateEqualInstallment();
    } else {
      this.calculateEqualPrincipal();
    }
  }

  private calculateEqualInstallment() {
    const rate = (this.customRate ?? this.defaultRate) / 100;
    const months = this.loanYears * 12;
    const monthlyRate = rate / 12;
    const principal = this.loanAmount * 10000;

    const factor = Math.pow(1 + monthlyRate, months);
    const monthlyPayment = principal * monthlyRate * factor / (factor - 1);

    this.result = {
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      totalPayment: Number((monthlyPayment * months).toFixed(2)),
      totalInterest: Number((monthlyPayment * months - principal).toFixed(2))
    };

    this.generateInstallmentPlan(principal, monthlyRate, monthlyPayment);
  }

  private calculateEqualPrincipal() {
    const rate = (this.customRate ?? this.defaultRate) / 100;
    const months = this.loanYears * 12;
    const monthlyRate = rate / 12;
    const principal = this.loanAmount * 10000;

    // 每月偿还本金
    const monthlyPrincipal = principal / months;
    let remaining = principal;
    let totalInterest = 0;
    const installments: Installment[] = [];

    for (let i = 1; i <= months; i++) {
      const interest = remaining * monthlyRate;
      const payment = monthlyPrincipal + interest;
      remaining -= monthlyPrincipal;
      totalInterest += interest;

      installments.push({
        period: i,
        payment: Number(payment.toFixed(2)),
        principal: Number(monthlyPrincipal.toFixed(2)),
        interest: Number(interest.toFixed(2)),
        remaining: Number(remaining > 0 ? remaining.toFixed(2) : 0)
      });
    }

    this.result = {
      firstMonthPayment: installments[0].payment,
      monthlyDecrease: Number((installments[0].payment - installments[1].payment).toFixed(2)),
      totalPayment: Number((principal + totalInterest).toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2))
    };

    this.installments = installments;
  }

  private generateInstallmentPlan(principal: number, monthlyRate: number, monthlyPayment: number) {
    let remaining = principal;
    const installments: Installment[] = [];

    for (let i = 1; i <= this.loanYears * 12; i++) {
      const interest = remaining * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      remaining -= principalPaid;

      installments.push({
        period: i,
        payment: Number(monthlyPayment.toFixed(2)),
        principal: Number(principalPaid.toFixed(2)),
        interest: Number(interest.toFixed(2)),
        remaining: Number(remaining > 0 ? remaining.toFixed(2) : 0)
      });
    }

    this.installments = installments;
  }
}
