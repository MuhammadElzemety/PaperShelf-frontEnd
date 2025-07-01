import { Component, OnInit } from '@angular/core';
import { HomebookService } from '../services/homebook.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  books: any[] = [];
  categories: any[] = [];
  authors: any[] = [];
  isLoading = true;
  error = '';

  constructor(private bookService: HomebookService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: (res) => {
        this.books = res.data.books;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error loading books';
        this.isLoading = false;
      }
    });
    this.bookService.getCategories().subscribe((res) => {
      if (res.success) {
        this.categories = res.data.categories;
      }
    });
    this.bookService.getAuthors().subscribe((res) => {
      if (res.success) {
        this.authors = res.authors;
      }
    });
  }
  getFeaturedBooks() {
  return this.books.slice(3, 7); 
}
getPopularBooks() {
  return this.books.slice(7, 15); 
}
}
