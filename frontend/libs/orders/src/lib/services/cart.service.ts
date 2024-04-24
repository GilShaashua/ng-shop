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
            this._saveCart([]);
        } else {
            this._saveCart(cart);
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
                    this._saveCart(cart);
                } else {
                    const cartItemFromStorage = cart[cartItemIdx];
                    cartItemFromStorage.quantity =
                        cartItemFromStorage.quantity + cartItem.quantity;
                    cart.splice(cartItemIdx, 1, cartItemFromStorage);
                    this._saveCart(cart);
                }
            } else {
                cart.push(cartItem);
                this._saveCart(cart);
            }
        }
    }

    get cartCount() {
        if (this._cart$.value) {
            return this._cart$.value.length;
        }

        return null;
    }

    private _saveCart(cart: CartItem[]) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        this._cart$.next(cart);
    }

    private _getCart(): CartItem[] | null {
        return JSON.parse(localStorage.getItem(CART_KEY)!);
    }
}
