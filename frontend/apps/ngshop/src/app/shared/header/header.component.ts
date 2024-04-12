import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSearchComponent } from '@frontend/products';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'ngshop-header',
    standalone: true,
    imports: [CommonModule, RouterModule, ProductsSearchComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    host: { class: 'full component-layout header-host' },
})
export class HeaderComponent {}
