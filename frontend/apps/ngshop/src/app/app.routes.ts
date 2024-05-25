import { Route } from '@angular/router';
import { loginGuard } from '@frontend/users';

export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/home-page/home-page.component').then(
                (component) => component.HomePageComponent
            ),
        title: 'Home | ngShop',
    },

    {
        path: '',
        loadChildren: () =>
            import('@frontend/orders').then((route) => route.ordersRoutes),
    },

    {
        path: 'products',
        loadChildren: () =>
            import('@frontend/products').then((route) => route.productsRoutes),
    },

    {
        path: 'login',
        loadChildren: () =>
            import('@frontend/users').then((route) => route.usersRoutes),
        title: 'Login | ngShop',
        canActivate: [loginGuard],
    },

    { path: '**', redirectTo: '', pathMatch: 'full' },
];
