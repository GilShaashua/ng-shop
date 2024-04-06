import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'users-login',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    constructor(private formBuilder: FormBuilder) {}

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

        console.log(this.form.value);
    }

    get formControls() {
        return this.form.controls;
    }
}
