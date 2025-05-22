
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpService, ApiResponse } from './http.service';
import { User } from '../interfaces/Auth/User';
import { LoginRequest } from '../interfaces/Auth/LoginRequest';
import { LoginResponse } from '../interfaces/Auth/LoginResponse';
import { RegisterRequest } from '../interfaces/Auth/RegisterRequest';
import { ForgotPasswordRequest } from '../interfaces/Auth/ForgotPasswordRequest';
import { ResetPasswordRequest } from '../interfaces/Auth/ResetPasswordRequest';
import { ChangePasswordRequest } from '../interfaces/Auth/ChangePasswordRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'net_bys_token';
  private readonly USER_KEY = 'net_bys_user';
  private readonly REMEMBER_ME_KEY = 'net_bys_remember_me';

  // BehaviorSubjects for reactive state management
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  // Public observables
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private httpService: HttpService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication on service creation
   */
  private initializeAuth(): void {
    const token = this.getToken();
    const user = this.getStoredUser();

    if (token && user) {
      if (this.isTokenValid(token)) {
        this.setCurrentUser(user);
        this.isAuthenticatedSubject.next(true);
      } else {
        this.clearAuth();
      }
    }
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.isLoadingSubject.next(true);

    return this.httpService.post<LoginResponse>('auth/login', credentials).pipe(
      map(response => {
        // Backend direkt response dönüyor, ApiResponse wrapper yok
        const loginResponse = response as any;
        if (loginResponse.token && loginResponse.user) {
          this.handleLoginSuccess(loginResponse, credentials.rememberMe);
        }
        return loginResponse;
      }),
      catchError(error => {
        this.isLoadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<any> {
    this.isLoadingSubject.next(true);

    return this.httpService.post('auth/register', userData).pipe(
      catchError(error => {
        this.isLoadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.isLoadingSubject.next(false))
    );
  }

  /**
   * Forgot password
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<any> {
    return this.httpService.post('auth/forgot-password', request);
  }

  /**
   * Reset password
   */
  resetPassword(request: ResetPasswordRequest): Observable<any> {
    return this.httpService.post('auth/reset-password', request);
  }

  /**
   * Get current user profile
   */
  getCurrentUserProfile(): Observable<User> {
    return this.httpService.get<User>('auth/me').pipe(
      map(response => {
        // Backend'den gelen user verisi
        const userData = response as any;
        const user: User = {
          id: userData.id,
          email: userData.email,
          ad: userData.name?.split(' ')[0] || '',
          soyad: userData.name?.split(' ')[1] || '',
          tenantId: parseInt(userData.tenantId),
          rolId: userData.role,
          rolAdi: userData.role,
          fullName: userData.name,
          isActive: true
        };
        this.setCurrentUser(user);
        return user;
      })
    );
  }

  /**
   * Change password for authenticated user
   */
  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<any>> {
    return this.httpService.post('auth/change-password', request);
  }

  // /**
  //  * Refresh authentication token
  //  */
  // refreshToken(): Observable<ApiResponse<LoginResponse>> {
  //   // const refreshToken = this.getRefreshToken();

  //   if (!refreshToken) {
  //     return throwError(() => ({ success: false, message: 'Refresh token not found', data: null }));
  //   }

  //   return this.httpService.post<LoginResponse>('auth/refresh-token', { refreshToken }).pipe(
  //     tap(response => {
  //       if (response.success && response.data) {
  //         this.handleLoginSuccess(response.data);
  //       }
  //     }),
  //     catchError(error => {
  //       this.logout();
  //       return throwError(() => error);
  //     })
  //   );
  // }

  /**
   * Logout user
   */
  logout(): void {
    // const refreshToken = this.getRefreshToken();

    // // Call logout endpoint if refresh token exists
    // if (refreshToken) {
    //   this.httpService.post('auth/logout', { refreshToken }).pipe(
    //     catchError(() => of(null)) // Ignore errors on logout
    //   ).subscribe();
    // }

    this.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.rolAdi === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.rolAdi) : false;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    const isRemembered = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';

    if (isRemembered) {
      return localStorage.getItem(this.TOKEN_KEY);
    } else {
      return sessionStorage.getItem(this.TOKEN_KEY);
    }
  }

  // /**
  //  * Get refresh token
  //  */
  // getRefreshToken(): string | null {
  //   const isRemembered = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';

  //   if (isRemembered) {
  //     return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  //   } else {
  //     return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  //   }
  // }

  /**
   * Update user profile
   */
  updateProfile(userData: Partial<User>): Observable<ApiResponse<User>> {
    return this.httpService.put<User>('auth/profile', userData).pipe(
      tap(response => {
        if (response.success && response.data) {
          const updatedUser = { ...this.getCurrentUser(), ...response.data } as User;
          this.setCurrentUser(updatedUser);
        }
      })
    );
  }

  /**
   * Get user profile from server
   */
  getUserProfile(): Observable<ApiResponse<User>> {
    return this.httpService.get<User>('auth/profile').pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setCurrentUser(response.data);
        }
      })
    );
  }

  /**
   * Verify email
   */
  verifyEmail(token: string): Observable<ApiResponse<any>> {
    return this.httpService.post('auth/verify-email', { token });
  }

  /**
   * Resend email verification
   */
  resendEmailVerification(): Observable<ApiResponse<any>> {
    return this.httpService.post('auth/resend-verification', {});
  }

  /**
   * Handle successful login
   */
  private handleLoginSuccess(loginResponse: LoginResponse, rememberMe: boolean = false): void {
    const { user, token } = loginResponse;

    // Backend'den gelen user verisini User interface'e dönüştür
    const mappedUser: User = {
      id: user.id,
      email: user.email,
      ad: user.ad,
      soyad: user.soyad,
      fullName: `${user.ad} ${user.soyad}`,
      tenantId: user.tenantId,
      rolId: user.rolId,
      rolAdi: user.rolAdi,
      isActive: true
    };

    // Store authentication data
    this.storeAuthData(token, mappedUser, rememberMe);

    // Update state
    this.setCurrentUser(mappedUser);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Store authentication data
   */
  private storeAuthData(token: string, user: User, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(this.TOKEN_KEY, token);
    storage.setItem(this.USER_KEY, JSON.stringify(user));

    // Store remember me preference in localStorage
    localStorage.setItem(this.REMEMBER_ME_KEY, rememberMe.toString());
  }

  /**
   * Get stored user
   */
  private getStoredUser(): User | null {
    const isRemembered = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
    const storage = isRemembered ? localStorage : sessionStorage;
    const userJson = storage.getItem(this.USER_KEY);

    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }

    return null;
  }

  /**
   * Set current user
   */
  private setCurrentUser(user: User): void {
    user.fullName = `${user.ad} ${user.soyad}`;
    this.currentUserSubject.next(user);

    // Update stored user data
    const isRemembered = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
    const storage = isRemembered ? localStorage : sessionStorage;
    storage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    // Clear from both storages
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REMEMBER_ME_KEY);

    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);

    // Update state
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Check if token is valid (basic check)
   */
  private isTokenValid(token: string): boolean {
    if (!token) return false;

    try {
      // Basic JWT structure check
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  /**
   * Get token expiration date
   */
  getTokenExpirationDate(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expirationDate = this.getTokenExpirationDate();
    return expirationDate ? expirationDate < new Date() : true;
  }
}
