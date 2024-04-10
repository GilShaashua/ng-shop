import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrdersService } from '@frontend/orders';
import { ProductsService } from '@frontend/products';
import { UsersService } from '@frontend/users';
import { combineLatest } from 'rxjs';

interface Statistic {
    ordersCount?: number;
    usersCount?: number;
    productsCount?: number;
    totalSales?: number;
}

@Component({
    selector: 'admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
    constructor(
        private ordersService: OrdersService,
        private usersService: UsersService,
        private productsService: ProductsService
    ) {}

    statistics!: Statistic[];

    ngOnInit(): void {
        combineLatest([
            this.ordersService.getOrdersCount(),
            this.usersService.getUsersCount(),
            this.productsService.getProductsCount(),
            this.ordersService.getTotalSales(),
        ]).subscribe({
            next: (res) => {
                this.statistics = res;
            },
        });
    }
}
