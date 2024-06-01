import { createFeatureSelector } from '@ngrx/store';
import { USERS_FEATURE_KEY, UsersState } from './users.reducer';

// Lookup the 'Users' feature state managed by NgRx
export const getUserState =
    createFeatureSelector<UsersState>(USERS_FEATURE_KEY);
