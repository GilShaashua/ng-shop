import { inject } from '@angular/core';
import { AuthService } from '@frontend/shared';
import { Router } from '@angular/router';

export function loginGuard() {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        const decodedToken = atob(token.split('.')[1]);
        const jwtToken = JSON.parse(decodedToken);
        if (authService.isTokenExpried(jwtToken.exp)) {
            return true;
        } else {
            console.error('User is already logged in');
            inject(Router).navigateByUrl('/');
            return false;
        }
    } else {
        return true;
    }
}
