import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;
  isLoading = false;
  showScrollTop = false;
  isMobile = false;

  constructor(private authService: AuthService) {
    this.checkMobile();
    this.loadUserPreferences();
  }

  ngOnInit() {
    // Subscribe to loading state
    this.authService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    // Listen to scroll events
    this.onScroll();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkMobile();

    // Auto collapse sidebar on mobile
    if (this.isMobile && !this.isSidebarCollapsed) {
      this.isSidebarCollapsed = true;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Show scroll to top button after scrolling 300px
    this.showScrollTop = window.pageYOffset > 300;
  }

  onSidebarCollapsedChange(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
    this.saveUserPreferences();
  }

  onMobileSidebarOpenChange(open: boolean) {
    this.isMobileSidebarOpen = open;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  private checkMobile() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    // If changed from mobile to desktop, close mobile sidebar
    if (wasMobile && !this.isMobile) {
      this.isMobileSidebarOpen = false;
    }

    // If changed from desktop to mobile, collapse sidebar
    if (!wasMobile && this.isMobile) {
      this.isSidebarCollapsed = true;
    }
  }

  private loadUserPreferences() {
    // Load user's sidebar preference from localStorage
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsed !== null) {
      this.isSidebarCollapsed = JSON.parse(savedCollapsed);
    }

    // Auto-collapse on mobile
    if (this.isMobile) {
      this.isSidebarCollapsed = true;
    }
  }

  private saveUserPreferences() {
    // Save user's sidebar preference
    localStorage.setItem('sidebar-collapsed', JSON.stringify(this.isSidebarCollapsed));
  }
}
