import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from '@frontend/users';
import { MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(BrowserModule),
        provideRouter(appRoutes),
        provideAnimations(),
        provideHttpClient(withInterceptors([jwtInterceptor])),
        MessageService,
    ],
};
