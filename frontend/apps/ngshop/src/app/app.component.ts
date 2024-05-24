import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UsersService } from '@frontend/users';

@Component({
    standalone: true,
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    selector: 'ngshop-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    constructor(private usersService: UsersService) {}

    ngOnInit(): void {
        this.usersService.initAppSession();
    }
}
