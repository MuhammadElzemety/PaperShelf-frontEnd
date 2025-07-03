import { Component, OnInit } from '@angular/core';
import { HomebookService } from '../services/homebook.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  books: any[] = [];
  categories: any[] = [];
  authors: any[] = [];
  isLoading = true;
  error = '';
  selectedCategory: string = 'all';

  constructor(private bookService: HomebookService) {}

  ngOnInit(): void {
    // Load books
    this.bookService.getBooks().subscribe({
      next: (res) => {
        this.books = res.data.books;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error loading books';
        this.isLoading = false;
      },
    });

    // Load categories
    this.bookService.getCategories().subscribe((res) => {
      if (res.success) {
        this.categories = res.data.categories;
      }
    });

    // Load authors
    this.bookService.getAuthors().subscribe((res) => {
      if (res.success) {
        this.authors = res.authors;
      }
    });
  }

  // Return all books if "all" is selected, else filter by category
  getFilteredBooks() {
    if (this.selectedCategory === 'all') {
      return this.books.slice(1,9);
    }
    return this.books.filter(
      (book) => book.category?.toLowerCase() === this.selectedCategory.toLowerCase()
    );
  }

  // Update selected category
  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  // Optional: slice popular/featured books
  getFeaturedBooks() {
    return this.books.slice(3, 7);
  }

  getPopularBooks() {
    return this.books.slice(7, 15);
  }
}
