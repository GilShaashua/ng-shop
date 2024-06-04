import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '@frontend/utils';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const token = inject(AuthService).getToken();
    const isApiUrl = req.url.startsWith(environment.API_URL);

    if (token && isApiUrl) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    return next(req);
};
