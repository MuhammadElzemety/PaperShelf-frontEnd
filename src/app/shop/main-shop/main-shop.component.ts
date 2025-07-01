import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { FilterComponent } from '../filter/filter.component';
import { BookCardComponent } from '../../shared/book-card/book-card.component';
import { Book } from '../../interfaces/book';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';

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

  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  constructor(private bookService: BookService) { }

  ngOnInit() {
    this.loadBooks();

    // اعمل سبسكرايب عشان نعمل debounce على البحث
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
    this.currentFilters = filters;
    this.currentPage = 1;
    this.loadBooks();
  }

  onPageChanged(page: number) {
    this.currentPage = page;
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks(this.currentFilters, this.currentPage, this.itemsPerPage).subscribe(res => {
      this.books = res.data.books;
    });
  }
}
