import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: any = {};
  selectedImage = '';
  tab: 'description' | 'info' | 'reviews' = 'description';
  quantity = 1;
  relatedProducts: any[] = [];
  isInWishlist = false;
  newReview = { rating: 5, comment: '' };
  userReviewSubmitted = false;
  hoveredStar = 0;

  //  AI Summary Variables
  aiSummary: string = '';
  fullAISummary: string = '';
  streamIndex = 0;
  streamTimer: any;
isStreaming: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private productService: ProductService,
    private toastr: ToastrService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProductDetails(id);
    }
  }

  loadProductDetails(id: string) {
    this.http.get(`http://localhost:3000/api/v1/books/${id}`).subscribe((data: any) => {
      this.product = data.data.book;
      this.selectedImage = this.product.coverImage.startsWith('http')
        ? this.product.coverImage
        : `http://localhost:3000/${this.product.coverImage}`;

      this.loadRelated(this.product.category);
      this.loadReviews();
      this.loadAISummary(id);
    });
  }

  //  AI Summary Streaming
  loadAISummary(bookId: string) {
    this.productService.getAISummary(bookId).subscribe({
      next: (summary: string) => {
        if (!summary || summary.trim() === '') {
          this.aiSummary = '📘 AI Summary not available for this book.';
          return;
        }
        this.fullAISummary = summary;
        this.aiSummary = '';
        this.streamIndex = 0;
        this.startStreaming();
      },
      error: (err) => {
        console.error(' Failed to load AI summary:', err);
        this.aiSummary = '📘 AI Summary not available for this book.';
      }
    });
  }

  startStreaming() {
    if (this.streamTimer) clearInterval(this.streamTimer);
    this.streamTimer = setInterval(() => {
      if (this.streamIndex < this.fullAISummary.length) {
        this.aiSummary += this.fullAISummary[this.streamIndex];
        this.streamIndex++;
      } else {
        clearInterval(this.streamTimer);
      }
    }, 30); // Adjust speed as needed
  }

  changeImage(img: string) {
    this.selectedImage = img;
  }

  buyNow() {
    alert(` You are buying ${this.quantity} × "${this.product.title}" for $${this.product.price * this.quantity}`);
  }

  addToWishlist() {
    this.productService.addToWishlist(this.product._id).subscribe({
      next: () => {
        this.toastr.success(`"${this.product.title}" has been added to your wishlist!`, 'Added to Wishlist');
        this.isInWishlist = true;
      },
      error: () => {
        this.toastr.error('Failed to add to wishlist!', 'Error');
      },
    });
  }

  addToCart() {
    this.cartService.addToCart(this.product.id).subscribe({
      next: (response) => {
        this.toastr.success(`"${this.product.title}" added to cart!`, 'Added to Cart');
        console.log('Added to cart:', this.product.id, response);
      },
      error: (error) => {
        this.toastr.error('Failed to add to cart!', 'Error');
        console.error('Failed to add to cart', error);
      },
    });
  }

  submitReview() {
    if (!this.product._id) return;

    this.productService.submitReview(this.product._id, this.newReview).subscribe({
      next: (res: any) => {
        if (res.data && res.data.review) {
          this.product.reviews = this.product.reviews || [];
          this.product.reviews.unshift(res.data.review);
        } else {
          this.loadReviews();
        }
        this.userReviewSubmitted = true;
        this.newReview = { rating: 5, comment: '' };
        setTimeout(() => (this.userReviewSubmitted = false), 2000);
        this.toastr.success('Review added!', 'Success');
      },
      error: () => {
        this.toastr.error('Failed to add review!', 'Error');
      },
    });
  }

  loadReviews() {
    this.http.get(`http://localhost:3000/api/v1/reviews/${this.product._id}`).subscribe((res: any) => {
      this.product.reviews = res.data.reviews || [];
    });
  }

  loadRelated(category: string) {
    this.http.get(`http://localhost:3000/api/v1/books?category=${category}&limit=4`).subscribe((res: any) => {
      if (Array.isArray(res.data.books)) {
        this.relatedProducts = res.data.books.filter((p: any) => p._id !== this.product._id);
      } else {
        this.relatedProducts = [];
      }
    });
  }
}
