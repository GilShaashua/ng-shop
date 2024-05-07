import { Route } from '@angular/router';

export const ordersRoutes: Route[] = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/checkout-page/checkout-page.component').then(
                (component) => component.CheckoutPageComponent
            ),
        title: 'Checkout | ngShop',
    },
];
