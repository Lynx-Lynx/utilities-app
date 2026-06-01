import { Routes } from '@angular/router';
import { Current } from './features/current/current';
import { History } from './features/history/history';
import { Settings } from './features/settings/settings';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/login/login';
import { Layout } from './core/layout/layout';

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
