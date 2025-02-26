import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatabaseService } from './data.service';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { Task } from './task.model';// 从统一定义文件导入

@Component({
  selector: 'app-task',
  imports: [FormsModule, NgForOf],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})

export class StudentComponent  implements OnInit {
  tasks: Task[] = [];
  newTask: Omit<Task, 'id'> = {
    title: '',
    status: 'pending'
  };

  constructor(
    private db: DatabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    // 添加类型断言确保数据一致性
    this.tasks = await this.db.getAllTasks() as Task[];
    this.cdr.detectChanges();
  }

  async addTask() {
    if (this.newTask.title.trim()) {
      // 类型安全传递
      await this.db.addTask(this.newTask);
      this.newTask = { title: '', status: 'pending' };
      await this.loadTasks();
    }
  }

  async updateTask(task: Task) {
    // 添加空值检查
    if (task.id === undefined) return;

    await this.db.updateTask(task);
    await this.loadTasks();
  }

  async deleteTask(id: number) {
    await this.db.deleteTask(id);
    await this.loadTasks();
  }
}
