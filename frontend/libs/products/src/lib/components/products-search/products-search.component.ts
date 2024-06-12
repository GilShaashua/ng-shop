import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ngshop-products-search',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './products-search.component.html',
    styleUrl: './products-search.component.scss',
})
export class ProductsSearchComponent implements OnInit, OnDestroy {
    constructor(private router: Router) {}

    routePath = '';
    routerUrlSubscription!: Subscription;
    filterBy = {
        name: '',
    };

    ngOnInit(): void {
        this.routerUrlSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.routePath = this.router.url;
            }
        });
    }

    onInputProducts() {
        if (this.routePath !== '/products') {
            this.router.navigate(['/products']);
        }

        console.log('filterBy', this.filterBy);
    }

    ngOnDestroy(): void {
        this.routerUrlSubscription?.unsubscribe();
    }
}
