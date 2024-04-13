import { Component, Input } from '@angular/core';
import { ProductItemComponent } from '../product-item/product-item.component';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
    selector: 'products-featured-products',
    standalone: true,
    imports: [CommonModule, ProductItemComponent],
    templateUrl: './featured-products.component.html',
    styleUrl: './featured-products.component.scss',
    host: { class: 'component-layout featured-products-host' },
})
export class FeaturedProductsComponent {
    @Input() featuredProducts!: Product[];
}
