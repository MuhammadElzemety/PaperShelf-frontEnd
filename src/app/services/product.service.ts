import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  selected?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/api/wishlist';

  constructor(private http: HttpClient) {}

  // ✅ دالة بتجيب الهيدر اللي فيه التوكن
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken'); // تأكد إنه محفوظ عند الـ login
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  // ✅ جلب قائمة الـ wishlist من الباك إند
  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<any>(this.baseUrl, this.getAuthHeaders()).pipe(
      map((response) =>
        response.data.map((book: any) => ({
          id: book._id,
          name: book.title,
          price: book.price,
          image: book.coverImage.startsWith('http')
            ? book.coverImage
            : `http://localhost:3000/${book.coverImage}`,
          inStock: book.stock > 0,
          selected: false,
        }))
      )
    );
  }

  // getWishlist(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/wishlist`, this.getAuthHeaders());
  // }

  // ✅ إضافة كتاب للـ wishlist
  addToWishlist(bookId: string): Observable<any> {
    return this.http.post(this.baseUrl, { bookId }, this.getAuthHeaders());
  }

  // ✅ حذف كتاب من الـ wishlist
  removeFromWishlist(bookId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${bookId}`, this.getAuthHeaders());
  }
}

// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { map } from 'rxjs/operators';
// import { Observable } from 'rxjs';

// export interface WishlistItem {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
//   inStock: boolean;
//   selected?: boolean;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductService {
//   private baseUrl = 'http://localhost:3000/api/wishlist'; // عدل حسب الباك إند بتاعك

//   constructor(private http: HttpClient) {}

//   private getAuthHeaders() {
//     const token = localStorage.getItem('token'); // ✅ أضف دي هنا
//     return {
//       headers: new HttpHeaders({
//         Authorization: `Bearer ${token}`,
//       }),
//     };
//   }
//   getProducts(): Observable<WishlistItem[]> {
//     return this.http.get<any>(`${this.baseUrl}/wishlist`).pipe(
//       map((response) =>
//         response.data.books.map((book: any) => ({
//           id: book._id,
//           name: book.title,
//           price: book.price,
//           image: book.coverImage.startsWith('http')
//             ? book.coverImage
//             : `http://localhost:3000/${book.coverImage}`,
//           inStock: book.stock > 0,
//           selected: false,
//         }))
//       )
//     );
//   }
// }

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, map } from 'rxjs';

// export interface ApiProduct {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   category: string;
//   image: string;
//   rating: {
//     rate: number;
//     count: number;
//   };
// }

// export interface WishlistItem {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   inStock: boolean;
//   selected: boolean;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductService {
//   private apiUrl = 'https://fakestoreapi.com/products';

//   constructor(private http: HttpClient) {}

//   getProducts(): Observable<WishlistItem[]> {
//     return this.http.get<ApiProduct[]>(this.apiUrl).pipe(
//       map((products) =>
//         products.slice(0, 6).map((product) => ({
//           id: product.id,
//           name: product.title,
//           price: product.price,
//           image: product.image,
//           inStock: Math.random() > 0.3, // Randomly assign stock status
//           selected: false,
//         }))
//       )
//     );
//   }

//   getProduct(id: number): Observable<WishlistItem> {
//     return this.http.get<ApiProduct>(`${this.apiUrl}/${id}`).pipe(
//       map((product) => ({
//         id: product.id,
//         name: product.title,
//         price: product.price,
//         image: product.image,
//         inStock: Math.random() > 0.3,
//         selected: false,
//       }))
//     );
//   }
// }
