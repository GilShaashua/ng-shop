import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { authGuard } from '@frontend/users';

export const adminRoutes: Route[] = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard',
        canActivate: [authGuard],
    },
    {
        path: 'products',
        loadComponent: () =>
            import('./pages/products/product-list/product-list.component').then(
                (component) => component.ProductListComponent
            ),
        title: 'Products',
        canActivate: [authGuard],
        children: [
            {
                path: 'form',
                component: ProductFormComponent,
                title: 'Add Product',
                canActivate: [authGuard],
            },
            {
                path: 'form/:productId',
                component: ProductFormComponent,
                title: 'Edit Product',
                canActivate: [authGuard],
            },
        ],
    },
    {
        path: 'categories',
        loadComponent: () =>
            import(
                './pages/categories/categories-list/categories.component'
            ).then((component) => component.CategoriesComponent),
        title: 'Categories',
        canActivate: [authGuard],
        children: [
            {
                path: 'form',
                component: CategoriesFormComponent,
                title: 'Add Category',
                canActivate: [authGuard],
            },
            {
                path: 'form/:categoryId',
                component: CategoriesFormComponent,
                title: 'Edit Category',
                canActivate: [authGuard],
            },
        ],
    },
    {
        path: 'orders',
        loadComponent: () =>
            import('./pages/orders/orders-list/orders-list.component').then(
                (component) => component.OrdersListComponent
            ),
        title: 'Orders',
        canActivate: [authGuard],
    },
    {
        path: 'orders/:orderId',
        loadComponent: () =>
            import(
                './pages/orders/orders-details/orders-details.component'
            ).then((component) => component.OrdersDetailsComponent),
        title: 'Order Details',
        canActivate: [authGuard],
    },
    {
        path: 'users',
        loadComponent: () =>
            import('./pages/users/users-list/users-list.component').then(
                (component) => component.UsersListComponent
            ),
        title: 'Users',
        canActivate: [authGuard],
        children: [
            {
                path: 'form',
                component: UsersFormComponent,
                title: 'Add User',
                canActivate: [authGuard],
            },
            {
                path: 'form/:userId',
                component: UsersFormComponent,
                title: 'Edit User',
                canActivate: [authGuard],
            },
        ],
    },
];
