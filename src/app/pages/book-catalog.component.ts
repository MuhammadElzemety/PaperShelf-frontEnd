import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from '../../app/shared/book-card/book-card.component';
import { BooksService } from '../../app/services/books.service';
import { Book } from '../../app/models/book.model';

@Component({
  selector: 'app-book-catalog',
  standalone: true,
  imports: [CommonModule, BookCardComponent],
  templateUrl: './book-catalog.component.html',
  styleUrls: ['./book-catalog.component.css']
})
export class BookCatalogComponent {
  books: Book[] = [];

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.books = this.booksService.getBooks(); 
  }
}
