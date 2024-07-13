import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@frontend/utils';
import { Observable } from 'rxjs';
import * as countriesLib from 'i18n-iso-countries';
import registerLocale from 'i18n-iso-countries/langs/en.json';
import { UsersFacade } from '../+state/users.facade';
import { environment } from '@frontend/utils';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(
        private http: HttpClient,
        private usersFacade: UsersFacade,
        private authService: AuthService
    ) {
        countriesLib.registerLocale(registerLocale);
    }

    apiUrl = environment.API_URL;

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}users`);
    }

    getUserById(userId: string): Observable<User> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.get<User>(`${this.apiUrl}users/${userId}`, { params });
    }

    addUser(user: User): Observable<User> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.post(`${this.apiUrl}users/register`, user, { params });
    }

    editUser(user: User): Observable<User> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.put(`${this.apiUrl}users/${user.id}`, user, {
            params,
        });
    }

    deleteUser(userId: string): Observable<User> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.delete(`${this.apiUrl}users/${userId}`, { params });
    }

    getUsersCount(): Observable<{ usersCount: number }> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.get<{ usersCount: number }>(
            `${this.apiUrl}users/get/count`,
            { params }
        );
    }

    getCountries(): { id: string; name: string }[] {
        const countriesRes = Object.entries(
            countriesLib.getNames('en', { select: 'official' })
        );
        const countries = countriesRes.map((country) => {
            return {
                id: country[0],
                name: country[1],
            };
        });

        return countries;
    }

    initAppSession() {
        this.usersFacade.buildUserSession();
    }

    observeCurrentUser() {
        return this.usersFacade.currentUser$;
    }

    getUserStatistics(): Observable<{ admin: number; notAdmin: number }> {
        const params = new HttpParams().append(
            'isLoginFast',
            this.authService.getIsLoginFast()
        );

        return this.http.get<{ admin: number; notAdmin: number }>(
            `${this.apiUrl}users/get/statistics`,
            { params }
        );
    }
}
