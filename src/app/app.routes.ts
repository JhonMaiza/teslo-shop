import { Routes } from '@angular/router';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.route'),
        canMatch: [
            // () => {
            //     console.log('hola mundo');
            //     return true;
            // },
            NotAuthenticatedGuard,
        ]
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes'),
    }
];
