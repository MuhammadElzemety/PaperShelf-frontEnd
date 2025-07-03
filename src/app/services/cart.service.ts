import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient) {}

  addToCart(bookId: string) {
    return this.http.post(`${this.apiUrl}/add`, { bookId, quantity: 1 });
  }

  getCart() {
    const token = localStorage.getItem('token'); // أو حسب مكان تخزين التوكن عندك
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:3000/api/cart', { headers });
  }

}
