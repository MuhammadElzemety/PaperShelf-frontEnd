import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
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
    private http: HttpClient
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

    // جلب البيانات من localStorage
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
    cartItem.quantity++;
  }

  decreaseQuantity(cartItem: any) {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    }
  }

  updateQuantity(cartItem: any, event: any) {
    const newQuantity = +event.target.value;
    if (newQuantity >= 1) {
      cartItem.quantity = newQuantity;
    } else {
      event.target.value = cartItem.quantity; 
    }
  }

  deleteItem(itemId: string) {
    const url = `http://localhost:3000/api/cart/remove/${itemId}`;
    this.http.delete(url).subscribe({
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
