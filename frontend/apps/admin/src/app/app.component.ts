import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@frontend/shared';

@Component({
    standalone: true,
    imports: [RouterOutlet],
    selector: 'admin-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    constructor(private authService: AuthService) {}
    ngOnInit() {
        this.authService.checkProdMode();
    }
}
