import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'products-categories-banner',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './categories-banner.component.html',
    styleUrl: './categories-banner.component.scss',
    host: { class: 'component-layout categories-banner-host' },
})
export class CategoriesBannerComponent implements OnInit {
    constructor(private categoriesService: CategoriesService) {}

    categories!: Category[];

    ngOnInit(): void {
        this.getCategories();
    }

    getCategories() {
        this.categoriesService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
            },
            error: (err) => {
                console.error('Cannot get categories', err);
            },
        });
    }
}
