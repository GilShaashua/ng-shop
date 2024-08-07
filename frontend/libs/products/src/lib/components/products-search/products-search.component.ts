import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ProductsService } from '@frontend/shared';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
    selector: 'ngshop-products-search',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './products-search.component.html',
    styleUrl: './products-search.component.scss',
    host: {
        class: 'products-search-host',
    },
})
export class ProductsSearchComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private productsService: ProductsService
    ) {}

    routePath = '';
    routerUrlSubscription!: Subscription;
    filterBySubscription!: Subscription;
    filterBy!: { categories: string[]; name: string };

    private searchTerms = new Subject<string>();
    private searchTermsSubscription!: Subscription;

    ngOnInit(): void {
        this._observeRouterUrl();
        this._getFilterBy();

        this.searchTermsSubscription = this.searchTerms
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.productsService.setFilterBy(this.filterBy);
                this.productsService.getProducts();
            });
    }

    private _observeRouterUrl() {
        this.routerUrlSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.routePath = this.router.url;

                if (!this.routePath.startsWith('/products')) {
                    this.productsService.setFilterBy({
                        ...this.filterBy,
                        name: '',
                    });
                }
            }
        });
    }

    private _getFilterBy() {
        this.filterBySubscription = this.productsService.filterBy$.subscribe({
            next: (filterBy) => {
                this.filterBy = filterBy;
            },
        });
    }

    onInputProducts() {
        if (this.routePath !== '/products') {
            this.router.navigate(['/products']);
        }

        this.searchTerms.next(this.filterBy.name);
    }

    ngOnDestroy(): void {
        this.routerUrlSubscription?.unsubscribe();
        this.filterBySubscription?.unsubscribe();
        this.searchTermsSubscription?.unsubscribe();
    }
}
