import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { 
            path: 'dashboard', 
            loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
        },
        { 
            path: 'income', 
            loadComponent: () => import('./features/transactions/transaction-form.component').then(m => m.TransactionFormComponent) 
        },
        { 
            path: 'income/:id', 
            loadComponent: () => import('./features/transactions/transaction-form.component').then(m => m.TransactionFormComponent) 
        },
        { 
            path: 'expense', 
            loadComponent: () => import('./features/transactions/transaction-form.component').then(m => m.TransactionFormComponent) 
        },
        { 
            path: 'expense/:id', 
            loadComponent: () => import('./features/transactions/transaction-form.component').then(m => m.TransactionFormComponent) 
        },
        { 
            path: 'reports', 
            loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent) 
        },
        {
            path: 'settings',
            loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
        }
    ]
  }
];
