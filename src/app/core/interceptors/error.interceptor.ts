import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Error Interceptor
 * - Tüm HTTP hatalarını yakalar ve işler
 * - Hata mesajlarını Türkçeleştirir
 * - Retry mekanizması sağlar
 * - Logging yapar
 */
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  const router = inject(Router);

  return next(req).pipe(
    // Retry failed requests (except authentication endpoints)
    retry({
      count: shouldRetry(req) ? 2 : 0,
      delay: 1000
    }),

    catchError((error: HttpErrorResponse) => {
      // Log error for debugging
      logError(error, req);

      // Handle different error types
      const handledError = handleError(error, router);

      return throwError(() => handledError);
    })
  );
};

/**
 * Determine if request should be retried
 */
function shouldRetry(req: HttpRequest<any>): boolean {
  // Don't retry authentication requests
  const authEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
  const isAuthEndpoint = authEndpoints.some(endpoint => req.url.includes(endpoint));

  if (isAuthEndpoint) {
    return false;
  }

  // Only retry GET requests and specific safe methods
  const safeMethodsToRetry = ['GET', 'HEAD', 'OPTIONS'];
  return safeMethodsToRetry.includes(req.method.toUpperCase());
}

/**
 * Log error for debugging and monitoring
 */
function logError(error: HttpErrorResponse, req: HttpRequest<any>): void {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    status: error.status,
    statusText: error.statusText,
    message: error.message,
    error: error.error
  };

  console.group(`🔴 HTTP Error - ${error.status}`);
  console.error('Request:', req.url, req.method);
  console.error('Error:', error);
  console.error('Full Error Info:', errorInfo);
  console.groupEnd();

  // Here you could send error to logging service
  // this.loggingService.logError(errorInfo);
}

/**
 * Handle different types of HTTP errors
 */
function handleError(error: HttpErrorResponse, router: Router): any {
  let errorMessage = 'Bilinmeyen bir hata oluştu';
  let userFriendlyMessage = '';
  let errors: string[] = [];

  if (error.error instanceof ErrorEvent) {
    // Client-side or network error
    errorMessage = error.error.message;
    userFriendlyMessage = 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.';
  } else {
    // Server-side error
    switch (error.status) {
      case 400:
        errorMessage = 'Geçersiz istek';
        userFriendlyMessage = 'Gönderilen veriler geçersiz. Lütfen bilgileri kontrol edin.';

        // Handle validation errors
        if (error.error && typeof error.error === 'object') {
          if (error.error.errors) {
            // .NET validation errors format
            errors = extractValidationErrors(error.error.errors);
          } else if (error.error.message) {
            userFriendlyMessage = error.error.message;
          }
        }
        break;

      case 401:
        errorMessage = 'Yetkisiz erişim';
        userFriendlyMessage = 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.';
        // Note: 401 handling is done in tokenInterceptor
        break;

      case 403:
        errorMessage = 'Erişim reddedildi';
        userFriendlyMessage = 'Bu işlem için yetkiniz bulunmamaktadır.';
        break;

      case 404:
        errorMessage = 'Kaynak bulunamadı';
        userFriendlyMessage = 'Aradığınız sayfa veya kaynak bulunamadı.';
        break;

      case 409:
        errorMessage = 'Çakışma hatası';
        userFriendlyMessage = 'Bu işlem başka bir işlemle çakışıyor. Lütfen sayfayı yenileyip tekrar deneyin.';
        break;

      case 422:
        errorMessage = 'Validasyon hatası';
        userFriendlyMessage = 'Girilen veriler geçerli değil.';

        if (error.error?.errors) {
          errors = extractValidationErrors(error.error.errors);
        }
        break;

      case 429:
        errorMessage = 'Çok fazla istek';
        userFriendlyMessage = 'Çok fazla istek gönderdiniz. Lütfen bir süre bekleyip tekrar deneyin.';
        break;

      case 500:
        errorMessage = 'Sunucu hatası';
        userFriendlyMessage = 'Sistem geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
        break;

      case 502:
        errorMessage = 'Ağ geçidi hatası';
        userFriendlyMessage = 'Sunucu bağlantı hatası. Lütfen daha sonra tekrar deneyin.';
        break;

      case 503:
        errorMessage = 'Servis kullanılamıyor';
        userFriendlyMessage = 'Sistem geçici olarak bakımda. Lütfen daha sonra tekrar deneyin.';
        break;

      case 504:
        errorMessage = 'Zaman aşımı';
        userFriendlyMessage = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
        break;

      default:
        errorMessage = `HTTP Hatası: ${error.status}`;
        userFriendlyMessage = 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';
    }

    // Try to get server error message
    if (error.error?.message && typeof error.error.message === 'string') {
      userFriendlyMessage = error.error.message;
    }
  }

  // Create standardized error object
  const standardizedError = {
    success: false,
    status: error.status,
    statusText: error.statusText,
    message: errorMessage,
    userFriendlyMessage,
    errors: errors.length > 0 ? errors : [userFriendlyMessage],
    timestamp: new Date().toISOString(),
    url: error.url
  };

  return standardizedError;
}

/**
 * Extract validation errors from .NET API response
 */
function extractValidationErrors(errorsObject: any): string[] {
  const errors: string[] = [];

  if (Array.isArray(errorsObject)) {
    return errorsObject;
  }

  if (typeof errorsObject === 'object') {
    Object.keys(errorsObject).forEach(key => {
      const fieldErrors = errorsObject[key];
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach(error => {
          errors.push(`${key}: ${error}`);
        });
      } else if (typeof fieldErrors === 'string') {
        errors.push(`${key}: ${fieldErrors}`);
      }
    });
  }

  return errors;
}

/**
 * Error helper utilities
 */
export class ErrorHelper {
  /**
   * Check if error is network error
   */
  static isNetworkError(error: any): boolean {
    return error.error instanceof ErrorEvent;
  }

  /**
   * Check if error is server error (5xx)
   */
  static isServerError(error: any): boolean {
    return error.status >= 500 && error.status < 600;
  }

  /**
   * Check if error is client error (4xx)
   */
  static isClientError(error: any): boolean {
    return error.status >= 400 && error.status < 500;
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: any): string {
    if (error?.userFriendlyMessage) {
      return error.userFriendlyMessage;
    }

    if (error?.message) {
      return error.message;
    }

    return 'Bir hata oluştu. Lütfen tekrar deneyin.';
  }

  /**
   * Get validation errors as array
   */
  static getValidationErrors(error: any): string[] {
    if (error?.errors && Array.isArray(error.errors)) {
      return error.errors;
    }

    return [];
  }
}
