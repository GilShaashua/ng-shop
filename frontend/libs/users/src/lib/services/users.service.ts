import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import * as countriesLib from 'i18n-iso-countries';
import registerLocale from 'i18n-iso-countries/langs/en.json';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(private http: HttpClient) {
        countriesLib.registerLocale(registerLocale);
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>('http://localhost:3000/api/v1/users');
    }

    getUserById(userId: string): Observable<User> {
        return this.http.get<User>(
            `http://localhost:3000/api/v1/users/${userId}`
        );
    }

    addUser(user: User): Observable<User> {
        console.log('user', user);

        return this.http.post(
            'http://localhost:3000/api/v1/users/register',
            user
        );
    }

    editUser(user: User): Observable<User> {
        return this.http.put(
            `http://localhost:3000/api/v1/users/${user.id}`,
            user
        );
    }

    deleteUser(userId: string): Observable<User> {
        return this.http.delete(`http://localhost:3000/api/v1/users/${userId}`);
    }
}
