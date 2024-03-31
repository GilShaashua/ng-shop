import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order, OrdersService } from '@frontend/orders';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'admin-orders-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FieldsetModule,
        DropdownModule,
        FormsModule,
    ],
    templateUrl: './orders-details.component.html',
    styleUrl: './orders-details.component.scss',
})
export class OrdersDetailsComponent implements OnInit, OnDestroy {
    constructor(
        private ordersService: OrdersService,
        private router: ActivatedRoute
    ) {}

    order!: Order;
    orderStatuses: { label: string; value: string }[] = [
        { label: 'Pending', value: '0' },
        { label: 'Processed', value: '1' },
        { label: 'Shipped', value: '2' },
        { label: 'Delivered', value: '3' },
        { label: 'Failed', value: '4' },
    ];

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
                    });
            }
        });
    }

    ngOnDestroy(): void {}
}
