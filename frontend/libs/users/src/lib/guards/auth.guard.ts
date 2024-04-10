import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export function authGuard() {
    const user = inject(AuthService).getToken();

    if (user) return true;
    else {
        inject(Router).navigateByUrl('login');
        return false;
    }
}
