import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent } from './components/layout';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'main',
    component: LayoutComponent,
    children: [
      {
        path: 'admin',
        loadComponent: () =>
          import('./components/admin/admin.component').then(
            (m) => m.AdminComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'transfer',
        loadComponent: () =>
          import('./components/transfer/transfer.component').then(
            (m) => m.TransferComponent
          ),
      },
      {
        path: 'deposit',
        loadComponent: () =>
          import('./components/deposit/deposit.component').then(
            (m) => m.DepositComponent
          ),
      },
      {
        path: 'withdraw',
        loadComponent: () =>
          import('./components/withdraw/withdraw.component').then(
            (m) => m.WithdrawComponent
          ),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./components/transactions/transactions.component').then(
            (m) => m.TransactionsComponent
          ),
      },
      {
        path: 'comptes',
        loadComponent: () =>
          import('./components/comptes/comptes.component').then(
            (m) => m.ComptesComponent
          ),
      },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
