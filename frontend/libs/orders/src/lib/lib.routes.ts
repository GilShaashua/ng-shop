import { Route } from '@angular/router';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';

export const ordersRoutes: Route[] = [
    {
        path: '',
        component: CheckoutPageComponent,
        title: 'Checkout | ngShop',
    },
    {
        path: ':userId',
        component: CheckoutPageComponent,
        title: 'Checkout | ngShop',
    },
];
