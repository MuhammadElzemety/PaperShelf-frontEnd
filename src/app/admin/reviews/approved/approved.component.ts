import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReviewService } from '../../../services/review.service';
import { Review, Pagination } from '../../../interfaces/review';

@Component({
  selector: 'app-approved',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './approved.component.html'
})
export class ApprovedComponent implements OnInit {

  reviews: Review[] = [];
  pagination?: Pagination;
  searchControl = new FormControl('');
  isLoading = false;
  currentPage = 1;

  alert = {
    type: '',
    message: '',
    show: false
  };

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => this.performSearch(query));
  }

  loadReviews(): void {
    this.isLoading = true;
    const page = this.currentPage;
    const limit = 10;
  
    this.reviewService.getApprovedReviews(page, limit).subscribe({
      next: (res) => {
        console.log('API response:', res); 
        if (res.success) {
          this.reviews = res.data;
          this.pagination = res.pagination;
          this.currentPage = this.pagination?.currentPage ?? 1;
        } else {
          this.showAlert('error', 'Failed to load approved reviews');
        }
      },
      error: (err) => {
        console.error('Error loading approved reviews:', err);
        this.showAlert('error', 'Error loading approved reviews');
      },
      complete: () => this.isLoading = false
    });
  }
  
  

  loadPage(page: number): void {
    if (!this.pagination) return;
    const totalPages = this.pagination.totalPages || 1;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
  
    this.isLoading = true;
    const limit = 10;
    const trimmedQuery = (this.searchControl.value ?? '').trim();
  
    this.reviewService.getApprovedReviews(page, limit, trimmedQuery).subscribe({
      next: (res) => {
        if (res.success) {
          this.reviews = res.data;
          this.pagination = res.pagination;
          this.currentPage = this.pagination.currentPage;
        } else {
          this.showAlert('error', 'Failed to load page');
        }
      },
      error: () => this.showAlert('error', 'Error loading page'),
      complete: () => this.isLoading = false
    });
  }
  

  performSearch(query: string | null): void {
    const trimmedQuery = (query ?? '').trim();
    if (!trimmedQuery) {
      this.loadReviews();
      return;
    }
  
    this.isLoading = true;
    const limit = 10;
  
    this.reviewService.getApprovedReviews(1, limit, trimmedQuery).subscribe({
      next: (res) => {
        if (res.success) {
          this.reviews = res.data;
          this.pagination = res.pagination;
          this.currentPage = 1;
        } else {
          this.showAlert('error', 'Search failed');
        }
      },
      error: () => this.showAlert('error', 'Search failed'),
      complete: () => this.isLoading = false
    });
  }
  

  showAlert(type: 'success' | 'error', message: string): void {
    this.alert.type = type;
    this.alert.message = message;
    this.alert.show = true;
    setTimeout(() => this.alert.show = false, 3000);
  }
}
