import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() book!: Book;

  addToWishlist() {
    console.log('Added to wishlist:', this.book.id);
  }

  addToCart() {
    console.log('Added to cart:', this.book.id);
  }
  getStars(rating: number): number[] {
  return Array(Math.round(rating)).fill(0);
 }
 getDiscountedPrice(price: number, discount: number): number {
  return price - (price * discount / 100);
 }


}
