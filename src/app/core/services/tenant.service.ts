import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Tenant Interceptor
 * - Her HTTP isteğine X-TenantId header'ı ekler
 * - Multi-tenant yapıyı destekler
 * - Tenant ID'yi farklı kaynaklardan alabilir
 */
export const tenantInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  const authService = inject(AuthService);

  // Get tenant ID from various sources
  const tenantId = getTenantId(authService);

  if (tenantId) {
    const modifiedReq = req.clone({
      setHeaders: {
        'X-TenantId': tenantId.toString()
      }
    });

    return next(modifiedReq);
  }

  return next(req);
};

/**
 * Get tenant ID from multiple sources
 * Priority: 1. Current User, 2. URL, 3. Storage, 4. Default
 */
function getTenantId(authService: AuthService): number | null {
  // 1. Get from current user (highest priority)
  const currentUser = authService.getCurrentUser();
  if (currentUser?.tenantId) {
    return currentUser.tenantId;
  }

  // 2. Get from URL subdomain (e.g., tenant1.example.com)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    if (parts.length > 2) {
      const subdomain = parts[0];
      const tenantIdFromSubdomain = extractTenantIdFromSubdomain(subdomain);
      if (tenantIdFromSubdomain) {
        return tenantIdFromSubdomain;
      }
    }

    // 3. Get from URL path (e.g., /tenant/123/dashboard)
    const pathname = window.location.pathname;
    const tenantIdFromPath = extractTenantIdFromPath(pathname);
    if (tenantIdFromPath) {
      return tenantIdFromPath;
    }
  }

  // 4. Get from localStorage/sessionStorage
  const storedTenantId = getStoredTenantId();
  if (storedTenantId) {
    return storedTenantId;
  }

  // 5. Default tenant ID (for development/single tenant)
  return getDefaultTenantId();
}

/**
 * Extract tenant ID from subdomain
 * Examples: tenant1.example.com -> 1, company-abc.example.com -> lookup from mapping
 */
function extractTenantIdFromSubdomain(subdomain: string): number | null {
  // Direct numeric subdomain (e.g., 1.example.com, 123.example.com)
  if (/^\d+$/.test(subdomain)) {
    return parseInt(subdomain, 10);
  }

  // Named subdomain mapping (you can extend this)
  const subdomainMapping: { [key: string]: number } = {
    'demo': 1,
    'test': 2,
    'staging': 3,
    // Add your tenant mappings here
  };

  return subdomainMapping[subdomain] || null;
}

/**
 * Extract tenant ID from URL path
 * Examples: /tenant/123/dashboard -> 123, /t/456/users -> 456
 */
function extractTenantIdFromPath(pathname: string): number | null {
  // Match patterns like /tenant/123 or /t/123
  const patterns = [
    /^\/tenant\/(\d+)/,
    /^\/t\/(\d+)/,
    /^\/(\d+)\//
  ];

  for (const pattern of patterns) {
    const match = pathname.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return null;
}

/**
 * Get tenant ID from storage
 */
function getStoredTenantId(): number | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Try localStorage first (persistent)
  const localStorageTenantId = localStorage.getItem('net_bys_tenant_id');
  if (localStorageTenantId) {
    const tenantId = parseInt(localStorageTenantId, 10);
    if (!isNaN(tenantId)) {
      return tenantId;
    }
  }

  // Try sessionStorage (session-based)
  const sessionStorageTenantId = sessionStorage.getItem('net_bys_tenant_id');
  if (sessionStorageTenantId) {
    const tenantId = parseInt(sessionStorageTenantId, 10);
    if (!isNaN(tenantId)) {
      return tenantId;
    }
  }

  return null;
}

/**
 * Get default tenant ID
 * This is used when no tenant can be determined
 */
function getDefaultTenantId(): number {
  return 1;
}

/**
 * Utility functions for tenant management
 */
export class TenantHelper {
  /**
   * Set tenant ID in storage
   */
  static setTenantId(tenantId: number, persistent: boolean = true): void {
    if (typeof window === 'undefined') return;

    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem('net_bys_tenant_id', tenantId.toString());
  }

  /**
   * Clear tenant ID from storage
   */
  static clearTenantId(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('net_bys_tenant_id');
    sessionStorage.removeItem('net_bys_tenant_id');
  }

  /**
   * Get current tenant ID
   */
  static getCurrentTenantId(): number | null {
    return getStoredTenantId() || getDefaultTenantId();
  }

  /**
   * Switch tenant (useful for admin users)
   */
  static switchTenant(tenantId: number): void {
    this.setTenantId(tenantId);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
}
