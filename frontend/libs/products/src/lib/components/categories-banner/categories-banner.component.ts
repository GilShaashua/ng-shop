import { Component, Input } from '@angular/core';
import { Category } from '../../models/category.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'products-categories-banner',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './categories-banner.component.html',
    styleUrl: './categories-banner.component.scss',
    host: { class: 'component-layout categories-banner-host' },
})
export class CategoriesBannerComponent {
    constructor() {}

    @Input() categories!: Category[];
}
