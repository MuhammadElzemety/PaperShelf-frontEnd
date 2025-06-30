import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service'; 
import { FilterComponent } from '../filter/filter.component';
import { BookCardComponent } from '../../shared/book-card/book-card.component';
import { Book } from '../../interfaces/book';

@Component({
  selector: 'app-main-shop',
  standalone: true,
  imports: [CommonModule, FilterComponent, BookCardComponent],
  templateUrl: './main-shop.component.html',
  styleUrls: ['./main-shop.component.css']
})
export class MainShopComponent {
  books: Book[] = [];
  currentPage = 1;
  itemsPerPage = 8;
  currentFilters: any = {};
  showSearch: boolean = false;

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
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
