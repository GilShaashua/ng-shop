import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, timer } from 'rxjs';

@Component({
    selector: 'users-login',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router
    ) {}

    form: FormGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    isSubmitted = false;
    isPasswordShown = false;

    ngOnInit(): void {}

    onSubmitLogin() {
        this.isSubmitted = true;

        if (this.form.invalid) return;

        this.authService.login(this.form.value).subscribe({
            next: async (user) => {
                const isAdmin = this.authService.saveToken(user.token!);

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

    get formControls() {
        return this.form.controls;
    }
}
