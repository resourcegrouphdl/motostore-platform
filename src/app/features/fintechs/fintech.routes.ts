import { Routes } from '@angular/router';

export const fintechRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./fintech-registry.component').then(m => m.FintechRegistryComponent),
  },
];
