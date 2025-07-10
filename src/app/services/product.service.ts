import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const API_BASE = `${environment.apiBase}`;
const API_IMG = `${environment.apiUrlForImgs}`;
const API_URL = `${environment.apiBaseUrl}/books`;


export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  discount?: number;
  selected?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${API_BASE}/wishlist`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<any>(this.baseUrl, this.getAuthHeaders()).pipe(
      map((response) =>
        response.data.map((book: any) => ({
          id: book._id,
          name: book.title,
          price: book.price,
          image: book.coverImage.startsWith('http')
            ? book.coverImage
            : `${API_IMG}${book.coverImage}`,
          inStock: book.stock > 0,
          discount: book.discount,
          selected: false,
        }))
      )
    );
  }

  addToWishlist(bookId: string): Observable<any> {
    return this.http.post(this.baseUrl, { bookId }, this.getAuthHeaders());
  }

  removeFromWishlist(bookId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${bookId}`, this.getAuthHeaders());
  }

  submitReview(bookId: string, review: any): Observable<any> {
    return this.http.post(
      `${API_BASE}/${bookId}`,
      review,
      this.getAuthHeaders()
    );
  }

  //  Define a method to get the AI summary for a book
  getAISummary(bookId: string): Observable<string> {
    return this.http
      .get<{ summary: string }>(
        `${API_URL}/${bookId}/formatted-summary`
      )
      .pipe(map((res) => res.summary || ''));
  }

}
