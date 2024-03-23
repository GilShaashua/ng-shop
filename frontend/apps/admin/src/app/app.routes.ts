import { Route } from '@angular/router';
import { ShellComponent } from './shared/shell/shell.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories-list/categories.component';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { OrdersComponent } from '@frontend/orders';
import { UsersComponent } from '@frontend/users';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';

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
            { path: 'orders', component: OrdersComponent },
            { path: 'users', component: UsersComponent },
        ],
    },
];
