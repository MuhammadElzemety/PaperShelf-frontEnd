import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, Pagination } from '../interfaces/review';
import { environment } from '../../environments/environment';

const API_URL = environment.apiBase + '/reviews';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private baseUrl = API_URL;

  getPendingReviews(page: number, limit: number, searchText?: string): Observable<{ success: boolean, data: Review[], pagination: Pagination }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (searchText) {
      params = params.set('search', searchText);
    }

    return this.http.get<{ success: boolean, data: Review[], pagination: Pagination }>(`${this.baseUrl}/pending/all`, { params });
  }

  updateReviewStatus(bookId: string, reviewId: string, approved: boolean): Observable<{ success: boolean, message: string }> {
    return this.http.patch<{ success: boolean, message: string }>(`${this.baseUrl}/approve/${bookId}/${reviewId}`, { approved });
  }

  searchPendingReviews(searchText: string, page: number = 1, limit: number = 10): Observable<{ success: boolean, data: Review[], pagination: Pagination }> {
    const params = new HttpParams()
      .set('search', searchText)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<{ success: boolean, data: Review[], pagination: Pagination }>(`${this.baseUrl}/pending/search`, { params });
  }

  approveReview(bookId: string, reviewId: string, approved: boolean): Observable<{ success: boolean, message: string }> {
    return this.http.patch<{ success: boolean, message: string }>(
      `${this.baseUrl}/approve/${bookId}/${reviewId}`,
      { approved }
    );
  }

  getApprovedReviews(page: number, limit: number, searchText?: string): Observable<{ success: boolean, data: Review[], pagination: Pagination }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
  
    if (searchText) {
      params = params.set('search', searchText);
    }
  
    return this.http.get<{ success: boolean, data: Review[], pagination: Pagination }>(`${this.baseUrl}/approved/all`, { params });
  }
  
  setReviewPending(bookId: string, reviewId: string): Observable<{ success: boolean, message: string }> {
    return this.http.patch<{ success: boolean, message: string }>(
      `${this.baseUrl}/approve/${bookId}/${reviewId}`,
      { approved: false }
    );
  }
  
  deleteReview(reviewId: string): Observable<{ success: boolean, message: string }> {
    return this.http.delete<{ success: boolean, message: string }>(
      `${this.baseUrl}/${reviewId}`
    );
  }
  
}
