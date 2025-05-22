import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  withCredentials?: boolean;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  filters?: { [key: string]: any };
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly baseUrl: string = environment.apiUrl || 'http://localhost:5000/api';

  private defaultHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: QueryParams, options?: HttpOptions): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options, params);
    return this.http.get<ApiResponse<T>>(url, httpOptions).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getById<T>(endpoint: string, id: string | number, options?: HttpOptions): Observable<ApiResponse<T>> {
    const url = this.buildUrl(`${endpoint}/${id}`);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.get<ApiResponse<T>>(url, httpOptions).pipe(
      catchError(error => this.handleError(error))
    );
  }

  post<T>(endpoint: string, data: any, options?: HttpOptions): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.post<ApiResponse<T>>(url, data, httpOptions).pipe(
      catchError(error => this.handleError(error))
    );
  }

  put<T>(endpoint: string, data: any, options?: HttpOptions): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.put<ApiResponse<T>>(url, data, httpOptions).pipe(
      catchError(error => this.handleError(error))
    );
  }

  putById<T>(endpoint: string, id: string | number, data: any, options?: HttpOptions): Observable<ApiResponse<T>> {
    const url = this.buildUrl(`${endpoint}/${id}`);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.put<ApiResponse<T>>(url, data, httpOptions).pipe(
      catchError(error => this.handleError(error))
    );
  }

  patch<T>(endpoint: string, data: any, options?: HttpOptions): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.patch<ApiResponse<T>>(url, data, httpOptions).pipe(
      catchError(error => this.handleError(error))
    );
  }

  patchById<T>(endpoint: string, id: string | number, data: any, options?: HttpOptions): Observable<ApiResponse<T>> {
    const url = this.buildUrl(`${endpoint}/${id}`);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.patch<ApiResponse<T>>(url, data, httpOptions).pipe(
      catchError(error => this.handleError(error))
    );
  }

  delete<T>(endpoint: string, id: string | number, options?: HttpOptions): Observable<ApiResponse<T>> {
    const url = this.buildUrl(`${endpoint}/${id}`);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.delete<ApiResponse<T>>(url, httpOptions).pipe(
      catchError(error => this.handleError(error))
    );
  }

  upload<T>(endpoint: string, file: File, additionalData?: any): Observable<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        const value = additionalData[key];
        if (Array.isArray(value)) {
          value.forEach((v: any) => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });
    }

    const uploadHeaders = new HttpHeaders();
    return this.http.post<ApiResponse<T>>(url, formData, { headers: uploadHeaders }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  download(endpoint: string, filename?: string, params?: QueryParams): Observable<Blob> {
    const url = this.buildUrl(endpoint);
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<Blob>(url, {
      params: httpParams,
      responseType: 'blob' as 'json'
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private buildUrl(endpoint: string): string {
    endpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${this.baseUrl}/${endpoint}`;
  }

  private buildHttpOptions(options?: HttpOptions, params?: QueryParams): HttpOptions {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            httpParams = httpParams.set(key, JSON.stringify(value));
          } else {
            httpParams = httpParams.set(key, value.toString());
          }
        }
      });
    }

    if (options?.params) {
      if (options.params instanceof HttpParams) {
        (options.params as HttpParams).keys().forEach(key => {
          const values = (options.params as HttpParams).getAll(key);
          if (values) {
            values.forEach((value: string) => {
              httpParams = httpParams.append(key, value);
            });
          }
        });
      } else {
        Object.keys(options.params).forEach(key => {
          const value = (options.params as any)[key];
          if (Array.isArray(value)) {
            value.forEach((v: any) => httpParams = httpParams.append(key, v));
          } else {
            httpParams = httpParams.set(key, value);
          }
        });
      }
    }

    return {
      headers: options?.headers || this.defaultHeaders,
      params: httpParams,
      withCredentials: options?.withCredentials || false
    };
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Bilinmeyen bir hata oluştu';
    let errors: string[] = [];

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Geçersiz istek';
            break;
          case 401:
            errorMessage = 'Yetkisiz erişim';
            break;
          case 403:
            errorMessage = 'Erişim reddedildi';
            break;
          case 404:
            errorMessage = 'Kaynak bulunamadı';
            break;
          case 422:
            errorMessage = 'Validasyon hatası';
            if (error.error?.errors) {
              errors = Array.isArray(error.error.errors)
                ? error.error.errors
                : Object.values(error.error.errors).flat();
            }
            break;
          case 500:
            errorMessage = 'Sunucu hatası';
            break;
          case 503:
            errorMessage = 'Servis kullanılamıyor';
            break;
          default:
            errorMessage = `HTTP Hatası: ${error.status}`;
        }
      }
    }

    const apiError: ApiResponse = {
      success: false,
      data: null,
      message: errorMessage,
      errors: errors.length > 0 ? errors : [errorMessage]
    };

    return throwError(() => apiError as ApiResponse);
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
