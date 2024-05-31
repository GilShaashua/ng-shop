import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, of, concatMap, map, tap } from 'rxjs';
import * as UsersActions from './users.actions';
// import * as UsersFeature from './users.reducer';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Injectable()
export class UsersEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private usersService = inject(UsersService);

    buildUserSession$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.buildUserSession),
            concatMap(() => {
                if (this.authService.isValidToken()) {
                    const userId = this.authService.getUserIdFromToken();
                    if (userId) {
                        return this.usersService.getUserById(userId).pipe(
                            map((user) => {
                                return UsersActions.buildUserSessionSuccess({
                                    user,
                                });
                            }),
                            catchError(() =>
                                of(UsersActions.buildUserSessionFailed())
                            )
                        );
                    } else {
                        return of(UsersActions.buildUserSessionFailed());
                    }
                } else {
                    return of(UsersActions.buildUserSessionFailed());
                }
            })
        )
    );

    buildUserSessionFailed$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(UsersActions.buildUserSessionFailed),
                tap(() => {
                    localStorage.removeItem('jwtToken');
                })
            ),
        { dispatch: false }
    );

    userSessionLogout$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(UsersActions.userSessionLogout),
                tap(() => {
                    localStorage.removeItem('jwtToken');
                })
            ),
        { dispatch: false }
    );
}
