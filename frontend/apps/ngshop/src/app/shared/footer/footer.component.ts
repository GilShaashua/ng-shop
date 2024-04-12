import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ngshop-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    host: { class: 'full component-layout footer-host' },
})
export class FooterComponent {}
