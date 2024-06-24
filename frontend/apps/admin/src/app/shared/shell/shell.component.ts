import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { HeaderMobileTabletComponent } from '../header-mobile-tablet/header-mobile-tablet.component';

@Component({
    selector: 'admin-shell',
    standalone: true,
    imports: [SidebarComponent, RouterOutlet, HeaderMobileTabletComponent],
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss',
})
export class ShellComponent {}
