import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { Order } from '../../models/order.model';

@Component({
    selector: 'orders-thank-you',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './thank-you.component.html',
    styleUrl: './thank-you.component.scss',
})
export class ThankYouComponent implements OnInit, OnDestroy {
    constructor(
        private route: ActivatedRoute,
        private ordersService: OrdersService
    ) {}

    order!: Order;
    paramsSubs!: Subscription;

    ngOnInit(): void {
        this._checkParams();
    }

    private _checkParams() {
        this.paramsSubs = this.route.params.subscribe(async (params) => {
            if (params['orderId']) {
                const order$ = this.ordersService.getOrderById(
                    params['orderId']
                );
                const order = await firstValueFrom(order$);
                this.order = order;
            }
        });
    }

    ngOnDestroy(): void {
        this.paramsSubs?.unsubscribe();
    }
}
