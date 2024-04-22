import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSearchComponent } from '@frontend/products';
import { RouterModule } from '@angular/router';
import { CartComponent, CartService } from '@frontend/orders';

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
    constructor(private cartService: CartService) {}
    isCartShown = false;
    cartCount = 0;

    ngOnInit(): void {
        this.cartService.cart$.subscribe({
            next: (cart) => {
                this.cartCount = this.cartService.cartCount || 0;
            },
        });
    }
}
