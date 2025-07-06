import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { switchMap, throwError, Observable, of } from 'rxjs';

const API_URL = `${environment.apiBaseUrl}/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private _HttpClient: HttpClient) {}

  refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }
    return this._HttpClient.post<{ accessToken: string }>(
      `${API_URL}/refresh-token`,
      { refreshToken }
    ).pipe(
      switchMap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        return of(true);
      })
    );
  }
  
  login(data: { email: string, password: string }): Observable<any> {
    return this._HttpClient.post(`${API_URL}/login`, data);
  }

  register(data: { name: string, email: string, password: string, role: 'author' | 'user' }): Observable<any> {
    return this._HttpClient.post(`${API_URL}/register`, data);
  }

  verifyEmail(data: { otp: string }): Observable<any> {
    return this._HttpClient.post(`${API_URL}/verify-email`, data);
  }

  requestPasswordReset(data: { email: string }): Observable<any> {
    return this._HttpClient.post(`${API_URL}/request-password-reset`, data);
  }

  resetPassword(data: { otp: string, newPassword: string }): Observable<any> {
    return this._HttpClient.post(`${API_URL}/reset-password`, data);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthor(): boolean {
    return this.getCurrentUser()?.role === 'author';
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }
}
