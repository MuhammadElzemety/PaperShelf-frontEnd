import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

const API_URL = environment.apiBaseUrl+'/books';
const IMG_URL = environment.apiUrlForImgs;
@Component({
  selector: 'app-view-book',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.css']
})
export class ViewBookComponent implements OnInit {
  book: any;
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('ViewBookComponent initialized!');
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.fetchBook(bookId);
    } else {
      this.error = 'No book ID found in route.';
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  fetchBook(bookId: string): void {
    this.http.get(`${API_URL}/${bookId}`).subscribe({
      next: (res: any) => {
        this.book = res.data.book; 
        this.isLoading = false;
        this.cdr.markForCheck(); 
      },
      error: (err) => {
        this.error = 'Failed to load book details.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getImageUrl(relativePath: string): string {
    return relativePath
      ? `${IMG_URL}${relativePath}`
      : 'assets/default-book.jpg';
  }

  deleteBook(): void {
    if (!this.book) return;
    this.isLoading = true;
    this.http.delete(`${API_URL}/${this.book._id}`).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/books']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to delete the book. Please try again.';
      }
    });
  }

}
