import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  selected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<WishlistItem[]> {
    return this.http.get<ApiProduct[]>(this.apiUrl).pipe(
      map(products => products.slice(0, 6).map(product => ({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image,
        inStock: Math.random() > 0.3, // Randomly assign stock status
        selected: false
      })))
    );
  }

  getProduct(id: number): Observable<WishlistItem> {
    return this.http.get<ApiProduct>(`${this.apiUrl}/${id}`).pipe(
      map(product => ({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image,
        inStock: Math.random() > 0.3,
        selected: false
      }))
    );
  }
}

