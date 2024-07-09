import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    RouterModule,
} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { filter, map, Subscription } from 'rxjs';
import { Category, Column, Product } from '@frontend/utils';
import { ProductsService, ViewportSizeService } from '@frontend/shared';

@Component({
    selector: 'admin-product-list',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule,
        TableModule,
    ],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
    constructor(
        private confirmationService: ConfirmationService,
        private productsService: ProductsService,
        private messageService: MessageService,
        private router: Router,
        private viewportSizeService: ViewportSizeService,
        private changeDetectorRef: ChangeDetectorRef,
        private route: ActivatedRoute
    ) {}

    cols: Column[] = [
        { field: 'name', header: 'Name' },
        { field: 'image', header: 'Image' },
        { field: 'price', header: 'Price' },
        { field: 'countInStock', header: 'Stock' },
        { field: 'category', header: 'Category' },
        { field: 'dateCreated', header: 'Created at' },
    ];
    products!: Product[];
    urlChangesSubscription!: Subscription;
    isDesktop!: boolean;
    viewportSubscription!: Subscription;
    queryParamsSubscription!: Subscription;
    productsSubscription!: Subscription;
    currPage = '1';
    pageSize = '10';
    pageCount!: number;
    isFirstOnInit = true;
    isLoading = false;

    ngOnInit(): void {
        this._observeProducts();
        this._observeViewportSize();
        this.listenUrlChanges();

        if (!this.isDesktop) {
            this._observeQueryParams();
            this.setQueryParams({ currPage: this.currPage });
        }

        if (this.isDesktop) {
            this._observeQueryParams();
        }
    }

    private _observeQueryParams() {
        this.queryParamsSubscription = this.route.queryParams.subscribe(
            (params) => {
                this.currPage = params['currPage'] || this.currPage;
                this.pageSize = params['pageSize'] || this.pageSize;

                this.getProducts();
            }
        );
    }

    setQueryParams(queryParams: { currPage?: string; pageSize?: string } = {}) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                currPage: queryParams.currPage,
                pageSize:
                    queryParams.pageSize === ''
                        ? queryParams.pageSize
                        : this.pageSize,
            },
            queryParamsHandling: 'merge',
        });
    }

    private _observeViewportSize() {
        this.viewportSubscription = this.viewportSizeService.viewportWidth$
            .pipe(map((viewportWidth) => viewportWidth >= 1025))
            .subscribe((isDesktop) => {
                this.isDesktop = isDesktop;

                if (isDesktop)
                    this.setQueryParams({ currPage: '', pageSize: '' });
                else
                    this.setQueryParams({
                        currPage: this.currPage,
                        pageSize: this.pageSize,
                    });

                // this.changeDetectorRef.markForCheck();
            });
    }

    getProducts() {
        if (!this.isDesktop)
            this.productsService.getProducts({
                currPage: this.currPage,
                pageSize: this.pageSize,
            });
        else this.productsService.getProducts();
    }

    private _observeProducts() {
        this.productsSubscription = this.productsService.products$
            .pipe(
                map((products) => {
                    if (products instanceof Array && !products.length)
                        return [];

                    this.pageCount = (
                        products as { products: Product[]; pageCount: number }
                    ).pageCount;

                    return (products as { products: Product[] }).products.map(
                        (product) => {
                            return {
                                ...product,
                                category: product.category
                                    .name as unknown as Category,
                            };
                        }
                    );
                })
            )
            .subscribe({
                next: (products) => {
                    if (this.isFirstOnInit) {
                        this.isFirstOnInit = false;
                        return;
                    }

                    this.products = products;
                    this.isLoading = false;
                    this.changeDetectorRef.markForCheck();
                },
                error: (err) => {
                    console.error('Cannot get products', err);
                },
            });
    }

    onDeleteProduct(productId: string) {
        this.confirmationService.confirm({
            header: 'Delete Product',
            message: 'Are you sure you want to delete this Product?',
            accept: () => {
                this.productsService.deleteProduct(productId).subscribe({
                    next: (deletedProduct) => {
                        this.products = this.products.filter(
                            (product) => product.id !== deletedProduct.id
                        );

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: `The product "${deletedProduct.name}" is deleted successfully!`,
                        });

                        this.changeDetectorRef.markForCheck();
                    },
                    error: (err) => {
                        console.error('Cannot delete product', err);
                    },
                });
            },
            reject: () => {},
        });
    }

    listenUrlChanges() {
        let previousUrl = this.router.url.split('?')[0]; // Initialize with the current path ignoring query params

        this.urlChangesSubscription = this.router.events
            .pipe(
                filter(
                    (event): event is NavigationEnd =>
                        event instanceof NavigationEnd
                )
            )
            .subscribe({
                next: (event) => {
                    const currentUrl = event.url.split('?')[0];
                    if (currentUrl !== previousUrl) {
                        this.getProducts(); // Only call getProducts if the path has changed
                        previousUrl = currentUrl; // Update previousUrl for the next event
                    }
                },
                error: (err) => {
                    console.error('Cannot get url changes!', err);
                },
            });
    }

    trackByProductId(index: number, product: Product) {
        return product.id;
    }

    ngOnDestroy(): void {
        this.urlChangesSubscription?.unsubscribe();
        this.viewportSubscription?.unsubscribe();
        this.queryParamsSubscription?.unsubscribe();
        this.productsSubscription?.unsubscribe();
    }
}
