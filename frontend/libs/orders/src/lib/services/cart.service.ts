import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { BehaviorSubject } from 'rxjs';

const CART_KEY = 'cart';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    constructor() {
        this.initCartLocalStorage();
    }

    private _cart$: BehaviorSubject<CartItem[] | null> = new BehaviorSubject<
        CartItem[] | null
    >(null);

    public cart$ = this._cart$.asObservable();

    initCartLocalStorage() {
        const cart = this._getCart();

        if (!cart) {
            this._setCartItem([]);
        } else {
            this._setCartItem(cart);
        }
    }

    addCartItem(cartItem: CartItem) {
        const cart = this._getCart();

        if (cart) {
            if (cart.length) {
                const cartItemIdx = cart.findIndex(
                    (item) => item.product === cartItem.product
                );

                if (cartItemIdx === -1) {
                    cart.push(cartItem);
                    this._setCartItem(cart);
                } else {
                    const cartItem = cart[cartItemIdx];
                    cartItem.quantity++;
                    cart.splice(cartItemIdx, 1, cartItem);
                    this._setCartItem(cart);
                }
            } else {
                cart.push(cartItem);
                this._setCartItem(cart);
            }
        }
    }

    get cartCount() {
        if (this._cart$.value) {
            return this._cart$.value.length;
        }

        return null;
    }

    private _setCartItem(cart: CartItem[]) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        this._cart$.next(cart);
    }

    private _getCart(): CartItem[] | null {
        return JSON.parse(localStorage.getItem(CART_KEY)!);
    }
}
