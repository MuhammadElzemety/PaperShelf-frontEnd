import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiBaseUrl}/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HttpClient: HttpClient) { }

  login(data: { email: string, password: string }): Observable<any> {
    return this._HttpClient.post(`${API_URL}/login`, data);
  }

  register(data: { name: string, email: string, password: string }): Observable<any> {
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
  isAdmin(): boolean {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.role === 'admin';
    }
    return false;
  }
  
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}
