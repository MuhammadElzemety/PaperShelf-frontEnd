import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Book } from '../../interfaces/book';
import { take } from 'rxjs';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() book!: Book;
  message: string = '';
  messageColor: 'success' | 'error' = 'success';

  constructor(private cartService: CartService) {}

  addToCart() {
  this.cartService.cart$.pipe(take(1)).subscribe(cart => {
    const totalItems = cart.items.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);

    if (totalItems >= 10) {
      this.showMessage('You cannot add more than 10 products to the cart.', 'error');
      return;
    }

    if (this.book.stock <= 0) {
      this.showMessage('This book is out of stock.', 'error');
      return;
    }

    this.cartService.addToCart(this.book.id).subscribe({
      next: () => {
        this.cartService.refreshCart();
        this.cartService.toggleCart();
        this.showMessage('Your Product added Successfuly', 'success');
      },
      error: (error) => {
        const message = error?.error?.message || 'فشل في الإضافة إلى السلة.';
        this.showMessage(message, 'error');
        console.error('فشل في الإضافة إلى السلة', error);
      }
    });
  });
}

showMessage(msg: string, type: 'success' | 'error') {
  this.message = msg;
  this.messageColor = type;
  setTimeout(() => {
    this.message = '';
  }, 4000); // تختفي بعد 4 ثواني
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
  
}
