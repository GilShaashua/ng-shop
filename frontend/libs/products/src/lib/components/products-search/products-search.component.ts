import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ProductsService } from '@frontend/shared';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ngshop-products-search',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './products-search.component.html',
    styleUrl: './products-search.component.scss',
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

    ngOnInit(): void {
        this.routerUrlSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.routePath = this.router.url;
            }
        });

        this._getFilterBy();
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

        this.productsService.setFilterBy(this.filterBy);

        this.productsService.getProducts();
    }

    ngOnDestroy(): void {
        this.routerUrlSubscription?.unsubscribe();
        this.filterBySubscription?.unsubscribe();
    }
}
