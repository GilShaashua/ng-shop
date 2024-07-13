import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, firstValueFrom, takeUntil, timer } from 'rxjs';
import { User, UtilsService } from '@frontend/utils';
import { AuthService, UsersService } from '@frontend/shared';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'users-login',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        DropdownModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    host: { class: 'full' },
})
export class LoginComponent implements OnInit, OnDestroy {
    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router,
        private utilsService: UtilsService,
        private usersService: UsersService
    ) {}

    form: FormGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    isSubmitted = false;
    isPasswordShown = false;
    isUsedByNgShop = false;

    endSubs$ = new Subject();

    users!: User[];

    ngOnInit(): void {
        this._checkFromNgShop();
        this._getUsers();
    }

    private _getUsers() {
        this.usersService.getUsers().subscribe({
            next: (users) => {
                this.users = users;
            },
            error: (err) => {
                console.error('Cannot get users!', err);
            },
        });
    }

    onLoginFast(ev: DropdownChangeEvent) {
        this.authService.loginFast(ev.value).subscribe({
            next: async (user) => {
                this.authService.setIsLoginFast(true);

                this.authService.saveTokenLoginFast(user.token);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `You are logged in successfully!`,
                });

                await firstValueFrom(timer(2000));

                this.router.navigateByUrl('/');
            },
            error: (err) => {
                console.error(err);
            },
        });
    }

    onSubmitLogin() {
        this.isSubmitted = true;

        if (this.form.invalid) return;

        if (!this.isUsedByNgShop) {
            this._loginAdminPanel();
        } else {
            this._loginNgShop();
        }
    }

    private _loginAdminPanel() {
        this.authService.login(this.form.value).subscribe({
            next: async (user) => {
                const isAdmin = this.authService.saveTokenAdminPanel(
                    user.token!
                );

                if (isAdmin) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `You are logged in successfully!`,
                    });

                    await firstValueFrom(timer(2000));

                    this.router.navigateByUrl('/');
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'You are not an admin!',
                    });
                }
            },
            error: (err: HttpErrorResponse) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                        err.status !== 400
                            ? 'Server error, please try again later!'
                            : 'Email or password incorrect',
                });
            },
        });
    }

    private _loginNgShop() {
        this.authService.login(this.form.value).subscribe({
            next: async (user) => {
                if (user && user.token) {
                    this.authService.saveTokenNgShop(user.token);
                    const userId = this.authService.getUserIdFromToken();

                    if (userId) {
                        const user$ = this.usersService.getUserById(userId);
                        const user = await firstValueFrom(user$);
                        this.authService.loginNgShop(user);

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: `You are logged in successfully!`,
                        });

                        await firstValueFrom(timer(2000));

                        this.router.navigateByUrl('/');
                    }
                }
            },
            error: (err: HttpErrorResponse) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                        err.status !== 400
                            ? 'Server error, please try again later!'
                            : 'Email or password incorrect',
                });
            },
        });
    }

    private _checkFromNgShop() {
        this.utilsService.isUsedByNgShop$
            .pipe(takeUntil(this.endSubs$))
            .subscribe({
                next: (isUsedByNgShop) => {
                    if (isUsedByNgShop) {
                        this.isUsedByNgShop = isUsedByNgShop;
                    }
                },
                error: (err) => {
                    console.error('Cannot get UsedByNgShop', err);
                },
            });
    }

    get formControls() {
        return this.form.controls;
    }

    ngOnDestroy(): void {
        this.endSubs$.next(null);
        this.endSubs$.complete();
    }
}
