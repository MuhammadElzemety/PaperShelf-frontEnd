import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  cartData: any = { items: [], totalAmount: 0 };
  checkoutForm: FormGroup;
  apiURL = 'http://localhost:3000/api/checkout/process';

  constructor(
    private _cartService: CartService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.checkoutForm = this.fb.group({
      shippingAddress: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
        address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
        city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        country: ['Egypt', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
      }),
      paymentMethod: ['cash_on_delivery', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this._cartService.cart$.subscribe(cart => this.cartData = cart);
    this._cartService.refreshCart();
  }

  // ✅ This is the corrected getter
  get shippingAddress(): FormGroup {
    return this.checkoutForm.get('shippingAddress') as FormGroup;
  }

  get selectedPaymentMethod(): string {
    return this.checkoutForm.get('paymentMethod')?.value;
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      console.error('Form is invalid');
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const payload = this.checkoutForm.value;
    console.log('Final payload being sent to server:', JSON.stringify(payload, null, 2));

    this.http.post(this.apiURL, payload).subscribe({
      next: (response) => {
        console.log('Order placed successfully!', response);
        alert('Order placed successfully!');
      },
      error: (error) => {
        console.error('Error placing order:', error);
        const serverError = error.error?.message || 'Failed to place order. Please try again.';
        alert(serverError);
      }
    });
  }

  proceedToPayPal(): void {
    alert('Redirecting to PayPal...');
    // You can add logic here to save the form before redirecting, for example:
    // if (this.checkoutForm.valid) { this.onSubmit(); }
  }
}