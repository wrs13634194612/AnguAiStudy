import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-tiktok',
  imports: [
    FormsModule,CommonModule
  ],
  templateUrl: './tiktok.component.html',
  styleUrl: './tiktok.component.css'
})
export class TiktokComponent {
  roles = ['student', 'teacher', 'admin'];  // ‌:ml-citation{ref="3" data="citationList"}
  selectedRole = 'student';
  username = '';
  password = '';

  constructor(private authService: AuthService) {}  // ‌:ml-citation{ref="2" data="citationList"}

  onSubmit() {
    const isAuthenticated = this.authService.authenticate(
      this.selectedRole,
      this.username,
      this.password
    );
    console.log(isAuthenticated ? '登录成功' : '登录失败');  // ‌:ml-citation{ref="4" data="citationList"}
  }
}
