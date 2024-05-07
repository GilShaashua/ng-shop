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
        path: 'products',
        loadChildren: () =>
            import('@frontend/products').then((route) => route.productsRoutes),
    },
    {
        path: 'checkout',
        loadChildren: () =>
            import('@frontend/orders').then((route) => route.ordersRoutes),
    },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
