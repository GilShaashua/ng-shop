import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '@frontend/utils';
import { environment } from '@frontend/utils';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    apiUrl = environment.API_URL;

    getOrders(): Observable<Order[]> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.get<Order[]>(`${this.apiUrl}orders`, { params });
    }

    getOrderById(orderId: string): Observable<Order> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.get<Order>(`${this.apiUrl}orders/${orderId}`, {
            params,
        });
    }

    addOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}orders`, order);
    }

    editOrder(order: Order): Observable<Order> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.put<Order>(`${this.apiUrl}orders/${order.id}`, order, {
            params,
        });
    }

    deleteOrder(orderId: string): Observable<Order> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.delete<Order>(`${this.apiUrl}orders/${orderId}`, {
            params,
        });
    }

    getOrdersCount(): Observable<{ ordersCount: number }> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.get<{ ordersCount: number }>(
            `${this.apiUrl}orders/get/count`,
            { params }
        );
    }

    getTotalSales(): Observable<{ totalSales: number }> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.get<{ totalSales: number }>(
            `${this.apiUrl}orders/get/total-sales`,
            { params }
        );
    }

    getOrderStatistics({
        dateOrdered,
    }: {
        dateOrdered: string;
    }): Observable<{ ordersMap: { [key: string]: number } }> {
        let params = new HttpParams();
        params = params.append('dateOrdered', dateOrdered);
        params = params.append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.get<{
            ordersMap: { [key: string]: number };
        }>(`${this.apiUrl}orders/get/statistics`, { params });
    }

    getOrdersYears() {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.get<{ years: string[] }>(
            `${this.apiUrl}orders/get/years`,
            { params }
        );
    }

    getTotalSalesStatistics({
        dateOrdered,
    }: {
        dateOrdered: string;
    }): Observable<{ [key: string]: number }> {
        let params = new HttpParams().set('dateOrdered', dateOrdered);

        params = params.append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.get<{ [key: string]: number }>(
            `${this.apiUrl}orders/get/total-sales-statistics`,
            { params }
        );
    }
}
