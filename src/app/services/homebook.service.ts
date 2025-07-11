import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book } from '../interfaces/book';

const API_URL = `${environment.apiBaseUrl}`;

@Injectable({
  providedIn: 'root'
})
export class HomebookService {
  private apiUrl = `${API_URL}/books`;
  private baseUrl = `${API_URL}/books`;
  private authorurl = `${API_URL}/users/authors`;
  constructor(private http: HttpClient) { }

  getBooks(): Observable<{ success: boolean, data: { books: Book[] } }> {
    return this.http.get<{ success: boolean, data: { books: Book[] } }>(this.apiUrl);
  }
  getCategories(): Observable<{ success: boolean; data: { name: string; image: string }[] }> {
  return this.http.get<{ success: boolean; data: { name: string; image: string }[] }>(
      `${API_URL}/categories/with-icons`
  );
}


  getAuthors(): Observable<any> {
    return this.http.get<any>(this.authorurl);
  }
}
