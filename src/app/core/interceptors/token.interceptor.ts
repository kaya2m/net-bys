import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Token Interceptor
 * - Her HTTP isteğine Bearer token ekler
 * - Tenant ID header'ı ekler
 * - 401 hatalarında otomatik logout yapar
 * - Loading state'i yönetir
 */
export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const authEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
  const isAuthEndpoint = authEndpoints.some(endpoint => req.url.includes(endpoint));

  if (isAuthEndpoint) {
    return next(addTenantHeader(req));
  }

  const token = authService.getToken();
  const currentUser = authService.getCurrentUser();

  let modifiedReq = req;

  if (token) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  if (currentUser?.tenantId) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        'X-TenantId': currentUser.tenantId.toString()
      }
    });
  }

  modifiedReq = modifiedReq.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return next(modifiedReq).pipe(
    catchError(error => {
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        handleUnauthorized(authService, router);
      }

      // Handle 403 Forbidden errors
      if (error.status === 403) {
        handleForbidden(router);
      }

      // Handle 500 Internal Server Error
      if (error.status === 500) {
        console.error('Server Error:', error);
      }

      return throwError(() => error);
    })
  );
};

/**
 * Add tenant header for auth endpoints
 */
function addTenantHeader(req: HttpRequest<any>): HttpRequest<any> {
  let tenantId: string | null = null;

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];

    tenantId = localStorage.getItem('net_bys_tenant_id') ||
               sessionStorage.getItem('net_bys_tenant_id') ||
               (subdomain !== 'localhost' && subdomain !== 'www' ? subdomain : '1');
  }

  if (tenantId) {
    return req.clone({
      setHeaders: {
        'X-TenantId': tenantId,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  return req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}

/**
 * Handle 401 Unauthorized error
 */
function handleUnauthorized(authService: AuthService, router: Router): void {
  console.warn('Unauthorized access - redirecting to login');

  authService.logout();

  router.navigate(['/auth/login'], {
    queryParams: {
      returnUrl: router.url,
      message: 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.'
    }
  });
}

/**
 * Handle 403 Forbidden error
 */
function handleForbidden(router: Router): void {
  console.warn('Access forbidden - insufficient permissions');

  router.navigate(['/unauthorized'], {
    queryParams: {
      message: 'Bu işlem için yetkiniz bulunmamaktadır.'
    }
  });
}
