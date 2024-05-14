import { Route } from '@angular/router';

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

    { path: '**', redirectTo: '', pathMatch: 'full' },
];
