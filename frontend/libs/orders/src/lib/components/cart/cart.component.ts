import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartItem } from '../../models/cart-item.model';

@Component({
    selector: 'orders-cart',
    standalone: true,
    imports: [CommonModule, CartItemComponent],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss',
    host: { class: 'cart-host' },
})
export class CartComponent {
    @Input() cart!: CartItem[];
    @Input() isCartShown!: boolean;
    @Input() totalPrice!: number;
    @Output() onCloseCart = new EventEmitter();
    @Output() onCheckout = new EventEmitter();
}
