import { inject } from '@angular/core';
import { AuthService } from '@frontend/shared';
import { Router } from '@angular/router';

export async function authGuard() {
    const authService = inject(AuthService);

    const jwtToken = authService.getToken();

    if (!jwtToken) {
        inject(Router).navigateByUrl('login');
        return false; // Return null if no token is found
    }

    try {
        if (authService.getIsLoginFast()) {
            return true;
        }

        const decodedToken = atob(jwtToken.split('.')[1]);
        const token = JSON.parse(decodedToken);

        if (token.isAdmin && !authService.isTokenExpried(token.exp)) {
            return true;
        } else {
            inject(Router).navigateByUrl('login');
            return false;
        }
    } catch (error) {
        console.error('Error decoding JWT token');
        inject(Router).navigateByUrl('login');
        return false; // Return null on decoding error
    }
}
