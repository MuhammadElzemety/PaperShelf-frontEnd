import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private user: { name: string; email: string; role: string; token: string } | null = null;

  constructor() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.user = JSON.parse(stored);
    }
  }

  setUser(user: { name: string; email: string; role: string; token: string }) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getRole(): string | null {
    return this.user?.role || null;
  }

  isLoggedIn(): boolean {
    return !!this.user?.token;
  }

  getToken(): string | null {
    return this.user?.token || null;
  }

  logout() {
    this.user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
