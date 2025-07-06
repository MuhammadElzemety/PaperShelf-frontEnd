import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common'; // استيراد CommonModule

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule], // إضافة CommonModule هنا
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  
  // متغير لتخزين بيانات السلة
  cartData: any = { items: [], totalAmount: 0 };

  // حقن (Inject) خدمة السلة في الكونستركتور
  constructor(private _cartService: CartService) {}

  ngOnInit(): void {
    // الاشتراك في Observable الخاص بالسلة للحصول على التحديثات
    this._cartService.cart$.subscribe(cart => {
      this.cartData = cart;
    });

    // يمكنك أيضاً طلب تحديث فوري للبيانات عند تحميل الصفحة
    this._cartService.refreshCart();
  }
}