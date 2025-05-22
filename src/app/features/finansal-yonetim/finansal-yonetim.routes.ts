import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { AidatListComponent } from './pages/aidat-list/aidat-list.component';
import { GiderListComponent } from './pages/gider-list/gider-list.component';
import { OdemeListComponent } from './pages/odeme-list/odeme-list.component';
import { GiderFormComponent } from './components/gider-form/gider-form.component';
import { AidatFormComponent } from './components/aidat-form/aidat-form.component';
import { OdemeFormComponent } from './components/odeme-form/odeme-form.component';

export const FINANSAL_YONETIM_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'aidatlar',
        pathMatch: 'full'
      },
      {
        path: 'aidatlar',
        component: AidatListComponent
      },
      {
        path: 'aidatlar/yeni',
        component: AidatFormComponent
      },
      {
        path: 'aidatlar/:id',
        component: AidatFormComponent
      },
      {
        path: 'giderler',
        component: GiderListComponent
      },
      {
        path: 'giderler/yeni',
        component: GiderFormComponent
      },
      {
        path: 'giderler/:id',
        component: GiderFormComponent
      },
      {
        path: 'odemeler',
        component: OdemeListComponent
      },
      {
        path: 'odemeler/yeni',
        component: OdemeFormComponent
      },
      {
        path: 'odemeler/:id',
        component: OdemeFormComponent
      },
      // {
      //   path: 'raporlar',
      //   component: FinansalRaporComponent
      // }
    ]
  }
];
