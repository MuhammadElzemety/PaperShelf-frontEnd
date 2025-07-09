import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BookService } from '../../services/book.service';
import { FilterComponent } from '../filter/filter.component';
import { BookCardComponent } from '../../shared/book-card/book-card.component';
import { Book } from '../../interfaces/book';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-shop',
  standalone: true,
  imports: [CommonModule, FilterComponent, BookCardComponent, FormsModule],
  templateUrl: './main-shop.component.html',
  styleUrls: ['./main-shop.component.css']
})
export class MainShopComponent {
  books: Book[] = [];
  currentPage = 1;
  itemsPerPage = 8;
  currentFilters: any = {};
  showSearch: boolean = false;
  isLoading = false;
  searchQuery: string = '';

  totalPages = 1;
  wishlistIds: string[] = [];


  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  } | null = null;

  private searchSubject = new Subject<string>();


  constructor(private bookService: BookService, private route: ActivatedRoute ,private http:HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.currentFilters = { ...this.currentFilters, category: params['category'] };
      } else {
        const { category, ...rest } = this.currentFilters;
        this.currentFilters = { ...rest };
      }
      this.currentPage = 1;
      this.loadBooks();
      this.loadWishlist();
      this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(query => {
      this.performSearch(query);
    });

   
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    setTimeout(() => {
      const input = document.getElementById('searchInput') as HTMLInputElement;
      if (input) input.focus();
    }, 0);
  }

  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }

  performSearch(query: string) {
    if (!query.trim()) {
      this.loadBooks();
      return;
    }
    this.bookService.searchBooks(query, this.currentPage, this.itemsPerPage).subscribe(res => {
      this.books = res.data.books;
    });
  }

  onFiltersApplied(filters: any) {
    this.currentFilters = { ...this.currentFilters, ...filters };
    this.currentPage = 1;
    this.loadBooks();
  }

  onPageChanged(page: number) {
    this.currentPage = page;
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading = true;
    this.bookService.getBooks(this.currentFilters, this.currentPage, this.itemsPerPage).subscribe({
      next: res => {
        this.books = res.data.books;
        this.pagination = res.data.pagination;
      },
      error: err => {
        console.error('Error loading books:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  loadWishlist() {
    this.http.get('http://localhost:3000/api/wishlist').subscribe({
      next: (res: any) => {
        this.wishlistIds = res.data.map((item: any) => item._id); 
      },
      error: (err: any) => {
        console.error('Failed to load wishlist', err);
      },
    });
  }
  
}
