import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_BASE = `${environment.apiBase}`;

@Injectable({
  providedIn: 'root'
})
export class OrderAdminService {
  constructor(private http: HttpClient) { }

  // Get all orders
  getAllOrders(
    page: number = 1,
    limit: number = 10,
    filters: {
      search?: string;
      status?: string;
      paymentStatus?: string;
      paymentMethod?: string;
    } = {}
  ): Observable<any> {
    const params: any = {
      page,
      limit,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status }),
      ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
      ...(filters.paymentMethod && { paymentMethod: filters.paymentMethod }),
    };

    const queryString = new URLSearchParams(params).toString();
    return this.http.get(`${API_BASE}/orders/admin/all?${queryString}`);
  }

  updateOrderStatus(orderId: string, data: { orderStatus: string }): Observable<any> {
    return this.http.put(`${API_BASE}/orders/${orderId}/status`, data);
  }

  updatePaymentStatus(orderId: string, body: { paymentStatus: string }) {
    return this.http.put<{ success: boolean; data: any }>(`${API_BASE}/orders/${orderId}/payment-status`, body);
  }
}
