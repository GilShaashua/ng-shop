import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartItem, Product } from '@frontend/utils';
import { CommonModule, Location } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { DomSanitizer } from '@angular/platform-browser';
import { CartService, ProductsService } from '@frontend/shared';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GalleryComponent } from '@frontend/ui';

@Component({
    selector: 'products-product-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        RatingModule,
        GalleryComponent,
        ToastModule,
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
        private router: Router,
        private cartService: CartService,
        private formBuilder: FormBuilder,
        private messageService: MessageService
    ) {}

    product!: Product;

    productItemRF: FormGroup = this.formBuilder.group({
        quantity: [
            1,
            [Validators.required, Validators.max(100), Validators.min(1)],
        ],
        product: [null, [Validators.required]],
    });

    isSanitizerProccessing = true;

    ngOnInit(): void {
        this._getParams();
    }

    goBack() {
        this.location.back();
    }

    onAddCartItem() {
        if (this.productItemRF.invalid) return;

        const cartItem: CartItem = {
            product: this.productItemRF.value.product?.id as unknown as Product,
            quantity: this.productItemRF.value.quantity,
        };

        this.cartService.addCartItem(cartItem);
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product added to cart',
        });
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
                this.controls['product'].patchValue(product);

                this._sanitizer();
            },
            error: (err) => {
                console.error('Cannot get product', err);
                this.router.navigateByUrl('/');
            },
        });
    }

    get controls() {
        return this.productItemRF.controls;
    }
}
