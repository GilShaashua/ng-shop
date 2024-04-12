import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSearchComponent } from '@frontend/products';

@Component({
    selector: 'ngshop-header',
    standalone: true,
    imports: [CommonModule, ProductsSearchComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    host: { class: 'full component-layout header-host' },
})
export class HeaderComponent {}
