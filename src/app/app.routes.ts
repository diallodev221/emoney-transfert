import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { WithdrawComponent } from './components/withdraw/withdraw.component';
import { LayoutComponent } from './components/layout';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'main',
    component: LayoutComponent,
    children: [
      { path: 'admin', component: AdminComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transfer', component: TransferComponent },
      { path: 'deposit', component: DepositComponent },
      { path: 'withdraw', component: WithdrawComponent },
      { path: 'transactions', component: TransactionsComponent },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
