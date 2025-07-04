import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
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
  quantity: number = 1;
  relatedProducts: any[] = [];


  constructor(private route: ActivatedRoute, private http: HttpClient , private _cartserv : CartService) {}
  addToCart() {
    this._cartserv.addToCart(this.product.id).subscribe({
      next: (response) => {
        console.log('Added to cart:', this.product.id, response);
      },
      error: (error) => {
        console.error('Failed to add to cart', error);
      }
    });
  }

  isInWishlist = false;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private ProductService: ProductService,
    private toastr: ToastrService // <-- add this
  ) {}

  ngOnInit(): void {
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http
        .get(`http://localhost:3000/api/v1/books/${id}`)
        .subscribe((data: any) => {
          console.log(data);
          this.product = data.data.book;
          console.log('product:', this.product);
          // this.selectedImage = this.product.images?.[0];
          this.selectedImage = this.product.coverImage.startsWith('http')
            ? this.product.coverImage
            : `http://localhost:3000/${this.product.coverImage}`;
          this.loadRelated(this.product.category);
          this.loadReviews();
        });
    }
  }

  changeImage(img: string) {
    this.selectedImage = img;
  }

  buyNow() {
    alert(
      `✅ You are buying ${this.quantity} × "${this.product.title}" for $${
        this.product.price * this.quantity
      }`
    );
  }

  addToWishlist() {
    this.ProductService.addToWishlist(this.product._id).subscribe({
      next: () => {
        this.toastr.success(
          `"${this.product.title}" has been added to your wishlist!`,
          'Added to Wishlist'
        );
        this.isInWishlist = true;
      },
      error: () => {
        this.toastr.error('Failed to add to wishlist!', 'Error');
      },
    });
  }

  newReview = { rating: 5, comment: '' };
  userReviewSubmitted = false;
  hoveredStar = 0;

  submitReview() {
    if (!this.product._id) return;

    // استخدم السيرفس بدلاً من http مباشرة
    this.ProductService.submitReview(
      this.product._id,
      this.newReview
    ).subscribe({
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

  // Helper to reload all reviews for this book
  loadReviews() {
    this.http
      .get(`http://localhost:3000/api/v1/reviews/${this.product._id}`)
      .subscribe((res: any) => {
        this.product.reviews = res.data.reviews || [];
      });
  }

  addToCart() {
    // You can replace this with your real cart service logic
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
      productId: this.product._id,
      title: this.product.title,
      price: this.product.price,
      quantity: this.quantity,
      image: this.selectedImage,
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    this.toastr.success(
      `"${this.product.title}" added to cart!`,
      'Added to Cart'
    );
  }

  loadRelated(category: string) {
    this.http
      .get(`http://localhost:3000/api/v1/books?category=${category}&limit=4`)
      .subscribe((res: any) => {
        // this.relatedProducts = res.data.filter(
        //   (p: any) => p._id !== this.product._id
        // );
        //   if (Array.isArray(res.data)) {
        //     this.relatedProducts = res.data.filter(
        //       (p: any) => p._id !== this.product._id
        //     );
        //   } else {
        //     this.relatedProducts = [];
        //   }
        // });
        if (Array.isArray(res.data.books)) {
          this.relatedProducts = res.data.books.filter(
            (p: any) => p._id !== this.product._id
          );
        } else {
          this.relatedProducts = [];
        }
      });
  }
}
