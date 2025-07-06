import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Book } from '../../interfaces/book';

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

  addToCart() {
    this.cartService.addToCart(this.book.id).subscribe({
      next: () => {
        this.cartService.refreshCart();
      },
      error: (error) => {
        console.error('Failed to add to cart', error);
      }
    });
  }

  addToWishlist() {
    console.log('Added to wishlist:', this.book.id);
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getDiscountedPrice(price: number, discount: number): number {
    return price - (price * discount / 100);
  }
  openCart() {
    this.cartService.toggleCart();
  }
}
