import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@frontend/users';

@Component({
    selector: 'admin-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
    constructor(private authService: AuthService, private router: Router) {}
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
