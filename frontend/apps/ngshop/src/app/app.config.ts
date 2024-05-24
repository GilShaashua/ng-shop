import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { UsersFacade, jwtInterceptor, reducer } from '@frontend/users';
import { MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { UsersEffects } from 'libs/users/src/lib/+state/users.effects';

export const appConfig: ApplicationConfig = {
    providers: [
        provideStore({ users: reducer }),
        provideEffects([UsersEffects]),
        importProvidersFrom(BrowserModule),
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideRouter(appRoutes),
        provideAnimations(),
        MessageService,
        UsersFacade,
    ],
};
