import { HttpClient } from '@angular/common/http';
import { Injectable, enableProdMode, isDevMode } from '@angular/core';
import { User } from '@frontend/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersFacade } from '../+state/users.facade';
import { environment } from '@frontend/utils';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient, private usersFacade: UsersFacade) {}

    private _loggedInUser$: BehaviorSubject<string | null> =
        new BehaviorSubject(this.getToken());
    public loggedInUser$ = this._loggedInUser$.asObservable();

    private _isFastLogin$: BehaviorSubject<boolean> = new BehaviorSubject(
        this.getLoginFastStorage()
    );
    public isFastLogin$ = this._isFastLogin$.asObservable();

    apiUrl = environment.API_URL;

    login({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}users/login`, {
            email,
            password,
        });
    }

    logout() {
        localStorage.removeItem('jwtToken');
        this._loggedInUser$.next(null);

        if (this._isFastLogin$.value) {
            localStorage.removeItem('isFastLogin');
            this._isFastLogin$.next(false);
        }
    }

    logoutNgShop() {
        this.usersFacade.userSessionLogout();
    }

    loginNgShop(user: User) {
        this.usersFacade.userSessionLogin(user);
    }

    loginFast(userId: string): Observable<{ user: string; token: string }> {
        return this.http.post<{ user: string; token: string }>(
            `${this.apiUrl}users/fast-login/${userId}`,
            ''
        );
    }

    getLoginFastStorage() {
        return JSON.parse(localStorage.getItem('isFastLogin') || 'false');
    }

    getIsLoginFast() {
        return this._isFastLogin$.value;
    }

    setIsLoginFast(isFastLogin: boolean) {
        this._isFastLogin$.next(isFastLogin);
        localStorage.setItem('isFastLogin', JSON.stringify(isFastLogin));
    }

    saveTokenLoginFast(token: string) {
        const decodedToken = atob(token.split('.')[1]);
        const jwtToken = JSON.parse(decodedToken);

        if (!this.isTokenExpried(jwtToken.exp))
            localStorage.setItem('jwtToken', token);
    }

    saveTokenAdminPanel(token: string) {
        if (JSON.parse(atob(token.split('.')[1])).isAdmin) {
            localStorage.setItem('jwtToken', token);
            this._loggedInUser$.next(token);

            return true;
        }

        return false;
    }

    saveTokenNgShop(token: string) {
        const decodedToken = atob(token.split('.')[1]);
        const jwtToken = JSON.parse(decodedToken);

        if (!this.isTokenExpried(jwtToken.exp))
            localStorage.setItem('jwtToken', token);
    }

    getToken(): string | null {
        return localStorage.getItem('jwtToken');
    }

    getUserIdFromToken(): string | null {
        const jwtToken = this.getToken();
        if (jwtToken) {
            const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]));

            if (decodedToken) {
                return decodedToken.userId;
            } else {
                return null;
            }
        }

        return null;
    }

    isValidToken(): boolean {
        const jwtToken = this.getToken();

        if (jwtToken) {
            const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]));
            return !this.isTokenExpried(decodedToken);
        } else {
            return false;
        }
    }

    isTokenExpried(expiration: number) {
        return Math.floor(new Date().getTime() / 1000) >= expiration;
    }

    get loggedInUser() {
        return this._loggedInUser$.value;
    }
}
