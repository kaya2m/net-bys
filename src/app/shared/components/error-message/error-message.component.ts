import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';

export type ErrorType = 'error' | 'warn' | 'info' | 'success';
export type ErrorDisplay = 'message' | 'toast' | 'inline' | 'banner';
@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [ CommonModule,
    MessageModule,
    MessagesModule,
    ButtonModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent {
  @Input() type: ErrorType = 'error';
  @Input() display: ErrorDisplay | 'empty' = 'message';
  @Input() message: string = '';
  @Input() messages: string[] = [];
  @Input() title: string = '';
  @Input() closable: boolean = true;
  @Input() retryable: boolean = false;
  @Input() customIcon: string = '';
  @Input() messageClass: string = '';
  @Input() actionLabel: string = '';
  @Input() actionIcon: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();
  @Output() action = new EventEmitter<void>();

  get formattedMessages() {
    return this.messages.map(msg => ({
      severity: this.type,
      summary: this.title,
      detail: msg
    }));
  }

  getIcon(): string {
    if (this.customIcon) {
      return this.customIcon;
    }

    const icons = {
      error: 'pi pi-times-circle',
      warn: 'pi pi-exclamation-triangle',
      info: 'pi pi-info-circle',
      success: 'pi pi-check-circle'
    };

    return icons[this.type] || icons.error;
  }

  onClose() {
    this.close.emit();
  }

  onRetry() {
    this.retry.emit();
  }

  onAction() {
    this.action.emit();
  }
}
