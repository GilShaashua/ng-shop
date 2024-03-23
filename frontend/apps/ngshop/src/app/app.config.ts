import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes),
        provideAnimations(),
        provideHttpClient(),
        ReactiveFormsModule,
        FormsModule,
    ],
};
