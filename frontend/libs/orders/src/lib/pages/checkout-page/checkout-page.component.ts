import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { User, UsersService } from '@frontend/users';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { Subject, firstValueFrom, switchMap, takeUntil } from 'rxjs';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Product, ProductsService } from '@frontend/products';
import { Order } from '../../models/order.model';
import { OrderItem } from '../../models/order-item.model';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'orders-checkout-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DropdownModule, ReactiveFormsModule],
    templateUrl: './checkout-page.component.html',
    styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
    constructor(
        private usersService: UsersService,
        private cartService: CartService,
        private productsService: ProductsService,
        private ordersService: OrdersService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    countries!: { id: string; name: string }[];
    cart!: CartItem[];
    subscriptionSubject = new Subject();
    totalPrice = 0;
    isSubmitted = false;
    userId!: string;
    isProccessing = false;

    form: FormGroup = this.formBuilder.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        street: ['', [Validators.required]],
        apartment: ['', [Validators.required]],
        zip: ['', [Validators.required]],
        city: ['', [Validators.required]],
        country: ['', [Validators.required]],
    });

    ngOnInit(): void {
        this._getCountries();
        this._getCart();
        this._checkParams();
    }

    onPlaceOrder() {
        this.isSubmitted = true;
        if (this.form.invalid) return;
        if (!this.cart.length) {
            this.router.navigateByUrl('/');
            return;
        }

        this.isProccessing = true;

        const orderItems: OrderItem[] = this.cart.map((cartItem) => {
            return {
                id: '',
                product: cartItem.product.id as unknown as Product,
                quantity: cartItem.quantity,
            };
        });

        const order: Order = {
            id: '',
            orderItems,
            shippingAddress1: this.controlsForm['street'].value,
            shippingAddress2: this.controlsForm['apartment'].value,
            city: this.controlsForm['city'].value,
            zip: this.controlsForm['zip'].value,
            country: this.controlsForm['country'].value,
            phone: this.controlsForm['phone'].value,
            status: '0',
            user: (this.userId ||
                '66424b69b7ec423fca98a2a1') as unknown as User,
            dateOrdered: Date.now() + '',
        };

        this.ordersService.addOrder(order).subscribe({
            next: (addedOrder) => {
                this.cartService.clearCart();
                this.router.navigateByUrl(`thank-you/${addedOrder.id}`);
            },
            error: (err) => {
                console.error('Cannot add order', err);
            },
        });
    }

    private _getCountries() {
        const countries = this.usersService.getCountries();
        this.countries = countries;
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
                takeUntil(this.subscriptionSubject)
            )
            .subscribe({
                next: (cart) => {
                    this.cart = cart || [];

                    if (!this.cart.length) {
                        this.router.navigateByUrl('/');
                        return;
                    }

                    this._getTotalPrice();
                },
                error: (err) => {
                    console.error('Cannot get cart', err);
                },
            });
    }

    private _checkParams() {
        this.route.params.pipe(takeUntil(this.subscriptionSubject)).subscribe({
            next: async (params) => {
                if (params['userId']) {
                    try {
                        const user = await firstValueFrom(
                            this.usersService.getUserById(params['userId'])
                        );

                        if (user) {
                            this.userId = user.id!;
                            this.form.patchValue(user);
                        }
                    } catch (err) {
                        console.error('Cannot get user', err);
                    }
                }
            },
            error: (err) => {
                console.error('Cannot get params', err);
            },
        });
    }

    private _getTotalPrice() {
        this.totalPrice = this.cart.reduce((acc, cartItem) => {
            return acc + cartItem.product.price * cartItem.quantity;
        }, 0);
    }

    get controlsForm() {
        return this.form.controls;
    }

    ngOnDestroy(): void {
        this.subscriptionSubject.next(null);
        this.subscriptionSubject.complete();
    }
}
