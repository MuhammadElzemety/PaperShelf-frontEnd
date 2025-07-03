import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
 private user: { name: string; email: string; role: string; token: string } | null = null;
  userChanged = new BehaviorSubject<{ name: string; role: string } | null>(null);

  constructor() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.user = JSON.parse(stored);
      this.userChanged.next({ name: this.user?.name ?? '', role: this.user?.role ?? ''});
    }
  }

  setUser(user: { name: string; email: string; role: string; token: string }) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    this.userChanged.next({ name: user.name, role: user.role });
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
    this.userChanged.next(null);
  }
}
