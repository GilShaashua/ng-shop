import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { UsersFacade, jwtInterceptor } from '@frontend/users';
import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
    providers: [
        provideStore(),
        importProvidersFrom(BrowserModule),
        provideRouter(appRoutes),
        provideAnimations(),
        provideHttpClient(withInterceptors([jwtInterceptor])),
        MessageService,
        ConfirmationService,
        UsersFacade,
    ],
};
