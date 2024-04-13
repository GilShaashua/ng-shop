import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductItemComponent } from '../../components/product-item/product-item.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';

@Component({
    selector: 'products-products-list',
    standalone: true,
    imports: [CommonModule, RouterModule, ProductItemComponent],
    templateUrl: './products-list.component.html',
    styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit {
    constructor(
        private productsService: ProductsService,
        private categoriesService: CategoriesService
    ) {}

    products!: Product[];
    categories!: Category[];

    ngOnInit(): void {
        this._getProducts();
        this._getCategories();
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

    private _getProducts() {
        this.productsService.getProducts().subscribe({
            next: (products) => {
                this.products = products;
            },
            error: (err) => {
                console.error('Cannot get products', err);
            },
        });
    }
}
