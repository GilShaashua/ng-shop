import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '@frontend/utils';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'products-product-item',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './product-item.component.html',
    styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
    @Input() product!: Product;
    @Output() onAddProduct = new EventEmitter();
}
