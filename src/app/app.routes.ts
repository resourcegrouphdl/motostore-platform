import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell/platform-shell.component').then(m => m.PlatformShellComponent),
    children: [
      { path: '', redirectTo: 'tenants', pathMatch: 'full' },
      {
        path: 'tenants',
        loadChildren: () =>
          import('./features/tenants/tenant.routes').then(m => m.tenantRoutes),
      },
      {
        path: 'health',
        loadComponent: () =>
          import('./features/health/system-status.component').then(m => m.SystemStatusComponent),
      },
      {
        path: 'fintechs',
        loadChildren: () =>
          import('./features/fintechs/fintech.routes').then(m => m.fintechRoutes),
      },
    ],
  },
  { path: '**', redirectTo: '/tenants' },
];
