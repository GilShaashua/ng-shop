import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { HeroComponent } from '@frontend/ui';

@Component({
    selector: 'ngshop-home-page',
    standalone: true,
    imports: [CommonModule, AccordionModule, HeroComponent],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        console.log('hi');
    }
}
