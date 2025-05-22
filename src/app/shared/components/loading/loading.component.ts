import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';

export type LoadingSize = 'small' | 'medium' | 'large';
export type LoadingType = 'spinner' | 'skeleton' | 'overlay' | 'inline';
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, SkeletonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  @Input() type: LoadingType = 'spinner';
  @Input() size: LoadingSize = 'medium';
  @Input() message: string = '';
  @Input() backdrop: boolean = true;
  @Input() skeletonType: 'card' | 'list' | 'table' | 'text' | 'custom' = 'card';
  @Input() skeletonItems: number = 3;
  @Input() skeletonColumns: number = 4;
  @Input() skeletonRows: number = 5;

  get spinnerStyle() {
    const sizes = {
      small: { width: '2rem', height: '2rem' },
      medium: { width: '3rem', height: '3rem' },
      large: { width: '4rem', height: '4rem' }
    };
    return sizes[this.size];
  }
}
