import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromUsers from './+state/users.reducer';
import { UsersEffects } from './+state/users.effects';
import { UsersFacade } from './+state/users.facade';

export const usersRoutes: Route[] = [
    {
        path: '',
        component: LoginComponent,
        providers: [
            UsersFacade,
            provideState(fromUsers.USERS_FEATURE_KEY, fromUsers.reducer),
            provideEffects([UsersEffects]),
        ],
    },
];
