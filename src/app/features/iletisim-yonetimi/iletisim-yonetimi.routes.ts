import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { DuyuruListComponent } from './pages/duyuru-list/duyuru-list.component';
import { TalepListComponent } from './pages/talep-list/talep-list.component';
import { BildirimListComponent } from './pages/bildirim-list/bildirim-list.component';
import { DuyuruFormComponent } from './components/duyuru-form/duyuru-form.component';
import { TalepFormComponent } from './components/talep-form/talep-form.component';

export const ILETISIM_YONETIMI_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'duyurular',
        pathMatch: 'full'
      },
      {
        path: 'duyurular',
        component: DuyuruListComponent
      },
      {
        path: 'duyurular/yeni',
        component: DuyuruFormComponent
      },
      {
        path: 'duyurular/:id',
        component: DuyuruFormComponent
      },
      {
        path: 'talepler',
        component: TalepListComponent
      },
      {
        path: 'talepler/yeni',
        component: TalepFormComponent
      },
      {
        path: 'talepler/:id',
        component: TalepListComponent
      },
      {
        path: 'bildirimler',
        component: BildirimListComponent
      }
    ]
  }
];
