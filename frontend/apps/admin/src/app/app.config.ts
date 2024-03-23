import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes),
        provideAnimations(),
        provideHttpClient(),
        MessageService,
        ConfirmationService,
    ],
};
