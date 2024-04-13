import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { HeroComponent } from '@frontend/ui';
import {
    CategoriesBannerComponent,
    CategoriesService,
    Category,
    FeaturedProductsComponent,
    Product,
    ProductsService,
} from '@frontend/products';

@Component({
    selector: 'ngshop-home-page',
    standalone: true,
    imports: [
        CommonModule,
        AccordionModule,
        HeroComponent,
        CategoriesBannerComponent,
        FeaturedProductsComponent,
    ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
    host: { class: 'full component-layout' },
})
export class HomePageComponent implements OnInit {
    constructor(
        private categoriesService: CategoriesService,
        private productsService: ProductsService
    ) {}

    categories!: Category[];
    featuredProducts!: Product[];

    ngOnInit(): void {
        this._getCategories();
        this._getFeaturedProducts(4);
    }

    private _getCategories() {
        this.categoriesService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
            },
            error: (err) => {
                console.error('Cannot get categories', err);
            },
        });
    }

    private _getFeaturedProducts(count: number) {
        this.productsService.getFeaturedProducts(count).subscribe({
            next: (featuredProducts) => {
                this.featuredProducts = featuredProducts;
            },
            error: (err) => {
                console.error('Cannot get featured products', err);
            },
        });
    }
}
