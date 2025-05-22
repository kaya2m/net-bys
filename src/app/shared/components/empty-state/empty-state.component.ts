import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';

export type EmptyStateType = 'no-data' | 'no-results' | 'error' | 'maintenance' | 'access-denied' | 'offline' | 'custom';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
 templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Input() type: EmptyStateType = 'no-data';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() hasCustomContent: boolean = false;
  @Input() showActions: boolean = true;
  @Input() showRefresh: boolean = false;
  @Input() refreshLoading: boolean = false;

  @Input() primaryAction?: {
    label: string;
    icon?: string;
    styleClass?: string;
    loading?: boolean;
  };

  @Input() secondaryAction?: {
    label: string;
    icon?: string;
    styleClass?: string;
    loading?: boolean;
  };

  @Input() footerLinks?: {
    label: string;
    url?: string;
    route?: string;
    external?: boolean;
  }[];

  @Output() primaryActionClick = new EventEmitter<void>();
  @Output() secondaryActionClick = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  getDefaultIcon(): string {
    const icons = {
      'no-data': 'pi pi-inbox',
      'no-results': 'pi pi-search',
      'error': 'pi pi-exclamation-triangle',
      'maintenance': 'pi pi-wrench',
      'access-denied': 'pi pi-lock',
      'offline': 'pi pi-wifi-off',
      'custom': 'pi pi-info-circle'
    };
    return icons[this.type] || icons.custom;
  }

  getDefaultTitle(): string {
    const titles = {
      'no-data': 'Veri Bulunamadı',
      'no-results': 'Sonuç Bulunamadı',
      'error': 'Bir Hata Oluştu',
      'maintenance': 'Bakım Modu',
      'access-denied': 'Erişim Reddedildi',
      'offline': 'Bağlantı Yok',
      'custom': 'Bilgi'
    };
    return titles[this.type] || titles.custom;
  }

  getDefaultDescription(): string {
    const descriptions = {
      'no-data': 'Henüz kayıtlı veri bulunmuyor. İlk kaydı oluşturmak için başlayın.',
      'no-results': 'Arama kriterlerinize uygun sonuç bulunamadı. Farklı anahtar kelimeler deneyin.',
      'error': 'Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.',
      'maintenance': 'Sistem geçici olarak bakımda. Lütfen daha sonra tekrar deneyin.',
      'access-denied': 'Bu sayfaya erişim yetkiniz bulunmamaktadır.',
      'offline': 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
      'custom': ''
    };
    return descriptions[this.type] || descriptions.custom;
  }

  onPrimaryAction() {
    this.primaryActionClick.emit();
  }

  onSecondaryAction() {
    this.secondaryActionClick.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }
}
