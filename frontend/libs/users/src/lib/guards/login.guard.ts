import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export function loginGuard() {
    const user = inject(AuthService).getToken();

    if (user) {
        console.error('User is already logged in');

        inject(Router).navigateByUrl('/');
        return false;
    } else {
        return true;
    }
}