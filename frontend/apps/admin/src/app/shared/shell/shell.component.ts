import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'admin-shell',
    standalone: true,
    imports: [SidebarComponent, RouterOutlet],
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss',
})
export class ShellComponent {}
