import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { HeroComponent } from '@frontend/ui';
import {
    CategoriesBannerComponent,
    FeaturedProductsComponent,
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
    constructor() {}

    ngOnInit(): void {
        // console.log('hi');
    }
}
