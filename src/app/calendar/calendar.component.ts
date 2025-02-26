import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

interface CalendarDay {
  date: Date;
  isToday: boolean;
  isHoliday: boolean;
  events: string[];
  isWeekend: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  currentDate = signal(new Date());
  days = signal<CalendarDay[]>([]);
  darkMode = false;

  constructor(private dialog: MatDialog) {
    this.generateCalendar();
  }

  private generateCalendar() {
    const daysArray: CalendarDay[] = [];
    const year = this.currentDate().getFullYear();
    const month = this.currentDate().getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();

      daysArray.push({
        date,
        isToday: this.isSameDay(date, new Date()),
        isHoliday: this.checkHoliday(date),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        events: []
      });
    }
    this.days.set(daysArray);
  }

  changeMonth(offset: number) {
    this.currentDate.update(d => new Date(d.getFullYear(), d.getMonth() + offset, 1));
    this.generateCalendar();
  }

  addEvent(day: CalendarDay) {
    // 事件添加逻辑（示例）
    day.events.push('New Event');
    this.days.update(days => [...days]);
  }

  private isSameDay(d1: Date, d2: Date) {
    return d1.toDateString() === d2.toDateString();
  }

  private checkHoliday(date: Date) {
    const holidays = [
      '2024-01-01', '2024-05-01', '2024-10-01', // 示例节假日
      '2024-02-10', '2024-04-04', '2024-06-10'
    ];
    const dateString = date.toISOString().split('T')[0];
    return holidays.includes(dateString);
  }
}
