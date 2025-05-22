import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { TenantListComponent } from './pages/tenant-list/tenant-list.component';
import { TenantDetailComponent } from './pages/tenant-detail/tenant-detail.component';
import { TenantFormComponent } from './pages/tenant-form/tenant-form.component';

export const TENANT_YONETIMI_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: TenantListComponent
      },
      {
        path: 'yeni',
        component: TenantFormComponent
      },
      {
        path: 'duzenle/:id',
        component: TenantFormComponent
      },
      {
        path: ':id',
        component: TenantDetailComponent
      }
    ]
  }
];
