import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';

export const adminRoutes: Route[] = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard',
    },
    {
        path: 'products',
        loadComponent: () =>
            import('./pages/products/product-list/product-list.component').then(
                (component) => component.ProductListComponent
            ),
        title: 'Products',
        children: [
            { path: 'form', component: ProductFormComponent },
            {
                path: 'form/:productId',
                component: ProductFormComponent,
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
        children: [
            {
                path: 'form',
                component: CategoriesFormComponent,
                title: 'Add Category',
            },
            {
                path: 'form/:categoryId',
                component: CategoriesFormComponent,
                title: 'Edit Category',
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
    },
    {
        path: 'orders/:orderId',
        loadComponent: () =>
            import(
                './pages/orders/orders-details/orders-details.component'
            ).then((component) => component.OrdersDetailsComponent),
        title: 'Order Details',
    },
    {
        path: 'users',
        loadComponent: () =>
            import('./pages/users/users-list/users-list.component').then(
                (component) => component.UsersListComponent
            ),
        title: 'Users',
        children: [
            {
                path: 'form',
                component: UsersFormComponent,
                title: 'Add User',
            },
            {
                path: 'form/:userId',
                component: UsersFormComponent,
                title: 'Edit User',
            },
        ],
    },
];
