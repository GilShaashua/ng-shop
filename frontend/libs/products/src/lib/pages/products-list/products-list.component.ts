import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductItemComponent } from '../../components/product-item/product-item.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CartItem, CartService } from '@frontend/orders';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'products-products-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ProductItemComponent,
        ToastModule,
    ],
    templateUrl: './products-list.component.html',
    styleUrl: './products-list.component.scss',
    host: { class: 'full component-layout' },
})
export class ProductsListComponent implements OnInit {
    constructor(
        private productsService: ProductsService,
        private categoriesService: CategoriesService,
        private route: ActivatedRoute,
        private cartService: CartService,
        private messageService: MessageService
    ) {}

    products!: Product[];
    categories!: Category[];
    selectedCategories: { [klass: string]: boolean | string } = {};
    filterBy: { [klass: string]: string[] } = { categories: [] };
    isParamsInited = false;
    categoryId = '';

    ngOnInit(): void {
        this._getCategories();
    }

    private _checkParams() {
        this.route.params.subscribe(async (params) => {
            if (params['categoryId']) {
                const category = await firstValueFrom(
                    this.categoriesService.getCategoryById(params['categoryId'])
                );
                this.selectedCategories[category.name.toLowerCase()] =
                    params['categoryId'];
                this.categoryId = params['categoryId'];
                this.isParamsInited = true;
                this.onChangeCategory();
            } else {
                this.isParamsInited = true;
                this._getProducts();
            }
        });
    }

    private _getCategories() {
        this.categoriesService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
                this.categories.forEach((category) => {
                    this.selectedCategories[category.name.toLowerCase()] =
                        false;
                });
                this._checkParams();
            },
            error: (err) => {
                console.error('Cannot get categories', err);
            },
        });
    }

    private _getProducts(filterBy?: string[]) {
        this.productsService.getProducts(filterBy).subscribe({
            next: (products) => {
                if (this.categoryId && this.isParamsInited) {
                    this.products = products;
                } else if (!this.categoryId && this.isParamsInited) {
                    this.products = products;
                }
            },
            error: (err) => {
                console.error('Cannot get products', err);
            },
        });
    }

    onChangeCategory() {
        // Modified selectedCategories values from booleans to ids
        for (const key in this.selectedCategories) {
            if (this.selectedCategories[key]) {
                const idx = this.categories.findIndex(
                    (category) => category.name.toLowerCase() === key
                );

                this.selectedCategories[key] = this.categories[idx].id;
            }
        }

        // Restart filterBy['categories'] array
        this.filterBy['categories'] = [];

        // Add selected categories ids to filterBy['categories] array
        for (const key in this.selectedCategories) {
            if (this.selectedCategories[key]) {
                this.filterBy['categories'].push(
                    this.selectedCategories[key] as string
                );
            }
        }

        this._getProducts(this.filterBy['categories']);
    }

    onAddProduct(productId: string) {
        const cartItem: CartItem = {
            product: productId as unknown as Product,
            quantity: 1,
        };

        this.cartService.addCartItem(cartItem);
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product added to cart',
        });
    }
}
