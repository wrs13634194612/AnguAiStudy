// src/app/springboot.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import {NgForOf} from '@angular/common';
import { UserService } from './user.service';

@Component({
  selector: 'app-springboot',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './springboot.component.html',
  styleUrls: ['./springboot.component.css']
})
export class SpringbootComponent implements OnInit {
  users: any[] = [];
  isLoading = false;
  error: string = '';
  selectedUser: any = {};
  isEditMode: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.isLoading = false;
      },
      (err) => {
        this.error = '加载用户失败';
        this.isLoading = false;
      }
    );
  }

  // 添加/修改用户
  submitForm(userForm: NgForm): void {
    if (userForm.invalid) return;

    if (this.isEditMode) {
      this.updateUser(this.selectedUser.id, this.selectedUser);
    } else {
      this.createUser(this.selectedUser);
    }

    // 重置表单和状态
    userForm.reset();
    this.selectedUser = {};
    this.isEditMode = false;
  }

  // 创建新用户
  createUser(user: any): void {
    this.userService.createUser(user).subscribe(
      (newUser) => {
        this.users.push(newUser);
      },
      (err) => {
        this.error = '创建用户失败';
      }
    );
  }

  // 编辑用户
  editUser(id: number): void {
    this.userService.getUserById(id).subscribe(
      (user) => {
        this.selectedUser = user;
        this.isEditMode = true;
      },
      (err) => {
        this.error = '加载用户失败';
      }
    );
  }

  // 更新用户
  updateUser(id: number, user: any): void {
    this.userService.updateUser(id, user).subscribe(() => {
      // 替换原用户数据
      this.users = this.users.map(u =>
        u.id === id ? { ...u, name: user.name, email: user.email, age: user.age } : u
      );
    });
  }

  // 删除用户
  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(u => u.id !== id);
    });
  }

  // 重置表单
  resetForm(): void {
    this.selectedUser = {};
    this.isEditMode = false;
  }
}
