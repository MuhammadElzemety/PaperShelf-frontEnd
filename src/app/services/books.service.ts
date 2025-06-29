import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  getBooks(): Book[] {
    return [
      {
        id: '1',
        title: 'The Witchstone',
        author: 'Francesca May',
        price: 18,
        rating: 4,
        image: 'https://covers.openlibrary.org/b/id/10523322-L.jpg'


      },
      {
        id: '2',
        title: 'A Crooked Tree',
        author: 'Una Mannion',
        price: 26,
        rating: 5,
        image: 'https://covers.openlibrary.org/b/id/10523322-L.jpg'

      },
      {
        id: '3',
        title: 'The Rib King',
        author: 'Ladee Hubbard',
        price: 29,
        rating: 3,
        image: 'https://covers.openlibrary.org/b/id/10523322-L.jpg'

      },
      {
        id: '4',
        title: 'The Bad Guys',
        author: 'Aaron Blabey',
        price: 34,
        rating: 4,
       image: 'https://covers.openlibrary.org/b/id/10523322-L.jpg'

      },
       {
        id: '1',
        title: 'The Witchstone',
        author: 'Francesca May',
        price: 18,
        rating: 4,
       image: 'https://covers.openlibrary.org/b/id/10523322-L.jpg'

      },
      {
        id: '2',
        title: 'A Crooked Tree',
        author: 'Una Mannion',
        price: 26,
        rating: 5,
        image: 'https://covers.openlibrary.org/b/id/10523322-L.jpg'

      },
      {
        id: '3',
        title: 'The Rib King',
        author: 'Ladee Hubbard',
        price: 29,
        rating: 3,
        image: 'https://covers.openlibrary.org/b/id/10523322-L.jpg'

      },
      {
        id: '4',
        title: 'The Bad Guys',
        author: 'Aaron Blabey',
        price: 34,
        rating: 4,
       image: 'https://covers.openlibrary.org/b/id/10523322-L.jpg'

      }
    ];
  }
}

