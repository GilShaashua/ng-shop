import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    constructor(private http: HttpClient) {}

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>('http://localhost:3000/api/v1/orders');
    }

    getOrderById(orderId: string): Observable<Order> {
        return this.http.get<Order>(
            `http://localhost:3000/api/v1/orders/${orderId}`
        );
    }

    editCategory(order: Order): Observable<Order> {
        return this.http.put<Order>(
            `http://localhost:3000/api/v1/orders/${order.id}`,
            order
        );
    }

    deleteOrder(orderId: string): Observable<Order> {
        return this.http.delete<Order>(
            `http://localhost:3000/api/v1/orders/${orderId}`
        );
    }
}
