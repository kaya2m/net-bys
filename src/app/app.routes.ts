import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
    canActivate: [() => authGuard()],
  },
  {
    path: 'tenant-yonetimi',
    loadChildren: () =>
      import('./features/tenant-yonetimi/tenant-yonetimi.routes').then(
        (m) => m.TENANT_YONETIMI_ROUTES
      ),
    canActivate: [() => authGuard(['Admin'])],
  },
  {
    path: 'site-yonetimi',
    loadChildren: () =>
      import('./features/site-yonetimi/site-yonetimi.routes').then(
        (m) => m.SITE_YONETIMI_ROUTES
      ),
    canActivate: [() => authGuard(['Admin', 'SiteYoneticisi'])],
  },
  {
    path: 'finansal-yonetim',
    loadChildren: () =>
      import('./features/finansal-yonetim/finansal-yonetim.routes').then(
        (m) => m.FINANSAL_YONETIM_ROUTES
      ),
    canActivate: [() => authGuard(['Admin', 'SiteYoneticisi', 'Muhasebeci'])],
  },
  {
    path: 'iletisim-yonetimi',
    loadChildren: () =>
      import('./features/iletisim-yonetimi/iletisim-yonetimi.routes').then(
        (m) => m.ILETISIM_YONETIMI_ROUTES
      ),
    canActivate: [() => authGuard()],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },

];
