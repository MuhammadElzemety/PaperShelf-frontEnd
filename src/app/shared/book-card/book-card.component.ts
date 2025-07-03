import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../interfaces/book';
import { RouterModule } from '@angular/router'
import { CartService } from '../../services/cart.service'; // عدل المسار حسب مكان الخدمة

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() book!: Book;

  constructor(private cartService: CartService) {}

  addToWishlist() {
    console.log('Added to wishlist:', this.book.id);
  }

  addToCart() {
    this.cartService.addToCart(this.book.id).subscribe({
      next: (response) => {
        console.log('Added to cart:', this.book.id, response);
        // هنا ممكن تضيف alert أو توست تخبر المستخدم
      },
      error: (error) => {
        console.error('Failed to add to cart', error);
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getDiscountedPrice(price: number, discount: number): number {
    return price - (price * discount / 100);
  }
}
