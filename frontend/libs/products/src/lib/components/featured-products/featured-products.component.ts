import { Component, OnInit } from '@angular/core';
import { ProductItemComponent } from '../product-item/product-item.component';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'products-featured-products',
    standalone: true,
    imports: [CommonModule, ProductItemComponent],
    templateUrl: './featured-products.component.html',
    styleUrl: './featured-products.component.scss',
    host: { class: 'component-layout featured-products-host' },
})
export class FeaturedProductsComponent implements OnInit {
    constructor(private productsService: ProductsService) {}

    products!: Product[];

    ngOnInit(): void {
        this._getFeaturedProducts(4);
    }

    private _getFeaturedProducts(count: number) {
        this.productsService.getFeaturedProducts(count).subscribe({
            next: (products) => {
                this.products = products;
            },
            error: (err) => {
                console.error('Cannot get featured products', err);
            },
        });
    }
}
