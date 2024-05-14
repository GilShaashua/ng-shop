import { Route } from '@angular/router';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';

export const ordersRoutes: Route[] = [
    {
        path: 'checkout',
        component: CheckoutPageComponent,
        title: 'Checkout | ngShop',
    },
    {
        path: 'checkout/:userId',
        component: CheckoutPageComponent,
        title: 'Checkout | ngShop',
    },
    {
        path: 'thank-you/:orderId',
        component: ThankYouComponent,
        title: 'Thank You | ngShop',
    },
];
