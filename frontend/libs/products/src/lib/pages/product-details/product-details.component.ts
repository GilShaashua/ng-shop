import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { DomSanitizer } from '@angular/platform-browser';
import { GalleryComponent } from '@frontend/ui';

@Component({
    selector: 'products-product-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        RatingModule,
        GalleryComponent,
    ],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
    constructor(
        private productsService: ProductsService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private location: Location,
        private router: Router
    ) {}

    product!: Product;

    productItem: { quantity: number; product: Product | null } = {
        quantity: 1,
        product: null,
    };

    isSanitizerProccessing = true;

    ngOnInit(): void {
        this._getParams();
    }

    goBack() {
        this.location.back();
    }

    private _sanitizer() {
        this.product.description = this.sanitizer.bypassSecurityTrustHtml(
            this.product.description!
        ) as string;

        this.product.richDescription = this.sanitizer.bypassSecurityTrustHtml(
            this.product.richDescription!
        ) as string;

        this.isSanitizerProccessing = false;
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
        this.productsService.getProductById(productId).subscribe({
            next: (product) => {
                this.product = product;
                this.productItem.product = product;

                this._sanitizer();
            },
            error: (err) => {
                console.error('Cannot get product', err);
                this.router.navigateByUrl('/');
            },
        });
    }

    log() {
        console.log('productItem', this.productItem);
    }
}
