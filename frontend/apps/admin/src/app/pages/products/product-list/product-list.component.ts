import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterOutlet,
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
        RouterLink,
        RouterOutlet,
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
        private changeDetectorRef: ChangeDetectorRef
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

    ngOnInit(): void {
        this.listenUrlChanges();
        this._observeViewportSize();
        this.getProducts();
    }

    private _observeViewportSize() {
        this.viewportSubscription = this.viewportSizeService.viewportWidth$
            .pipe(map((viewportWidth) => viewportWidth >= 1025))
            .subscribe((isDesktop) => {
                this.isDesktop = isDesktop;
                this.changeDetectorRef.markForCheck();
            });
    }

    getProducts() {
        this.productsService.getProducts();

        this.productsService.products$
            .pipe(
                map((products) => {
                    return products.map((product) => {
                        return {
                            ...product,
                            category: product.category
                                .name as unknown as Category,
                        };
                    });
                })
            )
            .subscribe({
                next: (products) => {
                    this.products = products;
                    this.changeDetectorRef.markForCheck();
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
        this.urlChangesSubscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe({
                next: () => {
                    this.getProducts();
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
    }
}
