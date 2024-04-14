import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'products-product-details',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
    constructor(
        private productsService: ProductsService,
        private route: ActivatedRoute
    ) {}

    product!: Product;
    productItem: { quantity: number; product: Product | null } = {
        quantity: 1,
        product: null,
    };

    ngOnInit(): void {
        this._getParams();
    }

    private _getParams(): void {
        this.route.params.subscribe({
            next: (params) => {
                if (params['productId']) {
                    this._getProductById(params['productId']);
                }
            },
            error: (err) => {
                console.error('Cannot get params', err);
            },
        });
    }

    private _getProductById(productId: string) {
        this.productsService.getProductById(productId).subscribe((product) => {
            this.product = product;
            this.productItem.product = product;

            console.log('product', this.product);
            console.log('productItem', this.productItem);
        });
    }

    log() {
        console.log('productItem', this.productItem);
    }
}
