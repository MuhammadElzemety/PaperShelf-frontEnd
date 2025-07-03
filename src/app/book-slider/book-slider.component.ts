import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../services/book.service';
import { Book } from '../interfaces/book';
BookService
@Component({
  selector: 'app-book-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-slider.component.html',
  styleUrls: ['./book-slider.component.css']
})
export class BookSliderComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  currentSlide = 0;
  slideWidth = 16.666; 
  intervalId: any;

  constructor(private booksService: BookService) {}

  ngOnInit(): void {
    this.booksService.getBooks({}, 1, 10).subscribe({
      next: res => {
        this.books = res.data.books;
        console.log('Books fetched:', this.books);
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
  

  nextSlide(): void {
    this.currentSlide++;

    if (this.currentSlide >= this.getMaxSlide()) {
      const track = document.querySelector('.auto-slider-track') as HTMLElement;
      if (track) {
        track.style.transition = 'none';
        this.currentSlide = 0;
        track.style.transform = 'translateX(0)';
        setTimeout(() => {
          track.style.transition = 'transform 0.8s ease-in-out';
        }, 50);
      }
    }
  }

  getMaxSlide(): number {
    const visibleCards = Math.floor(100 / this.slideWidth);
    return Math.max(1, this.books.length - visibleCards + 1);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}