import { Injectable } from '@angular/core';  // ‌:ml-citation{ref="1,2" data="citationList"}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private validUsers = [
    { role: 'student', username: 'stu', password: '123456' },
    { role: 'teacher', username: 'tea', password: '123456' },
    { role: 'admin', username: 'admin', password: '123456' }
  ];  // ‌:ml-citation{ref="4,7" data="citationList"}

  authenticate(role: string, username: string, password: string): boolean {
    const isValid = this.validUsers.some(user =>
      user.role === role &&
      user.username === username &&
      user.password === password
    );
    console.log(`认证${isValid ? '成功' : '失败'}`, { role, username });  // ‌:ml-citation{ref="4,7" data="citationList"}
    return isValid;
  }
}
