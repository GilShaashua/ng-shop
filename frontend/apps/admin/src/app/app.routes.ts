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
        loadChildren: () =>
            import('@frontend/users').then((route) => route.usersRoutes),
        title: 'Login',
    },
    { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];
