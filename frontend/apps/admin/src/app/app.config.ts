import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { UsersEffects, jwtInterceptor, reducer } from '@frontend/shared';
import { provideStore } from '@ngrx/store';
import { UsersFacade } from '@frontend/shared';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
    providers: [
        provideStore({ users: reducer }),
        provideEffects([UsersEffects]),
        importProvidersFrom(BrowserModule),
        provideRouter(appRoutes, withHashLocation()),
        provideAnimations(),
        provideHttpClient(withInterceptors([jwtInterceptor])),
        MessageService,
        ConfirmationService,
        UsersFacade,
    ],
};
