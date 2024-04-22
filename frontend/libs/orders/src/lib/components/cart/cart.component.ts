import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../models/cart-item.model';

@Component({
    selector: 'orders-cart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss',
    host: { class: 'cart-host' },
})
export class CartComponent {
    @Input() cart!: CartItem[];
}
