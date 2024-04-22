import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Subject, firstValueFrom, switchMap, takeUntil } from 'rxjs';
import { ProductsService } from '@frontend/products';
import { CartItem } from '../../models/cart-item.model';

@Component({
    selector: 'orders-cart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss',
    host: { class: 'cart-host' },
})
export class CartComponent implements OnInit, OnDestroy {
    constructor(
        private cartService: CartService,
        private productsService: ProductsService
    ) {}

    cart!: CartItem[] | null;
    subscriptionSubject$ = new Subject();

    ngOnInit(): void {
        this._getCart();
    }

    private _getCart() {
        this.cartService.cart$
            .pipe(
                switchMap(async (cart) => {
                    if (cart) {
                        const modifiedCart = cart.map(async (cartItem) => {
                            const product$ =
                                this.productsService.getProductById(
                                    cartItem.product as unknown as string
                                );
                            const product = await firstValueFrom(product$);
                            const modifiedCartItem: CartItem = {
                                product: product,
                                quantity: cartItem.quantity,
                            };
                            return modifiedCartItem;
                        });

                        return await Promise.all(modifiedCart);
                    }

                    return null;
                }),
                takeUntil(this.subscriptionSubject$)
            )
            .subscribe({
                next: (cart) => {
                    this.cart = cart;
                },
                error: (err) => {
                    console.error('Cannot get cart', err);
                },
            });
    }

    ngOnDestroy(): void {
        this.subscriptionSubject$.next(null);
        this.subscriptionSubject$.complete();
    }
}
