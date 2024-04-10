import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { enviroment } from '../../../../../enviroments/enviromet';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const token = inject(AuthService).getToken();
    const isApiUrl = req.url.startsWith(enviroment.apiUrl);

    if (token && isApiUrl) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    return next(req);
};
