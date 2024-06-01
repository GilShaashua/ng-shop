import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {
    USERS_FEATURE_KEY,
    UsersEffects,
    UsersFacade,
    reducer,
} from '@frontend/shared';

export const usersRoutes: Route[] = [
    {
        path: '',
        component: LoginComponent,
        providers: [
            UsersFacade,
            provideState(USERS_FEATURE_KEY, reducer),
            provideEffects([UsersEffects]),
        ],
    },
];
