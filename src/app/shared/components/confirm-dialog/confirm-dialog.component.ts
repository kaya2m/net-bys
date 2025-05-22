import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  icon?: string;
  iconColor?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  showCancel?: boolean;
  danger?: boolean;
}

export type ConfirmDialogType = 'delete' | 'save' | 'warning' | 'info' | 'custom';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  @Input() visible: boolean = false;
  @Input() data: ConfirmDialogData = { message: '' };
  @Input() type: ConfirmDialogType = 'custom';
  @Input() width: string = '450px';
  @Input() closable: boolean = true;
  @Input() showIcon: boolean = true;
  @Input() loading: boolean = false;
  @Input() hasCustomContent: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() hide = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
    this.hide.emit();
  }

  getDefaultTitle(): string {
    const titles = {
      delete: 'Silme Onayı',
      save: 'Kaydetme Onayı',
      warning: 'Uyarı',
      info: 'Bilgi',
      custom: 'Onay'
    };
    return titles[this.type];
  }

  getDefaultIcon(): string {
    const icons = {
      delete: 'pi pi-trash',
      save: 'pi pi-save',
      warning: 'pi pi-exclamation-triangle',
      info: 'pi pi-info-circle',
      custom: 'pi pi-question-circle'
    };
    return icons[this.type];
  }

  getDefaultIconColor(): string {
    const colors = {
      delete: '#ef4444',
      save: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6',
      custom: '#6b7280'
    };
    return colors[this.type];
  }

  getDefaultConfirmText(): string {
    const texts = {
      delete: 'Sil',
      save: 'Kaydet',
      warning: 'Tamam',
      info: 'Tamam',
      custom: 'Onayla'
    };
    return texts[this.type];
  }

  getConfirmIcon(): string {
    const icons = {
      delete: 'pi pi-trash',
      save: 'pi pi-save',
      warning: 'pi pi-check',
      info: 'pi pi-check',
      custom: 'pi pi-check'
    };
    return icons[this.type];
  }

  getDefaultConfirmButtonClass(): string {
    const classes = {
      delete: 'p-button-danger',
      save: 'p-button-success',
      warning: 'p-button-warning',
      info: 'p-button-info',
      custom: 'p-button-primary'
    };
    return classes[this.type];
  }
}

// Service for programmatic usage
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmDialogConfig extends ConfirmDialogData {
  type?: ConfirmDialogType;
  width?: string;
  closable?: boolean;
  showIcon?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private dialogSubject = new BehaviorSubject<ConfirmDialogConfig | null>(null);
  private resultSubject = new BehaviorSubject<boolean | null>(null);

  dialog$ = this.dialogSubject.asObservable();
  result$ = this.resultSubject.asObservable();

  confirm(config: ConfirmDialogConfig): Observable<boolean> {
    this.dialogSubject.next(config);

    return new Observable(observer => {
      const subscription = this.result$.subscribe(result => {
        if (result !== null) {
          observer.next(result);
          observer.complete();
          subscription.unsubscribe();
        }
      });
    });
  }

  confirmDelete(message: string, title?: string): Observable<boolean> {
    return this.confirm({
      type: 'delete',
      title: title || 'Silme Onayı',
      message,
      danger: true
    });
  }

  confirmSave(message: string, title?: string): Observable<boolean> {
    return this.confirm({
      type: 'save',
      title: title || 'Kaydetme Onayı',
      message
    });
  }

  confirmWarning(message: string, title?: string): Observable<boolean> {
    return this.confirm({
      type: 'warning',
      title: title || 'Uyarı',
      message
    });
  }

  showInfo(message: string, title?: string): Observable<boolean> {
    return this.confirm({
      type: 'info',
      title: title || 'Bilgi',
      message,
      showCancel: false,
      confirmText: 'Tamam'
    });
  }

  onConfirm() {
    this.resultSubject.next(true);
    this.closeDialog();
  }

  onCancel() {
    this.resultSubject.next(false);
    this.closeDialog();
  }

  private closeDialog() {
    this.dialogSubject.next(null);
    // Reset result after a delay to prevent immediate subscription
    setTimeout(() => this.resultSubject.next(null), 100);
  }
}
