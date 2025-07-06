import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReviewService } from '../../../services/review.service';
import { Review, Pagination } from '../../../interfaces/review';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pending.component.html'
})
export class PendingComponent implements OnInit {

  reviews: Review[] = [];
  pagination: any;
  searchControl = new FormControl('');
  isLoading = false;
  currentPage = 1;

  alert = {
    type: '',
    message: '',
    show: false
  };

  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {
    console.log('PendingComponent initialized!');
    this.loadReviews();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => this.performSearch(query));
  }

  // 🟢 تحميل الريفيوهات بدون فلترة (افتراضيًا)
  loadReviews(): void {
    this.isLoading = true;
    const page = this.currentPage;
    const limit = 10;

    this.reviewService.getPendingReviews(page, limit).subscribe({
      next: (res) => {
        if (res.success) {
          this.reviews = res.data;
          this.pagination = res.pagination;
          this.currentPage = this.pagination.currentPage;
        } else {
          this.showAlert('error', 'Failed to load reviews');
        }
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.showAlert('error', 'Error loading reviews');
      },
      complete: () => this.isLoading = false
    });
  }

  // 🟢 تحميل صفحة محددة (للباجينج) سواء مع فلترة أو بدون
  loadPage(page: number): void {
    if (!this.pagination) return;
    const totalPages = this.pagination.totalPages || 1;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    this.isLoading = true;
    const limit = 10;
    const trimmedQuery = (this.searchControl.value ?? '').trim();

    const loadObs = trimmedQuery
      ? this.reviewService.searchPendingReviews(trimmedQuery, page, limit)
      : this.reviewService.getPendingReviews(page, limit);

    loadObs.subscribe({
      next: (res) => {
        if (res.success) {
          this.reviews = res.data;
          this.pagination = res.pagination;
          this.currentPage = this.pagination.currentPage;
        } else {
          this.showAlert('error', 'Failed to load page');
        }
      },
      error: (err) => {
        console.error('Error loading page:', err);
        this.showAlert('error', 'Error loading page');
      },
      complete: () => this.isLoading = false
    });
  }

  // 🟢 تنفيذ البحث
  performSearch(query: string | null): void {
    const trimmedQuery = (query ?? '').trim();
    if (!trimmedQuery) {
      this.loadReviews();
      return;
    }

    this.isLoading = true;
    const limit = 10;

    this.reviewService.searchPendingReviews(trimmedQuery, 1, limit).subscribe({
      next: (res) => {
        if (res.success) {
          this.reviews = res.data;
          this.pagination = res.pagination;
          this.currentPage = 1;
        } else {
          this.showAlert('error', 'Search failed');
        }
      },
      error: (err) => {
        console.error('Error performing search:', err);
        this.showAlert('error', 'Search failed');
      },
      complete: () => this.isLoading = false
    });
  }

  // 🟢 زر البحث في الفورم
  onSearch(): void {
    this.performSearch(this.searchControl.value);
  }

  // 🟢 الموافقة أو الرفض
  approveReview(bookId: string, reviewId: string, approve: boolean): void {
    this.reviewService.approveReview(bookId, reviewId, approve).subscribe({
      next: (res) => {
        if (res.success) {
          this.showAlert('success', approve ? 'Review approved' : 'Review rejected');
          this.loadPage(this.currentPage);
        } else {
          this.showAlert('error', 'Failed to update review');
        }
      },
      error: (err) => {
        console.error('Error updating review:', err);
        this.showAlert('error', 'Error updating review');
      }
    });
  }

  // 🟢 الاليرت
  showAlert(type: 'success' | 'error', message: string): void {
    this.alert.type = type;
    this.alert.message = message;
    this.alert.show = true;
    setTimeout(() => this.alert.show = false, 3000);
  }
}
