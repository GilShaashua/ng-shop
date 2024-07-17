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
import {
    debounceTime,
    filter,
    map,
    Subject,
    Subscription,
    takeUntil,
} from 'rxjs';
import { Category, Column, Product } from '@frontend/utils';
import { ProductsService, ViewportSizeService } from '@frontend/shared';
import { FormsModule } from '@angular/forms';

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
        FormsModule,
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
    isDesktop!: boolean;
    currPage = '1';
    pageSize = '10';
    pageCount!: number;
    isFirstOnInit = true;
    isLoading = false;
    filterBy!: { categories: string[]; name: string };
    searchProductsSubject = new Subject<string>();
    subscriptionSubject = new Subject<null>();

    ngOnInit(): void {
        this._observeProducts();
        this._observeViewportSize();
        this.listenUrlChanges();
        this._observeSearchProducts();
        this._getFilterBy();

        if (!this.isDesktop) {
            this._observeQueryParams();
            this.setQueryParams({ currPage: this.currPage });
        }

        if (this.isDesktop) {
            this._observeQueryParams();
        }
    }

    private _getFilterBy() {
        this.productsService.filterBy$
            .pipe(takeUntil(this.subscriptionSubject))
            .subscribe({
                next: (filterBy) => {
                    this.filterBy = filterBy;
                },
            });
    }

    private _observeSearchProducts() {
        this.searchProductsSubject
            .pipe(takeUntil(this.subscriptionSubject), debounceTime(500))
            .subscribe({
                next: () => {
                    this.productsService.setFilterBy(this.filterBy);
                    this.getProducts();
                },
            });
    }

    onSearchProducts() {
        this.isLoading = true;
        this.searchProductsSubject.next('');
    }

    private _observeQueryParams() {
        this.route.queryParams
            .pipe(takeUntil(this.subscriptionSubject))
            .subscribe((params) => {
                this.currPage = params['currPage'] || this.currPage;
                this.pageSize = params['pageSize'] || this.pageSize;

                this.getProducts();
            });
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

    onClickPage(idx: number) {
        if (idx + 1 === +this.currPage) return;

        this.setQueryParams({ currPage: idx + 1 + '' });
        this.isLoading = true;
    }

    private _observeViewportSize() {
        this.viewportSizeService.viewportWidth$
            .pipe(
                takeUntil(this.subscriptionSubject),
                map((viewportWidth) => viewportWidth >= 1025)
            )
            .subscribe((isDesktop) => {
                this.isDesktop = isDesktop;

                if (isDesktop)
                    this.setQueryParams({ currPage: '', pageSize: '' });
                else
                    this.setQueryParams({
                        currPage: this.currPage,
                        pageSize: this.pageSize,
                    });
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
        this.productsService.products$
            .pipe(
                takeUntil(this.subscriptionSubject),
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

        this.router.events
            .pipe(
                takeUntil(this.subscriptionSubject),
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
        this.productsService.setFilterBy({ categories: [], name: '' });
        this.subscriptionSubject.next(null);
        this.subscriptionSubject.complete();
    }
}
