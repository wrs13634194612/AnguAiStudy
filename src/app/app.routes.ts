import { Routes } from '@angular/router';
import { HomeComponent} from './home/home.component';
import { UserComponent} from './user/user.component';
import { SettingComponent } from './setting/setting.component';
import { CalculatorComponent } from './calculator/calculator.component';

import { CalnumComponent } from './calnum/calnum.component';
import { CalendarComponent } from './calendar/calendar.component';

import { LoginComponent } from './login/login.component';
import {CanvasComponent} from './canvas/canvas.component';
import {SchulteComponent} from './schulte/schulte.component';
import {SnakeComponent} from './snake/snake.component';
import {BannerComponent} from './banner/banner.component';
import {ContactComponent} from './contact/contact.component';
import {StudentComponent} from './student/student.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'set',
    component: SettingComponent,
  },
  {
    path: 'calculator',
    component: CalculatorComponent,
  },
  {
    path: 'calnum',
    component: CalnumComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'canvas',
    component: CanvasComponent,
  },
  {
    path: 'schulte',
    component: SchulteComponent,
  },
  {
    path: 'snake',
    component: SnakeComponent,
  },
  {
    path: 'banner',
    component: BannerComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'student',
    component: StudentComponent,
  },
  {
    path: 'user',
    component: UserComponent
  }
];


