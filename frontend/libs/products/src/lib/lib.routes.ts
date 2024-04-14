import { Route } from '@angular/router';

export const productsRoutes: Route[] = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/products-list/products-list.component').then(
                (component) => component.ProductsListComponent
            ),
        title: 'Products | ngShop',
    },
    {
        path: ':categoryId',
        loadComponent: () =>
            import('./pages/products-list/products-list.component').then(
                (component) => component.ProductsListComponent
            ),
        title: 'Products | ngShop',
    },
    {
        path: 'details/:productId',
        loadComponent: () =>
            import('./pages/product-details/product-details.component').then(
                (component) => component.ProductDetailsComponent
            ),
        title: 'Product Details | ngShop',
    },
];
