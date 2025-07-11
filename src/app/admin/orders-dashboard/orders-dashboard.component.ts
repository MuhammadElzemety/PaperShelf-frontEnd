import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OrderAdminService } from '../../services/order-admin.service';
import { environment } from '../../../environments/environment';

const API_IMG = environment.apiUrlForImgs;
@Component({
  selector: 'app-orders-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.css']
})
export class OrdersDashboardComponent implements OnInit {
  orders: any[] = [];
  isLoading = false;
  pagination: any;
  currentPage = 1;
  limit = 10;
  img_url = API_IMG;
  selectedOrder: any = null;

  searchControl = new FormControl('');
  statusFilter = new FormControl(null);
  paymentStatusFilter = new FormControl(null);
  paymentMethodFilter = new FormControl(null);

  loadingOrderIds: string[] = [];

  loadingPaymentIds: string[] = [];



  alert = {
    type: '',
    message: '',
    show: false
  };
  @ViewChild('orderModal') orderModal!: ElementRef;

  constructor(private orderService: OrderAdminService) { }

  showAlert(type: 'success' | 'error', message: string): void {
    this.alert.type = type;
    this.alert.message = message;
    this.alert.show = true;
    setTimeout(() => this.alert.show = false, 3000);
  }


  onSelectOrder(order: any): void {
    this.selectedOrder = order;
  }

  closeModal() {
    const modalEl = this.orderModal?.nativeElement;
    if (modalEl?.classList.contains('show')) {
      modalEl.classList.remove('show');
      modalEl.style.display = 'none';
      modalEl.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      backdrop?.remove();
    }
  }

  ngOnInit(): void {
    this.loadOrders();

    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.loadOrders());

    this.statusFilter.valueChanges.subscribe(() => this.loadOrders());
    this.paymentStatusFilter.valueChanges.subscribe(() => this.loadOrders());
    this.paymentMethodFilter.valueChanges.subscribe(() => this.loadOrders());
  }

  onSearch() { }

  loadOrders(): void {
    this.isLoading = true;

    const filters = {
      search: this.searchControl.value?.trim() || undefined,
      status: this.statusFilter.value || undefined,
      paymentStatus: this.paymentStatusFilter.value || undefined,
      paymentMethod: this.paymentMethodFilter.value || undefined,
    };

    this.orderService.getAllOrders(this.currentPage, this.limit, filters).subscribe({
      next: (res) => {
        this.orders = res.data?.orders ?? res.orders;
        this.pagination = res.data?.pagination ?? res.pagination;
      },
      error: (err) => console.error('Load orders failed:', err),
      complete: () => (this.isLoading = false),
    });
    
  }


  loadPage(page: number): void {
    const totalPages = this.pagination?.totalPages || 1;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    this.currentPage = page;
    this.loadOrders();
  }

  changeOrderStatus(order: any, status: string) {
    this.loadingOrderIds.push(order.orderId);

    this.orderService.updateOrderStatus(order.orderId, { orderStatus: status }).subscribe({
      next: (res) => {
        order.statusOfOrder = res.data.orderStatus; 
        this.showAlert('success', 'Order status updated successfully.');
      },
      error: (err) => {
        this.showAlert('error', 'Failed to update order status.');
        console.error(err);
      },
      complete: () => {
        this.loadingOrderIds = this.loadingOrderIds.filter(id => id !== order.orderId);
      }
    });
  }

  changePaymentStatus(order: any, status: string) {
    this.loadingPaymentIds.push(order.orderId);
  
    this.orderService.updatePaymentStatus(order.orderId, { paymentStatus: status }).subscribe({
      next: (res) => {
        order.paymentStatus = res.data.paymentStatus;
        this.showAlert('success', 'Payment status updated');
      },
      error: (err) => {
        this.showAlert('error', 'Failed to update payment status');
        console.error(err);
      },
      complete: () => {
        this.loadingPaymentIds = this.loadingPaymentIds.filter(id => id !== order.orderId);
      }
    });
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.statusFilter.setValue(null);
    this.paymentStatusFilter.setValue(null);
    this.paymentMethodFilter.setValue(null);
    this.currentPage = 1;
    this.loadOrders();
  }

}

