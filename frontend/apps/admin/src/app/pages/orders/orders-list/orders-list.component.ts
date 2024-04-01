import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Column } from '@frontend/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { map } from 'rxjs';
import { Order, OrdersService } from '@frontend/orders';
import { User } from '@frontend/users';
import { TagModule } from 'primeng/tag';

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
        private ordersService: OrdersService
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
            color: 'primary',
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
    // urlChangesSubscription!: Subscription;

    ngOnInit() {
        this.getOrders();
        // this.listenUrlChanges();
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

    // listenUrlChanges() {
    //     this.urlChangesSubscription = this.router.events
    //         .pipe(filter((event) => event instanceof NavigationEnd))
    //         .subscribe({
    //             next: () => {
    //                 this.getOrders();
    //             },
    //             error: (err) => {
    //                 console.error('Cannot get url changes!', err);
    //             },
    //         });
    // }

    ngOnDestroy(): void {
        // this.urlChangesSubscription?.unsubscribe();
    }
}
