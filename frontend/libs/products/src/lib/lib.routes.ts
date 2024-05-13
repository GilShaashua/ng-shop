import { Route } from '@angular/router';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

export const productsRoutes: Route[] = [
    {
        path: '',
        component: ProductsListComponent,
        title: 'Products | ngShop',
    },
    {
        path: ':categoryId',
        component: ProductsListComponent,
        title: 'Products | ngShop',
    },
    {
        path: 'details/:productId',
        component: ProductDetailsComponent,
        title: 'Product Details | ngShop',
    },
];
