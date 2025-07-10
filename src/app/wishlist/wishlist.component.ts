import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, WishlistItem } from '../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  selectedAction: string = '';
  allSelected: boolean = false;
  loading: boolean = true;
  error: string = '';

  constructor(
    private productService: ProductService,
    private route: Router,
    private cartService: CartService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.getWishlist().subscribe({
      next: (products: WishlistItem[]) => {
        this.wishlistItems = products;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      },
    });
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    this.wishlistItems.forEach((item) => (item.selected = this.allSelected));
  }

  updateSelectAll(): void {
    this.allSelected = this.wishlistItems.every((item) => item.selected);
  }

  addToCart(item: WishlistItem): void {
    if (!item.inStock) {
      this.toastr.warning(
        `${item.name} is currently out of stock.`,
        'Out of Stock'
      );
      return;
    }

    this.cartService.addToCart({ bookId: item.id, quantity: 1 }).subscribe({
      next: () => {
        this.toastr.success('Added to cart!', item.name);
        this.cartService.refreshCart();
      },
      error: (error) => {
        this.toastr.error(
          error.error?.message || `Failed to add "${item.name}" to cart.`,
          'Error'
        );
        console.error('Add to cart failed:', error);
      },
    });
  }

  addSelectedToCart(): void {
    const selectedItems = this.wishlistItems.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      this.toastr.info('Please select at least one item.', 'No Selection');
      return;
    }

    selectedItems.forEach((item) => {
      if (!item.inStock) {
        this.toastr.warning(
          `"${item.name}" is out of stock. Skipping.`,
          'Out of Stock'
        );
        return;
      }

      this.cartService.addToCart({ bookId: item.id, quantity: 1 }).subscribe({
        next: () => {
          this.toastr.success(`"${item.name}" added to cart!`, 'Added');
          this.cartService.refreshCart();
        },
        error: (err) => {
          this.toastr.error(
            err.error?.message || `Failed to add "${item.name}"`,
            'Add Failed'
          );
          console.error(`Failed to add "${item.name}" to cart:`, err);
        },
      });
    });
  }

  applyAction(): void {
    if (this.selectedAction === 'addToCart') {
      this.addSelectedToCart();
    }
    this.selectedAction = '';
  }

  readMore(item: WishlistItem): void {
    this.route.navigate(['/product', item.id]);
  }

  retryLoading(): void {
    this.loadProducts();
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/placeholder.jpg';
  }

  deleteItem(item: WishlistItem): void {
    this.productService.removeFromWishlist(item.id).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(
          (wishlistItem) => wishlistItem.id !== item.id
        );
        this.updateSelectAll();
      },
      error: (err) => {
        console.error('Failed to delete from wishlist:', err);
      },
    });
  }
}
