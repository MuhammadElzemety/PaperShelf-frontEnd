import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../services/book.service';
import { Book } from '../interfaces/book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-slider.component.html',
  styleUrls: ['./book-slider.component.css']
})
export class BookSliderComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  clonedBooks: Book[] = [];
  currentSlide = 0;
  slideWidth = 16.666; 
  intervalId: any;
  isTransitioning = true;

  constructor(private booksService: BookService , private router : Router) {}

  ngOnInit(): void {
    this.booksService.getBooks({}, 1, 25).subscribe({
      next: res => {
        this.books = res.data.books;
        this.clonedBooks = [...this.books, ...this.books.slice(0, 6)]; 
        if (this.books.length > 0) {
          this.intervalId = setInterval(() => {
            this.nextSlide();
          }, 3000);
        }
      },
      error: err => {
        console.error('Error fetching books in slider:', err);
      }
    });
  }
  goToDetails(bookId: string) {
    this.router.navigate(['/product', bookId]);
  }
  nextSlide(): void {
    this.currentSlide++;
    const maxSlide = this.clonedBooks.length - Math.floor(100 / this.slideWidth);

    if (this.currentSlide >= maxSlide) {
      this.isTransitioning = true;
      setTimeout(() => {
        this.isTransitioning = false;
        this.currentSlide = 0;
      }, 800); 
    }
  }

  getTransform(): string {
    return `translateX(-${this.currentSlide * this.slideWidth}%)`;
  }

  getMaxSlide(): number {
    const visibleCards = Math.floor(100 / this.slideWidth);
    return Math.max(1, this.books.length - visibleCards + 1);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
