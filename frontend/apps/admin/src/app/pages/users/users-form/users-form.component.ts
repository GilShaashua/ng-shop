import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterModule,
} from '@angular/router';
import { UsersService } from '@frontend/users';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription, firstValueFrom, timer } from 'rxjs';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import * as countriesLib from 'i18n-iso-countries';
import test1 from 'i18n-iso-countries/langs/en.json';

declare const require: any;

@Component({
    selector: 'admin-users-form',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterModule,
        ToastModule,
        ReactiveFormsModule,
        InputSwitchModule,
        DropdownModule,
    ],
    templateUrl: './users-form.component.html',
    styleUrl: './users-form.component.scss',
})
export class UsersFormComponent {
    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    form: FormGroup = this.formBuilder.group({
        id: [''],
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        phone: ['', [Validators.required, Validators.minLength(8)]],
        isAdmin: [false],
        street: ['', [Validators.required, Validators.minLength(8)]],
        apartment: ['', [Validators.required]],
        zip: ['', [Validators.required, Validators.minLength(5)]],
        city: ['', [Validators.required, Validators.minLength(3)]],
        country: ['', [Validators.required]],
    });

    userId = '';
    countries: any[] = [];
    isCmpInizialized = false;
    isSubmitted = false;
    paramsSubscription!: Subscription;

    ngOnInit(): void {
        this._checkParams();
        this._getContries();
    }

    onSubmitForm() {
        console.log(this.form.value);

        if (this.form.untouched) {
            if (this.userId) {
                return this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Edit atleast 1 field!',
                });
            } else {
                return this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Fill the fields first!',
                });
            }
        }
        this.isSubmitted = true;
        if (this.form.invalid) return;

        // Check if its edit mode or add mode
        if (this.userId) {
            this._editUser();
        } else {
            this._addUser();
        }
    }

    private _checkParams() {
        this.paramsSubscription = this.route.params.subscribe((params) => {
            if (params['userId']) {
                this.usersService.getUserById(params['userId']).subscribe({
                    next: (user) => {
                        this.userId = user.id!;
                        this.form.patchValue(user);
                        this.form.controls['password'].setValidators([]);
                        this.isCmpInizialized = true;
                    },
                    error: (err) => {
                        console.error('Cannot get user', err);
                    },
                });
            } else {
                this.isCmpInizialized = true;
            }
        });
    }

    private _getContries() {
        countriesLib.registerLocale(test1);
        const countriesRes = Object.entries(
            countriesLib.getNames('en', { select: 'official' })
        );
        const countries = countriesRes.map((country) => {
            return country[1];
        });
        this.countries = countries;
    }

    private _addUser() {
        this.usersService.addUser(this.form.value).subscribe({
            next: async (addedUser) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `The user "${addedUser.name}" is created successfully!`,
                });

                await firstValueFrom(timer(2000));
                this.router.navigateByUrl('/users');
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'The user cannot be created!',
                });

                console.error('The user cannot be created!', err);
            },
        });
    }

    private _editUser() {
        this.usersService.editUser(this.form.value).subscribe({
            next: async (editedUser) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `The user "${editedUser.name}" is edited successfully!`,
                });

                await firstValueFrom(timer(2000));
                this.router.navigateByUrl('/users');
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'The user cannot be edited!',
                });

                console.error('Cannot edit user', err);
            },
        });
    }

    get controlsForm() {
        return this.form.controls;
    }

    ngOnDestroy(): void {
        this.paramsSubscription?.unsubscribe();
    }
}
