import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '@frontend/utils';
import { environment } from '@frontend/utils';

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    constructor(private http: HttpClient) {}

    apiUrl = environment.API_URL;

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}orders`);
    }

    getOrderById(orderId: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}orders/${orderId}`);
    }

    addOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}orders`, order);
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

    getOrderStatistics({
        dateOrdered,
    }: {
        dateOrdered: string;
    }): Observable<{ ordersMap: { [key: string]: number }; years: number[] }> {
        const params = new HttpParams().set('dateOrdered', dateOrdered);

        return this.http.get<{
            ordersMap: { [key: string]: number };
            years: number[];
        }>(`${this.apiUrl}orders/get/statistics`, { params });
    }
}
