import { Routes } from '@angular/router';

export const tenantRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/tenant-list/tenant-list.component').then(m => m.TenantListComponent),
  },
];
