import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

export const buildUserSession = createAction('[Users] Build User Session');

export const buildUserSessionSuccess = createAction(
    '[Users] Build User Session Success',
    props<{ user: User }>()
);

export const buildUserSessionFailed = createAction(
    '[Users] Build User Session Failed'
);

export const userSessionLogout = createAction('[Users] User Session Logout');

export const userSessionLogin = createAction(
    '[Users] User Session Login',
    props<{ user: User }>()
);
