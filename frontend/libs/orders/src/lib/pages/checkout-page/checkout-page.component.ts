import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { UsersService } from '@frontend/users';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { Subject, firstValueFrom, switchMap, takeUntil } from 'rxjs';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ProductsService } from '@frontend/products';

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
        private formBuilder: FormBuilder,
        private route: ActivatedRoute
    ) {}

    countries!: { id: string; name: string }[];
    cart!: CartItem[];
    subscriptionSubject = new Subject();
    totalPrice = 0;
    isSubmitted = false;

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
    userId!: string;

    ngOnInit(): void {
        this._getCountries();
        this._getCart();
        this._checkParams();
    }

    onPlaceOrder() {
        this.isSubmitted = true;
        if (this.form.invalid) return;
        console.log('Place Order !');
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
                    console.log(cart);
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
                        this.userId = user.id!;
                        this.form.patchValue(user);
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
