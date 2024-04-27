import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';

@Component({
    selector: 'orders-cart-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cart-item.component.html',
    styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
    @Input() cartItem!: CartItem;
}
