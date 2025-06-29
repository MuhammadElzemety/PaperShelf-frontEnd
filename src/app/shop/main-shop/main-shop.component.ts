import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service'; 
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-main-shop',
  standalone: true,
  imports: [CommonModule, FilterComponent],
  templateUrl: './main-shop.component.html',
  styleUrls: ['./main-shop.component.css']
})
export class MainShopComponent {
  books: any[] = [];
  currentPage = 1;
  itemsPerPage = 8;
  currentFilters: any = {};
  showSearch: boolean = false;

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }
  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
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
    this.bookService.getBooks(this.currentFilters, this.currentPage, this.itemsPerPage).subscribe(data => {
      this.books = data;
    });
  }
}
