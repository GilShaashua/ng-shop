import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSearchComponent, ProductsService } from '@frontend/products';
import { RouterModule } from '@angular/router';
import { CartComponent, CartItem, CartService } from '@frontend/orders';
import { Subject, firstValueFrom, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'ngshop-header',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ProductsSearchComponent,
        CartComponent,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    host: { class: 'full component-layout header-host' },
})
export class HeaderComponent implements OnInit {
    constructor(
        private cartService: CartService,
        private productsService: ProductsService
    ) {}

    cart!: CartItem[] | null;
    endSubs$ = new Subject();
    isCartShown = false;
    totalPrice = 0;
    cartCount = 0;

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
                takeUntil(this.endSubs$)
            )
            .subscribe({
                next: (cart) => {
                    this.cart = cart;
                    this.cartCount = cart?.length || 0;
                    this._getCartTotal();
                },
                error: (err) => {
                    console.error('Cannot get cart', err);
                },
            });
    }

    private _getCartTotal() {
        if (this.cart) {
            this.totalPrice = this.cart.reduce((acc, cartItem) => {
                return acc + cartItem.product.price * cartItem.quantity;
            }, 0);
        }
    }

    ngOnDestroy(): void {
        this.endSubs$.next(null);
        this.endSubs$.complete();
    }
}
