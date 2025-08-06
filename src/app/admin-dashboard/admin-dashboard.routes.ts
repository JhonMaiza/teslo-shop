import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { ProductsAdminPageComponent } from './pages/products-admin-page/products-admin-page.component';
import { ProductAdminPageComponent } from './pages/product-admin-page/product-admin-page.component';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';

export const adminDashoardRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        canMatch: [
            IsAdminGuard,
        ],
        children: [
            {
                path: 'products',
                component: ProductsAdminPageComponent
            },
            {
                path: 'product/:id',
                component: ProductAdminPageComponent
            },
            {
                path: '**',
                redirectTo: 'products'
            }
            
        ]
    }
]

export default adminDashoardRoutes;