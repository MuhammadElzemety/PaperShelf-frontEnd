import { HttpClient } from '@angular/common/http';
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
}
