import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    DividerModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  version = '1.0.0';

  systemStatus = {
    text: 'Sistem Aktif',
    icon: 'pi pi-check-circle',
    class: 'status-online'
  };

  constructor() {
    this.checkSystemStatus();
  }

  private checkSystemStatus() {
    // Simulate system status check
    // In real app, this would be a service call
    const statuses = [
      { text: 'Sistem Aktif', icon: 'pi pi-check-circle', class: 'status-online' },
      { text: 'Kısmi Kesinti', icon: 'pi pi-exclamation-triangle', class: 'status-warning' },
      { text: 'Sistem Bakımda', icon: 'pi pi-times-circle', class: 'status-offline' }
    ];

    // For demo, always show online
    this.systemStatus = statuses[0];
  }
}
