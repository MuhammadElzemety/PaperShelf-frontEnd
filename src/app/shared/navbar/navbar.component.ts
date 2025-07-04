import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule , FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  role: string | null = null;
  name: string | null = null;
  getcart: any = { items: [], totalAmount: 0 };
  private userSub!: Subscription;
  private cartInstance: any;

  @ViewChild('cartSidebar') cartSidebar!: ElementRef;

  constructor(
    public linkserv: AuthService,
    private logoutserv: RoleService,
    private _roleser: RoleService,
    private _getcart: CartService,
  ) {}

  ngOnInit(): void {
    this.userSub = this._roleser.userChanged.subscribe(user => {
      if (user) {
        this.role = user.role;
        this.name = user.name;
      } else {
        this.role = null;
        this.name = null;
      }
    });

    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.role = user.role;
      this.name = user.name;
    }

    this.loadCart();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  loadCart() {
    this._getcart.getCart().subscribe(
      (response: any) => {
        this.getcart = response.data || { items: [], totalAmount: 0 };
        this.updateCartTotal();
        console.log('Cart items:', this.getcart);
      },
      (error) => {
        console.error('Error fetching cart items:', error);
        this.getcart = { items: [], totalAmount: 0 };
      }
    );
  }

  toggleCart() {
    if (!this.cartInstance) {
      this.cartInstance = new bootstrap.Offcanvas(this.cartSidebar.nativeElement);
    }

    if (this.cartSidebar.nativeElement.classList.contains('show')) {
      this.cartInstance.hide();
    } else {
      this.cartInstance.show();
    }
  }

  increaseQuantity(cartItem: any) {
    if (cartItem.quantity < 10) {
      cartItem.quantity++;
      this.updateCartItem(cartItem);
    }
  }

  decreaseQuantity(cartItem: any) {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      this.updateCartItem(cartItem);
    }
  }

  updateQuantity(cartItem: any, event: any) {
    let newQuantity = +event.target.value;
    if (newQuantity < 1) newQuantity = 1;
    else if (newQuantity > 10) newQuantity = 10;
    cartItem.quantity = newQuantity;
    event.target.value = newQuantity;
    this.updateCartItem(cartItem);
  }

  updateCartItem(cartItem: any) {
    this._getcart.updateCartItemQuantity(cartItem._id, cartItem.quantity).subscribe({
      next: () => {
        this.updateCartTotal();
      },
      error: (err) => {
        console.error('Error updating cart item:', err);
        this.loadCart();
      }
    });
  }

  updateCartTotal() {
    this.getcart.totalAmount = this.getcart.items.reduce(
      (sum: number, item: any) => sum + (item.priceAtTime * item.quantity),
      0
    );
    // تحديث الكائن لجعل Angular يعيد التحقق من التغييرات
    this.getcart = { ...this.getcart, items: [...this.getcart.items] };
  }

  deleteItem(itemId: string) {
    this._getcart.removeCartItem(itemId).subscribe({
      next: () => {
        this.getcart.items = this.getcart.items.filter((item: any) => item._id !== itemId);
        this.loadCart();
      },
      error: (err) => {
        console.error('Error deleting item:', err);
      }
    });
  }

  logout() {
    this.logoutserv.logout();
  }
}
