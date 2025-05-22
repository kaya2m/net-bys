import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { SiteListComponent } from './pages/site-list/site-list.component';
import { SiteDetailComponent } from './pages/site-detail/site-detail.component';
import { SiteFormComponent } from './pages/site-form/site-form.component';
import { BlokListComponent } from './components/blok-list/blok-list.component';
import { DaireListComponent } from './components/daire-list/daire-list.component';

export const SITE_YONETIMI_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: SiteListComponent
      },
      {
        path: 'yeni',
        component: SiteFormComponent
      },
      {
        path: 'duzenle/:id',
        component: SiteFormComponent
      },
      {
        path: ':id',
        component: SiteDetailComponent
      },
      {
        path: ':siteId/bloklar',
        component: BlokListComponent
      },
      // {
      //   path: ':siteId/bloklar/yeni',
      //   component: BlokFormComponent
      // },
      // {
      //   path: ':siteId/bloklar/:blokId',
      //   component: BlokFormComponent
      // },
      {
        path: ':siteId/daireler',
        component: DaireListComponent
      },
      // {
      //   path: ':siteId/daireler/yeni',
      //   component: DaireFormComponent
      // },
      // {
      //   path: ':siteId/daireler/:daireId',
      //   component: DaireFormComponent
      // },
      // {
      //   path: ':siteId/sakinler',
      //   component: SakinListComponent
      // },
      // {
      //   path: ':siteId/sakinler/yeni',
      //   component: SakinFormComponent
      // },
      // {
      //   path: ':siteId/sakinler/:sakinId',
      //   component: SakinFormComponent
      // }
    ]
  }
];
