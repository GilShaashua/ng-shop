import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { UsersService } from '@frontend/users';

@Component({
    selector: 'orders-checkout-page',
    standalone: true,
    imports: [CommonModule, RouterModule, DropdownModule],
    templateUrl: './checkout-page.component.html',
    styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent implements OnInit {
    constructor(private usersService: UsersService) {}

    countries!: { id: string; name: string }[];

    ngOnInit(): void {
        this._getCountries();
    }

    private _getCountries() {
        const countries = this.usersService.getCountries();
        this.countries = countries;
    }
}
