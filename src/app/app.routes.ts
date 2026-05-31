import { Routes } from '@angular/router';
import { Current } from './components/current/current';
import { History } from './components/history/history';
import { Settings } from './components/settings/settings';
import { authGuard } from './guards/auth-guard';
import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'current',
      },
      {
        path: 'current',
        component: Current,
      },
      {
        path: 'history',
        component: History,
      },
      {
        path: 'settings',
        component: Settings,
      },
    ],
  },
];
