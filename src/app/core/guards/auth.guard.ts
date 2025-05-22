import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Route Protection
 * Kullanım: canActivate: [() => authGuard()]
 * Kullanım: canActivate: [() => authGuard(['Admin', 'Manager'])]
 */
export const authGuard = (allowedRoles?: string[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean => {
    const router = inject(Router);
    const authService = inject(AuthService);

    // Check if user is logged in
    if (!authService.isLoggedIn()) {
      console.warn('User not authenticated, redirecting to login');
      router.navigate(['/auth/login'], {
        queryParams: {
          returnUrl: state.url,
          message: 'Bu sayfaya erişim için giriş yapmanız gerekiyor.'
        }
      });
      return false;
    }

    const currentUser = authService.getCurrentUser();

    // If no user data available, try to get from server
    if (!currentUser) {
      return authService.getCurrentUserProfile().pipe(
        map(user => {
          if (user && allowedRoles && allowedRoles.length > 0) {
            return checkRoleAccess(user.rolAdi, allowedRoles, router, state.url);
          }
          return true;
        }),
        catchError(error => {
          console.error('Failed to get user profile:', error);
          router.navigate(['/auth/login'], {
            queryParams: {
              returnUrl: state.url,
              message: 'Kullanıcı bilgileri alınamadı. Lütfen tekrar giriş yapın.'
            }
          });
          return of(false);
        })
      );
    }

    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0) {
      return checkRoleAccess(currentUser.rolAdi, allowedRoles, router, state.url);
    }

    return true;
  };
};

/**
 * Role-based access control helper
 */
function checkRoleAccess(userRole: string, allowedRoles: string[], router: Router, currentUrl: string): boolean {
  if (!allowedRoles.includes(userRole)) {
    console.warn(`Access denied. User role: ${userRole}, Required roles: ${allowedRoles.join(', ')}`);
    router.navigate(['/unauthorized'], {
      queryParams: {
        returnUrl: currentUrl,
        message: `Bu sayfaya erişim için ${allowedRoles.join(' veya ')} yetkisi gerekiyor.`
      }
    });
    return false;
  }

  return true;
}

/**
 * Permission-based Guard
 * Kullanım: canActivate: [() => permissionGuard(['users.read', 'users.write'])]
 */
export const permissionGuard = (requiredPermissions: string[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!authService.isLoggedIn()) {
      router.navigate(['/auth/login'], {
        queryParams: {
          returnUrl: state.url,
          message: 'Bu sayfaya erişim için giriş yapmanız gerekiyor.'
        }
      });
      return false;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.navigate(['/auth/login'], {
        queryParams: {
          returnUrl: state.url,
          message: 'Kullanıcı bilgileri bulunamadı.'
        }
      });
      return false;
    }

    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some(permission =>
      authService.hasPermission(permission)
    );

    if (!hasPermission) {
      console.warn(`Permission denied. Required permissions: ${requiredPermissions.join(', ')}`);
      router.navigate(['/unauthorized'], {
        queryParams: {
          returnUrl: state.url,
          message: `Bu işlem için ${requiredPermissions.join(' veya ')} yetkisi gerekiyor.`
        }
      });
      return false;
    }

    return true;
  };
};

/**
 * Guest Guard - Only allow unauthenticated users
 * Kullanım: canActivate: [guestGuard]
 */
export const guestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    console.log('User already authenticated, redirecting to dashboard');
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

/**
 * Admin Guard - Only allow admin users
 * Kullanım: canActivate: [adminGuard]
 */
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return authGuard(['Admin'])(route, state);
};

/**
 * Manager Guard - Allow admin and manager users
 * Kullanım: canActivate: [managerGuard]
 */
export const managerGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return authGuard(['Admin', 'SiteYoneticisi'])(route, state);
};

/**
 * Tenant Guard - Check if user belongs to specific tenant
 * Kullanım: canActivate: [() => tenantGuard(1)] or use route data
 */
export const tenantGuard = (requiredTenantId?: number): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!authService.isLoggedIn()) {
      router.navigate(['/auth/login'], {
        queryParams: {
          returnUrl: state.url,
          message: 'Bu sayfaya erişim için giriş yapmanız gerekiyor.'
        }
      });
      return false;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.navigate(['/auth/login']);
      return false;
    }

    // Get required tenant ID from parameter or route data
    const tenantId = requiredTenantId || route.data['requiredTenantId'];

    if (tenantId && currentUser.tenantId !== tenantId) {
      console.warn(`Tenant access denied. User tenant: ${currentUser.tenantId}, Required tenant: ${tenantId}`);
      router.navigate(['/unauthorized'], {
        queryParams: {
          message: 'Bu sayfaya erişim yetkiniz bulunmamaktadır.'
        }
      });
      return false;
    }

    return true;
  };
};

/**
 * Can Deactivate Guard - Prevent navigation if there are unsaved changes
 * Kullanım: canDeactivate: [canDeactivateGuard]
 */
export interface CanDeactivateComponent {
  canDeactivate(): boolean | Observable<boolean>;
}

export const canDeactivateGuard = (
  component: CanDeactivateComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState?: RouterStateSnapshot
): Observable<boolean> | boolean => {

  if (component.canDeactivate) {
    return component.canDeactivate();
  }

  return true;
};

/**
 * Feature Flag Guard - Check if feature is enabled
 * Kullanım: canActivate: [() => featureGuard('newDashboard')]
 */
export const featureGuard = (featureName: string): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const router = inject(Router);

    // Get feature flags from environment or service
    const features = {
      newDashboard: true,
      advancedReports: false,
      multiTenant: true,
      // Add your feature flags here
    };

    const isFeatureEnabled = (features as any)[featureName];

    if (!isFeatureEnabled) {
      console.warn(`Feature '${featureName}' is not enabled`);
      router.navigate(['/404'], {
        queryParams: {
          message: 'Bu özellik şu anda kullanılamıyor.'
        }
      });
      return false;
    }

    return true;
  };
};

/**
 * Guard composition helper - Combine multiple guards
 * Kullanım: canActivate: [combineGuards([authGuard(['Admin']), tenantGuard(1)])]
 */
export const combineGuards = (guards: CanActivateFn[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean => {
    for (const guard of guards) {
      const result = guard(route, state);

      if (result instanceof Observable) {
        return result.pipe(
          map(canActivate => {
            if (!canActivate) return false;
            // If this guard passes, check remaining guards
            const remainingGuards = guards.slice(guards.indexOf(guard) + 1);
            if (remainingGuards.length === 0) return true;
            return combineGuards(remainingGuards)(route, state) as boolean;
          })
        );
      } else if (!result) {
        return false;
      }
    }

    return true;
  };
};
