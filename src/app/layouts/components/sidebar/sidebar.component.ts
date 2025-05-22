import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { User } from '../../../core/interfaces/Auth/User';
import { AuthService } from '../../../core/services/auth.service';
import { MenuItem } from '../../../core/interfaces/Layout/MenuItem';

// Services

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ CommonModule,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    TooltipModule,
    BadgeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isCollapsed = false;
  @Input() isMobileOpen = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() mobileOpenChange = new EventEmitter<boolean>();

  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  isMobile = false;
  menuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.checkMobile();
    this.initializeMenu();
  }

  ngOnInit() {
    // Subscribe to current user
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.updateMenuBasedOnRole();
      });

    // Listen to route changes to update active states
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateActiveStates();
      });

    // Listen to window resize
    window.addEventListener('resize', () => this.checkMobile());

    // Listen to sidebar toggle events
    window.addEventListener('toggleSidebar', () => {
      if (this.isMobile) {
        this.toggleMobile();
      } else {
        this.toggleCollapse();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', () => this.checkMobile());
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);

    // Close all expanded submenus when collapsing
    if (this.isCollapsed) {
      this.menuItems.forEach(item => item.isExpanded = false);
    }
  }

  toggleMobile() {
    this.isMobileOpen = !this.isMobileOpen;
    this.mobileOpenChange.emit(this.isMobileOpen);
  }

  closeMobile() {
    this.isMobileOpen = false;
    this.mobileOpenChange.emit(false);
  }

  toggleSubmenu(item: MenuItem) {
    if (this.isCollapsed) return;

    item.isExpanded = !item.isExpanded;

    // Close other expanded items (accordion behavior)
    this.menuItems.forEach(menuItem => {
      if (menuItem !== item) {
        menuItem.isExpanded = false;
      }
    });
  }

  onMenuClick(item: MenuItem) {
    if (this.isMobile) {
      this.closeMobile();
    }
  }

  goToSettings() {
    this.router.navigate(['/ayarlar']);
  }

  logout() {
    this.authService.logout();
  }

  private checkMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: '/dashboard'
      },
      {
        label: 'Tenant Yönetimi',
        icon: 'pi pi-building',
        roles: ['Admin'],
        children: [
          {
            label: 'Tenant Listesi',
            icon: 'pi pi-list',
            route: '/tenant-yonetimi'
          },
          {
            label: 'Yeni Tenant',
            icon: 'pi pi-plus',
            route: '/tenant-yonetimi/yeni'
          }
        ]
      },
      {
        label: 'Site Yönetimi',
        icon: 'pi pi-building',
        roles: ['Admin', 'SiteYoneticisi'],
        children: [
          {
            label: 'Site Listesi',
            icon: 'pi pi-list',
            route: '/site-yonetimi'
          },
          {
            label: 'Daire Yönetimi',
            icon: 'pi pi-home',
            route: '/site-yonetimi/daireler'
          },
          {
            label: 'Blok Yönetimi',
            icon: 'pi pi-th-large',
            route: '/site-yonetimi/bloklar'
          }
        ]
      },
      {
        label: 'Finansal Yönetim',
        icon: 'pi pi-money-bill',
        roles: ['Admin', 'SiteYoneticisi', 'Muhasebeci'],
        children: [
          {
            label: 'Aidat Yönetimi',
            icon: 'pi pi-credit-card',
            route: '/finansal-yonetim/aidatlar',
            badge: '3',
            badgeClass: 'p-badge-warning'
          },
          {
            label: 'Gider Yönetimi',
            icon: 'pi pi-minus-circle',
            route: '/finansal-yonetim/giderler'
          },
          {
            label: 'Ödeme Yönetimi',
            icon: 'pi pi-wallet',
            route: '/finansal-yonetim/odemeler'
          },
          {
            label: 'Raporlar',
            icon: 'pi pi-chart-bar',
            route: '/finansal-yonetim/raporlar'
          }
        ]
      },
      {
        label: 'İletişim Yönetimi',
        icon: 'pi pi-comments',
        children: [
          {
            label: 'Duyurular',
            icon: 'pi pi-megaphone',
            route: '/iletisim-yonetimi/duyurular'
          },
          {
            label: 'Talepler',
            icon: 'pi pi-ticket',
            route: '/iletisim-yonetimi/talepler',
            badge: '5',
            badgeClass: 'p-badge-danger'
          },
          {
            label: 'Bildirimler',
            icon: 'pi pi-bell',
            route: '/iletisim-yonetimi/bildirimler'
          }
        ]
      },
      {
        label: 'Raporlar',
        icon: 'pi pi-chart-line',
        roles: ['Admin', 'SiteYoneticisi', 'Muhasebeci'],
        route: '/raporlar'
      },
      {
        label: 'Ayarlar',
        icon: 'pi pi-cog',
        children: [
          {
            label: 'Profil',
            icon: 'pi pi-user',
            route: '/ayarlar/profil'
          },
          {
            label: 'Sistem Ayarları',
            icon: 'pi pi-sliders-h',
            route: '/ayarlar/sistem',
            roles: ['Admin']
          },
          {
            label: 'Tema',
            icon: 'pi pi-palette',
            route: '/ayarlar/tema'
          }
        ]
      }
    ];
  }

  private updateMenuBasedOnRole() {
    if (!this.currentUser) return;

    this.menuItems = this.menuItems.filter(item => {
      // Check if user has required role
      if (item.roles && item.roles.length > 0) {
        const hasRole = item.roles.includes(this.currentUser!.rolAdi);
        if (!hasRole) return false;
      }

      // Filter children based on roles
      if (item.children) {
        item.children = item.children.filter(child => {
          if (child.roles && child.roles.length > 0) {
            return child.roles.includes(this.currentUser!.rolAdi);
          }
          return true;
        });
      }

      return true;
    });
  }

  private updateActiveStates() {
    const currentUrl = this.router.url;

    this.menuItems.forEach(item => {
      // Reset states
      item.isActive = false;
      item.isExpanded = false;

      // Check if current item matches
      if (item.route && currentUrl.startsWith(item.route)) {
        item.isActive = true;
      }

      // Check children
      if (item.children) {
        const activeChild = item.children.find(child =>
          child.route && currentUrl.startsWith(child.route)
        );

        if (activeChild) {
          item.isActive = true;
          item.isExpanded = !this.isCollapsed;
        }
      }
    });
  }
}
