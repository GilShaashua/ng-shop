import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'ngshop-hero',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.scss',
    host: { class: 'component-layout host-hero' },
})
export class HeroComponent {}
