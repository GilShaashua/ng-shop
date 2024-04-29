import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'orders-cart-item',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cart-item.component.html',
    styleUrl: './cart-item.component.scss',
    host: { class: 'cart-item-host' },
})
export class CartItemComponent implements OnInit {
    constructor(
        private formBuilder: FormBuilder,
        private cartService: CartService
    ) {}

    @Input() cartItem!: CartItem;

    cartItemRF!: FormGroup;

    ngOnInit(): void {
        this.cartItemRF = this.formBuilder.group({
            quantity: [
                this.cartItem.quantity,
                [Validators.required, Validators.min(1), Validators.max(99)],
            ],
            product: [this.cartItem.product, [Validators.required]],
        });
    }

    get controls() {
        return this.cartItemRF.controls;
    }

    onChangeQuantity(productId: string) {
        if (this.cartItemRF.invalid) return;

        this.cartService.editCartItem(
            productId,
            this.controls['quantity'].value
        );
    }

    onDeleteCartItem(productId: string) {
        this.cartService.deleteCartItem(productId);
    }
}
