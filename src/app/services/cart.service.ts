import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

const API_BASE = `${environment.apiBase}`;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${API_BASE}/cart`;

  private cartSubject = new BehaviorSubject<any>({ items: [], totalAmount: 0 });
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) { }

  addToCart(payload: { bookId: string; quantity: number }) {
    return this.http.post(`${this.apiUrl}/add`, payload);
  }

  getCart() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}`, { headers });
  }

  refreshCart() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.role === 'admin') return;
    this.getCart().subscribe({
      next: (response: any) => {
        this.cartSubject.next(response.data || { items: [], totalAmount: 0 });
      },
      error: () => {
        this.cartSubject.next({ items: [], totalAmount: 0 });
      },
    });
  }

  updateCartItemQuantity(itemId: string, quantity: number) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(
      `${this.apiUrl}/update`,
      { itemId, quantity },
      { headers }
    );
  }

  removeCartItem(itemId: string) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/remove/${itemId}`, { headers });
  }

  private toggleCartSource = new Subject<void>();

  toggleCart$ = this.toggleCartSource.asObservable();

  toggleCart() {
    this.toggleCartSource.next();
  }
}
