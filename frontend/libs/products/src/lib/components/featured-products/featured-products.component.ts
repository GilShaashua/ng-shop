import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { ProductItemComponent } from '../product-item/product-item.component';
import { CommonModule } from '@angular/common';
import { Product } from '@frontend/utils';

@Component({
    selector: 'products-featured-products',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ProductItemComponent],
    templateUrl: './featured-products.component.html',
    styleUrl: './featured-products.component.scss',
    host: { class: 'component-layout featured-products-host' },
})
export class FeaturedProductsComponent {
    @Input() featuredProducts!: Product[];
    @Output() onAddProduct = new EventEmitter();

    trackByFn(index: number, product: Product) {
        return product.id;
    }
}
