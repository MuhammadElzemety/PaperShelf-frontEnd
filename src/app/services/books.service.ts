import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http
      .get<any>('https://api.themoviedb.org/3/trending/movie/week?api_key=c7b217b469f69f84e1f03b6298db99bc')
      .pipe(
        map(res => {
          return res.results.map((movie: any) => ({
            id: movie.id.toString(),                       
            title: movie.title || 'Untitled',                 
            author: movie.original_language,                 
            price: Math.floor(Math.random() * 100) + 10,     
            discountPercentage: Math.floor(Math.random() * 30), 

            rating: Math.floor(movie.vote_average / 2),          
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
          }));
        })
      );
  }
}
