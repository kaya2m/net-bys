import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { User } from '../../../core/interfaces/Auth/User';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-header',
  standalone: true,
   imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    MenuModule,
    OverlayPanelModule,
    AvatarModule,
    BadgeModule,
    InputTextModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  pageTitle = 'Dashboard';
  breadcrumb = '';
  searchQuery = '';
  notificationCount = 0;
  isFullscreen = false;

  notifications: any[] = [];
  quickActions: any[] = [];
  userMenuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeQuickActions();
    this.initializeUserMenu();
  }

  ngOnInit() {
    // Subscribe to current user
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    // Load notifications
    this.loadNotifications();

    // Listen for route changes to update title
    this.updatePageTitle();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    // Emit event to parent layout component
    const event = new CustomEvent('toggleSidebar');
    window.dispatchEvent(event);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery }
      });
    }
  }

  toggleNotifications(event: Event) {
    // This will be handled by the overlay panel
  }

  toggleQuickActions(event: Event) {
    // This will be handled by the overlay panel
  }

  toggleUserMenu(event: Event) {
    // This will be handled by the overlay panel
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.isFullscreen = true;
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  getUserInitials(): string {
    if (this.currentUser?.fullName) {
      return this.currentUser.fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'U';
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
    this.notificationCount = 0;
  }

  executeQuickAction(action: any) {
    if (action.route) {
      this.router.navigate([action.route]);
    } else if (action.action) {
      action.action();
    }
  }

  logout() {
    this.authService.logout();
  }

  private initializeQuickActions() {
    this.quickActions = [
      {
        label: 'Yeni Duyuru',
        icon: 'pi pi-megaphone',
        route: '/iletisim-yonetimi/duyurular/yeni'
      },
      {
        label: 'Yeni Talep',
        icon: 'pi pi-ticket',
        route: '/iletisim-yonetimi/talepler/yeni'
      },
      {
        label: 'Aidat Ekle',
        icon: 'pi pi-money-bill',
        route: '/finansal-yonetim/aidatlar/yeni'
      },
      {
        label: 'Gider Ekle',
        icon: 'pi pi-minus-circle',
        route: '/finansal-yonetim/giderler/yeni'
      },
      {
        label: 'Daire Ekle',
        icon: 'pi pi-home',
        route: '/site-yonetimi/daireler/yeni'
      }
    ];
  }

  private initializeUserMenu() {
    this.userMenuItems = [
      {
        label: 'Profil',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/profil'])
      },
      {
        label: 'Ayarlar',
        icon: 'pi pi-cog',
        command: () => this.router.navigate(['/ayarlar'])
      },
      {
        separator: true
      },
      {
        label: 'Tema',
        icon: 'pi pi-palette',
        items: [
          {
            label: 'Açık Tema',
            icon: 'pi pi-sun',
            command: () => this.changeTheme('light')
          },
          {
            label: 'Koyu Tema',
            icon: 'pi pi-moon',
            command: () => this.changeTheme('dark')
          }
        ]
      },
      {
        separator: true
      },
      {
        label: 'Yardım',
        icon: 'pi pi-question-circle',
        command: () => this.router.navigate(['/yardim'])
      },
      {
        label: 'Geri Bildirim',
        icon: 'pi pi-comment',
        command: () => this.router.navigate(['/geri-bildirim'])
      }
    ];
  }

  private loadNotifications() {
    // Simulate notifications - replace with actual service call
    this.notifications = [
      {
        id: 1,
        title: 'Yeni Aidat Bildirimi',
        message: 'Mart ayı aidatları yayınlandı',
        time: '2 dakika önce',
        icon: 'pi pi-money-bill',
        color: '#10b981',
        isRead: false
      },
      {
        id: 2,
        title: 'Bakım Bildirimi',
        message: 'Asansör bakımı 10.03.2024 tarihinde yapılacak',
        time: '1 saat önce',
        icon: 'pi pi-wrench',
        color: '#f59e0b',
        isRead: false
      },
      {
        id: 3,
        title: 'Genel Kurul',
        message: 'Genel kurul toplantısı 15.03.2024 tarihinde',
        time: '3 saat önce',
        icon: 'pi pi-users',
        color: '#3b82f6',
        isRead: true
      }
    ];

    this.notificationCount = this.notifications.filter(n => !n.isRead).length;
  }

  private updatePageTitle() {
    // Get current route and set title accordingly
    const currentRoute = this.router.url;

    const routeTitles: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/tenant-yonetimi': 'Tenant Yönetimi',
      '/site-yonetimi': 'Site Yönetimi',
      '/finansal-yonetim': 'Finansal Yönetim',
      '/iletisim-yonetimi': 'İletişim Yönetimi'
    };

    for (const route in routeTitles) {
      if (currentRoute.startsWith(route)) {
        this.pageTitle = routeTitles[route];
        break;
      }
    }
  }

  private changeTheme(theme: string) {
    // Theme change logic - you can implement this
    console.log('Changing theme to:', theme);
  }
}
