import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UsersActions from './users.actions';
import { USERS_FEATURE_KEY } from './users.reducer';
import { User } from '../models/user.model';

@Injectable()
export class UsersFacade {
    private readonly store = inject(Store);

    currentUser$ = this.store.select(USERS_FEATURE_KEY);

    buildUserSession() {
        this.store.dispatch(UsersActions.buildUserSession());
    }

    userSessionLogout() {
        this.store.dispatch(UsersActions.userSessionLogout());
    }

    userSessionLogin(user: User) {
        this.store.dispatch(
            UsersActions.userSessionLogin({
                user,
            })
        );
    }
}
