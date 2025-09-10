import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { User } from '../../models/user.interface';
import { Transaction } from '../../models/transaction.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentTransactions: Transaction[] = [];

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRecentTransactions();
  }

  loadRecentTransactions(): void {
    if (this.currentUser) {
      this.transactionService.getUserTransactions(this.currentUser.id).subscribe({
        next: (transactions) => {
          this.recentTransactions = transactions.slice(0, 5);
        }
      });
    }
  }

  getTransactionTitle(transaction: Transaction): string {
    switch (transaction.type) {
      case 'deposit':
        return 'Dépôt d\'argent';
      case 'withdrawal':
        return 'Retrait d\'argent';
      case 'transfer_sent':
        return `Transfert vers ${transaction.toUser?.firstName} ${transaction.toUser?.lastName}`;
      case 'transfer_received':
        return `Reçu de ${transaction.fromUser?.firstName} ${transaction.fromUser?.lastName}`;
      default:
        return 'Transaction';
    }
  }

  getTransactionIconClass(type: string): string {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-600';
      case 'withdrawal':
        return 'bg-red-100 text-red-600';
      case 'transfer_sent':
        return 'bg-blue-100 text-blue-600';
      case 'transfer_received':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getAmountClass(type: string): string {
    switch (type) {
      case 'deposit':
      case 'transfer_received':
        return 'text-green-600';
      case 'withdrawal':
      case 'transfer_sent':
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  }

  getTransactionAmountDisplay(transaction: Transaction): string {
    const prefix = (transaction.type === 'deposit' || transaction.type === 'transfer_received') ? '+' : '-';
    const amount = transaction.type === 'transfer_sent' ? transaction.totalAmount : transaction.amount;
    return `${prefix}${amount.toFixed(2)} F CFA`;
  }

  navigateToDeposit(): void {
    this.router.navigate(['/deposit']);
  }

  navigateToTransfer(): void {
    this.router.navigate(['/transfer']);
  }

  navigateToWithdraw(): void {
    this.router.navigate(['/withdraw']);
  }

  navigateToTransactions(): void {
    this.router.navigate(['/transactions']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}