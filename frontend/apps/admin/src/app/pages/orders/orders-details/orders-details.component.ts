import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order, OrdersService } from '@frontend/orders';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'admin-orders-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FieldsetModule,
        DropdownModule,
        FormsModule,
        ToastModule,
    ],
    templateUrl: './orders-details.component.html',
    styleUrl: './orders-details.component.scss',
})
export class OrdersDetailsComponent implements OnInit, OnDestroy {
    constructor(
        private ordersService: OrdersService,
        private router: ActivatedRoute,
        private messageService: MessageService
    ) {}

    order!: Order;
    statusOptions: { label: string; value: string }[] = [
        { label: 'Pending', value: '0' },
        { label: 'Processed', value: '1' },
        { label: 'Shipped', value: '2' },
        { label: 'Delivered', value: '3' },
        { label: 'Failed', value: '4' },
    ];
    primaryOrderStatus!: string;

    ngOnInit(): void {
        this._checkParams();
    }

    private _checkParams(): void {
        this.router.params.subscribe((params) => {
            if (params['orderId']) {
                this.ordersService
                    .getOrderById(params['orderId'])
                    .subscribe((order) => {
                        this.order = order;
                        this.primaryOrderStatus = this.order.status;
                    });
            }
        });
    }

    onHandleOrderStatus(ev: DropdownChangeEvent) {
        let newStatusOptionLabel: string | null = null;

        const statusOption = this.statusOptions.find(
            (option) => option.value === ev.value
        );

        if (statusOption) {
            newStatusOptionLabel = statusOption.label;
            this.order.status = ev.value;
            this._updateOrder(newStatusOptionLabel);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'The order status cannot be changed!',
            });
            console.error('Cannot change order status');
        }
    }

    private _updateOrder(newStatusOptionLabel: string): void {
        this.ordersService.editOrder(this.order).subscribe({
            next: (updatedOrder) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `The order status changed to "${newStatusOptionLabel}"`,
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `The order status cannot be changed to "${newStatusOptionLabel}"`,
                });
                this.order.status = this.primaryOrderStatus;
                console.error('Cannot change order status', err);
            },
        });
    }

    ngOnDestroy(): void {}
}
