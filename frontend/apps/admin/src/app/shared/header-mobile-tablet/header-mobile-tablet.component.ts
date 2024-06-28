import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UsersService } from '@frontend/shared';
import { firstValueFrom } from 'rxjs';
import { User } from '@frontend/utils';

@Component({
    selector: 'admin-header-mobile-tablet',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './header-mobile-tablet.component.html',
    styleUrl: './header-mobile-tablet.component.scss',
    host: { class: 'admin-header-mobile-tablet-host full component-layout' },
})
export class HeaderMobileTabletComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    isNavOpen = false;
    loggedInUser: User | null = null;

    ngOnInit(): void {
        this.authService.loggedInUser$.subscribe(async () => {
            const userId = this.authService.getUserIdFromToken();
            if (userId) {
                const user$ = this.usersService.getUserById(userId);
                const user = await firstValueFrom(user$);
                this.loggedInUser = user;
            } else {
                this.loggedInUser = null;
            }
        });
    }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    ngOnDestroy(): void {}
}
