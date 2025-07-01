import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  isbn: string;
  price: number;
  discount: number;
  pages: number;
  category: string;
  coverImage: string;
  stock: number;
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  reviews: any[];
}

@Injectable({
  providedIn: 'root'
})
export class HomebookService {
  private apiUrl = 'http://localhost:3000/api/v1/books';
   private baseUrl = 'http://localhost:3000/api/v1/books';
   private authorurl = 'http://localhost:3000/api/v1/users/authors'
  constructor(private http: HttpClient) {}

  getBooks(): Observable<{success: boolean, data: {books: Book[]}}> {
    return this.http.get<{success: boolean, data: {books: Book[]}}>(this.apiUrl);
  }
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories/`);
  }
  getAuthors(): Observable<any> {
    return this.http.get<any>(this.authorurl);
  }
}
