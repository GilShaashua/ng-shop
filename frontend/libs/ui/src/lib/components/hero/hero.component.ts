import { Component } from '@angular/core';

@Component({
    selector: 'ngshop-hero',
    standalone: true,
    imports: [],
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.scss',
    host: { class: 'component-layout host-hero' },
})
export class HeroComponent {}
