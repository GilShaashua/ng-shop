import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) {}

    private _loggedInUser$: BehaviorSubject<string | null> =
        new BehaviorSubject(this.getToken());

    public loggedInUser$ = this._loggedInUser$.asObservable();

    login({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Observable<User> {
        return this.http.post<User>(
            'http://localhost:3000/api/v1/users/login',
            {
                email,
                password,
            }
        );
    }

    logout() {
        localStorage.removeItem('jwtToken');
        this._loggedInUser$.next(null);
    }

    saveToken(token: string) {
        if (JSON.parse(atob(token.split('.')[1])).isAdmin) {
            localStorage.setItem('jwtToken', token);
            this._loggedInUser$.next(token);

            return true;
        }

        return false;
    }

    getToken(): string | null {
        const jwtToken = localStorage.getItem('jwtToken');

        if (!jwtToken) {
            return null; // Return null if no token is found
        }

        try {
            const decodedToken = atob(jwtToken.split('.')[1]);
            const token = JSON.parse(decodedToken);

            if (token.isAdmin && !this._isTokenExpried(token.exp)) {
                return jwtToken;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error decoding JWT token');
            return null; // Return null on decoding error
        }
    }

    private _isTokenExpried(expiration: number) {
        return Math.floor(new Date().getTime() / 1000) >= expiration;
    }

    get loggedInUser() {
        return this._loggedInUser$.value;
    }
}
