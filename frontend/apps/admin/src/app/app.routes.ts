import { Route } from '@angular/router';
import { ShellComponent } from './shared/shell/shell.component';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    {
        path: '',
        component: ShellComponent,
        loadChildren: () =>
            import('./admin.routes').then((route) => route.adminRoutes),
    },

    {
        path: 'login',
        loadComponent: () =>
            import('@frontend/users').then(
                (component) => component.LoginComponent
            ),
        title: 'Login',
    },
    { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];
