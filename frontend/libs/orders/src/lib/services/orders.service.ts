import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
import { enviroment } from 'enviroments/enviromet';

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    constructor(private http: HttpClient) {}

    apiUrl = enviroment.apiUrl;

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}orders`);
    }

    getOrderById(orderId: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}orders/${orderId}`);
    }

    editOrder(order: Order): Observable<Order> {
        return this.http.put<Order>(`${this.apiUrl}orders/${order.id}`, order);
    }

    deleteOrder(orderId: string): Observable<Order> {
        return this.http.delete<Order>(`${this.apiUrl}orders/${orderId}`);
    }

    getOrdersCount(): Observable<{ ordersCount: number }> {
        return this.http.get<{ ordersCount: number }>(
            `${this.apiUrl}orders/get/count`
        );
    }

    getTotalSales(): Observable<{ totalSales: number }> {
        return this.http.get<{ totalSales: number }>(
            `${this.apiUrl}orders/get/total-sales`
        );
    }
}
