import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'admin-header-mobile-tablet',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header-mobile-tablet.component.html',
    styleUrl: './header-mobile-tablet.component.scss',
    host: { class: 'admin-header-mobile-tablet-host full component-layout' },
})
export class HeaderMobileTabletComponent {
    isNavOpen = false;
}
