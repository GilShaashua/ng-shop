import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UsersService } from '@frontend/shared';
import { UtilsService } from '@frontend/utils';

@Component({
    standalone: true,
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    selector: 'ngshop-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    constructor(
        private usersService: UsersService,
        private utilsService: UtilsService
    ) {}

    ngOnInit(): void {
        this.usersService.initAppSession();
        this.utilsService.setIsUsedByNgShop();
    }
}
