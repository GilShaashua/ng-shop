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
];
