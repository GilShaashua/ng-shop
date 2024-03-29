import { Route } from '@angular/router';
import { ShellComponent } from './shared/shell/shell.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories-list/categories.component';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';
import { OrdersDetailsComponent } from './pages/orders/orders-details/orders-details.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: ShellComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'products',
                component: ProductListComponent,
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
                component: CategoriesComponent,
                children: [
                    { path: 'form', component: CategoriesFormComponent },
                    {
                        path: 'form/:categoryId',
                        component: CategoriesFormComponent,
                    },
                ],
            },
            { path: 'orders', component: OrdersListComponent },
            { path: 'orders/:orderId', component: OrdersDetailsComponent },
            {
                path: 'users',
                component: UsersListComponent,
                children: [
                    { path: 'form', component: UsersFormComponent },
                    { path: 'form/:userId', component: UsersFormComponent },
                ],
            },
        ],
    },
];
