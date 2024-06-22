import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrdersService } from '@frontend/shared';
import { Subscription, firstValueFrom } from 'rxjs';
import { Order, OrderItem } from '@frontend/utils';

@Component({
    selector: 'orders-thank-you',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterModule],
    templateUrl: './thank-you.component.html',
    styleUrl: './thank-you.component.scss',
})
export class ThankYouComponent implements OnInit, OnDestroy {
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
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
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    trackByOrderItem(index: number, orderItem: OrderItem) {
        return orderItem.id;
    }

    ngOnDestroy(): void {
        this.paramsSubs?.unsubscribe();
    }
}
