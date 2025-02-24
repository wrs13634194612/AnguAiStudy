import { Routes } from '@angular/router';
import { HomeComponent} from './home/home.component';
import { UserComponent} from './user/user.component';
import { SettingComponent } from './setting/setting.component';


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
    path: 'user',
    component: UserComponent
  }
];


