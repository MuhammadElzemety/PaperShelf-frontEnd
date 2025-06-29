import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:3000/books';

  constructor(private http: HttpClient) {}

  getBooks(filters: any, page: number, limit: number): Observable<any[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters.categories?.length) {
      params = params.set('categories', filters.categories.join(','));
    }
    if (filters.authors?.length) {
      params = params.set('authors', filters.authors.join(','));
    }
    if (filters.publishers?.length) {
      params = params.set('publishers', filters.publishers.join(','));
    }
    if (filters.rating) {
      params = params.set('rating', filters.rating.toString());
    }
    if (filters.priceRange) {
      params = params
        .set('priceMin', filters.priceRange.min.toString())
        .set('priceMax', filters.priceRange.max.toString());
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
