import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductItemComponent } from '../../components/product-item/product-item.component';
import { CartItem, Category, Product } from '@frontend/utils';
import { FormsModule } from '@angular/forms';
import { Subscription, firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {
    CartService,
    CategoriesService,
    ProductsService,
} from '@frontend/shared';

@Component({
    selector: 'products-products-list',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
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
export class ProductsListComponent implements OnInit, OnDestroy {
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private productsService: ProductsService,
        private categoriesService: CategoriesService,
        private route: ActivatedRoute,
        private cartService: CartService,
        private messageService: MessageService
    ) {}

    products!: { products: Product[]; pageCount: number };
    categories!: Category[];
    selectedCategories: { [key: string]: boolean | string } = {};
    filterBy!: { categories: string[]; name: string };
    isParamsInited = false;
    categoryId = '';
    filterBySubscription!: Subscription;
    isFirstInit = true;
    isLoading!: boolean;

    ngOnInit(): void {
        this._getFilterBy();
        this._getCategories();
        this._observeProductsLoading();
    }

    private _observeProductsLoading() {
        this.productsService.isNgShopProductsLoading$.subscribe({
            next: (isLoading) => {
                this.isLoading = isLoading;
                this.changeDetectorRef.markForCheck();
            },
        });
    }

    private _getFilterBy() {
        this.filterBySubscription = this.productsService.filterBy$.subscribe({
            next: (filterBy) => {
                this.filterBy = filterBy;
            },
        });
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
                this.changeDetectorRef.markForCheck();
                this._checkParams();
            },
            error: (err) => {
                console.error('Cannot get categories', err);
            },
        });
    }

    private _getProducts() {
        this.productsService.getProducts();

        if (this.isFirstInit) {
            this.isFirstInit = false;

            this.productsService.products$.subscribe({
                next: (products) => {
                    this.products = products;
                    this.changeDetectorRef.markForCheck();
                },
                error: (err) => {
                    console.error('Cannot get products', err);
                },
            });
        }
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
        this.filterBy.categories = [];
        this.productsService.setFilterBy(this.filterBy);

        // Add selected categories ids to filterBy['categories] array
        for (const key in this.selectedCategories) {
            if (this.selectedCategories[key]) {
                this.filterBy.categories.push(
                    this.selectedCategories[key] as string
                );
                this.productsService.setFilterBy(this.filterBy);
            }
        }

        this._getProducts();
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

    trackByCategory(index: number, category: Category) {
        return category.id;
    }

    trackByProduct(index: number, product: Product) {
        return product.id;
    }

    ngOnDestroy(): void {
        this.productsService.setFilterBy({ categories: [], name: '' });
        this.filterBySubscription?.unsubscribe();
    }
}
