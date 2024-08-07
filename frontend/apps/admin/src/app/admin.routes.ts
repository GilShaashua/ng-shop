import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { authGuard } from '@frontend/users';

export const adminRoutes: Route[] = [
    {
        path: '',
        component: DashboardComponent,
        title: 'Dashboard | Admin Panel',
        canActivate: [authGuard],
        children: [
            {
                path: 'order-statistics',
                loadComponent: () =>
                    import(
                        './pages/order-statistics/order-statistics.component'
                    ).then((component) => component.OrderStatisticsComponent),
                title: 'Orders Statistics | Admin Panel',
            },
            {
                path: 'user-statistics',
                loadComponent: () =>
                    import(
                        './pages/user-statistics/user-statistics.component'
                    ).then((component) => component.UserStatisticsComponent),
                title: 'Users Statistics | Admin Panel',
            },
            {
                path: 'product-statistics',
                loadComponent: () =>
                    import(
                        './pages/product-statistics/product-statistics.component'
                    ).then((component) => component.ProductStatisticsComponent),
                title: 'Products Statistics | Admin Panel',
            },
            {
                path: 'total-sales-statistics',
                loadComponent: () =>
                    import(
                        './pages/total-sales-statistics/total-sales-statistics.component'
                    ).then(
                        (component) => component.TotalSalesStatisticsComponent
                    ),
                title: 'Total Sales Statistics | Admin Panel',
            },
        ],
    },
    {
        path: 'products',
        loadComponent: () =>
            import('./pages/products/product-list/product-list.component').then(
                (component) => component.ProductListComponent
            ),
        title: 'Products | Admin Panel',
        canActivate: [authGuard],
        children: [
            {
                path: 'form',
                component: ProductFormComponent,
                title: 'Add Product | Admin Panel',
                canActivate: [authGuard],
            },
            {
                path: 'form/:productId',
                component: ProductFormComponent,
                title: 'Edit Product | Admin Panel',
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
        title: 'Categories | Admin Panel',
        canActivate: [authGuard],
        children: [
            {
                path: 'form',
                component: CategoriesFormComponent,
                title: 'Add Category | Admin Panel',
                canActivate: [authGuard],
            },
            {
                path: 'form/:categoryId',
                component: CategoriesFormComponent,
                title: 'Edit Category | Admin Panel',
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
        title: 'Orders | Admin Panel',
        canActivate: [authGuard],
    },
    {
        path: 'orders/:orderId',
        loadComponent: () =>
            import(
                './pages/orders/orders-details/orders-details.component'
            ).then((component) => component.OrdersDetailsComponent),
        title: 'Order Details | Admin Panel',
        canActivate: [authGuard],
    },
    {
        path: 'users',
        loadComponent: () =>
            import('./pages/users/users-list/users-list.component').then(
                (component) => component.UsersListComponent
            ),
        title: 'Users | Admin Panel',
        canActivate: [authGuard],
        children: [
            {
                path: 'form',
                component: UsersFormComponent,
                title: 'Add User | Admin Panel',
                canActivate: [authGuard],
            },
            {
                path: 'form/:userId',
                component: UsersFormComponent,
                title: 'Edit User | Admin Panel',
                canActivate: [authGuard],
            },
        ],
    },
];
