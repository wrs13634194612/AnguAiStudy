import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from './alert-dialog.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  constructor(private dialog: MatDialog) {}

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    if (username === 'admin' && password === '123456') {
      this.showAlert('登录成功', 'success');
      this.loginForm.reset();
    } else {
      this.showAlert('用户名或密码错误', 'error');
    }
  }

  private showAlert(message: string, type: 'success' | 'error') {
    this.dialog.open(AlertDialogComponent, {
      data: { message, type },
      width: '300px'
    });
  }
}
