import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { map } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { OrdersService, ViewportSizeService } from '@frontend/shared';
import { Column, Order, User } from '@frontend/utils';

@Component({
    selector: 'admin-orders-list',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        ConfirmDialogModule,
        RouterLink,
        TableModule,
        ToastModule,
        TagModule,
    ],
    templateUrl: './orders-list.component.html',
    styleUrl: './orders-list.component.scss',
})
export class OrdersListComponent implements OnInit, OnDestroy {
    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private ordersService: OrdersService,
        private viewportSizeService: ViewportSizeService
    ) {}

    cols: Column[] = [
        { field: 'user', header: 'User' },
        { field: 'totalPrice', header: 'Total price' },
        { field: 'dateOrdered', header: 'Date ordered' },
        { field: 'status', header: 'Status' },
    ];

    orderStatus: { [klass: string]: { label: string; color: string } } = {
        0: {
            label: 'Pending',
            color: 'contrast',
        },
        1: {
            label: 'Processed',
            color: 'warning',
        },
        2: {
            label: 'Shipped',
            color: 'info',
        },
        3: {
            label: 'Delivered',
            color: 'success',
        },
        4: {
            label: 'Failed',
            color: 'danger',
        },
    };

    orders!: Order[];
    isDesktop!: boolean;

    ngOnInit() {
        this._observeViewportSize();
        this.getOrders();
    }

    private _observeViewportSize() {
        this.viewportSizeService.viewportWidth$
            .pipe(map((viewportWidth) => viewportWidth >= 1025))
            .subscribe((isDesktop) => {
                this.isDesktop = isDesktop;
            });
    }

    getOrders() {
        this.ordersService
            .getOrders()
            .pipe(
                map((orders) => {
                    const modifiedOrders = orders.map((order) => ({
                        ...order,
                        user: order.user.name as User,
                    }));
                    return modifiedOrders;
                })
            )
            .subscribe({
                next: (orders) => {
                    this.orders = orders;
                },
                error: (err) => {
                    console.error('Cannot get orders', err);
                },
            });
    }

    onDeleteOrder(orderId: string) {
        this.confirmationService.confirm({
            header: 'Delete Order',
            message: 'Are you sure you want to delete this Order?',
            accept: () => {
                this.ordersService.deleteOrder(orderId).subscribe({
                    next: (deletedOrder) => {
                        this.orders = this.orders.filter(
                            (order) => order.id !== deletedOrder.id
                        );

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: `The order "${deletedOrder.id}" is deleted successfully!`,
                        });
                    },
                    error: (err) => {
                        console.error('Cannot delete order', err);
                    },
                });
            },
            reject: () => {},
        });
    }

    ngOnDestroy(): void {}
}
