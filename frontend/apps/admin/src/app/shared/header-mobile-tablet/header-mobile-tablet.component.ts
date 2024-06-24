import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@frontend/shared';

@Component({
    selector: 'admin-header-mobile-tablet',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './header-mobile-tablet.component.html',
    styleUrl: './header-mobile-tablet.component.scss',
    host: { class: 'admin-header-mobile-tablet-host full component-layout' },
})
export class HeaderMobileTabletComponent {
    constructor(private router: Router, private authService: AuthService) {}

    isNavOpen = false;

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
