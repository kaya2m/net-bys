// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (allowedRoles?: string[]) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const currentUser = authService.getCurrentUser();
    if (!currentUser?.rolAdi || !allowedRoles.includes(currentUser.rolAdi)) {
      router.navigate(['/unauthorized']);
      return false;
    }
  }

  return true;
};
