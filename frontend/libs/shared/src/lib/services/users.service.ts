import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@frontend/utils';
import { Observable } from 'rxjs';
import * as countriesLib from 'i18n-iso-countries';
import registerLocale from 'i18n-iso-countries/langs/en.json';
import { enviroment } from '@frontend/utils';
import { UsersFacade } from '../+state/users.facade';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(private http: HttpClient, private usersFacade: UsersFacade) {
        countriesLib.registerLocale(registerLocale);
    }

    apiUrl = enviroment.apiUrl;

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}users`);
    }

    getUserById(userId: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}users/${userId}`);
    }

    addUser(user: User): Observable<User> {
        return this.http.post(`${this.apiUrl}users/register`, user);
    }

    editUser(user: User): Observable<User> {
        return this.http.put(`${this.apiUrl}users/${user.id}`, user);
    }

    deleteUser(userId: string): Observable<User> {
        return this.http.delete(`${this.apiUrl}users/${userId}`);
    }

    getUsersCount(): Observable<{ usersCount: number }> {
        return this.http.get<{ usersCount: number }>(
            `${this.apiUrl}users/get/count`
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
}
