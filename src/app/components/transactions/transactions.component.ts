import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.interface';    
import { FormsModule } from '@angular/forms'; //ce que g ajoute


@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  allTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  selectedType = '';
  selectedStatus = '';

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.transactionService.getUserTransactions(currentUser.id).subscribe({
        next: (transactions) => {
          this.allTransactions = transactions;
          this.filteredTransactions = [...transactions];
        }
      });
    }
  }

  applyFilters(): void {
    this.filteredTransactions = this.allTransactions.filter(transaction => {
      if (this.selectedType && transaction.type !== this.selectedType) {
        return false;
      }
      if (this.selectedStatus && transaction.status !== this.selectedStatus) {
        return false;
      }
      return true;
    });
  }

  resetFilters(): void {
    this.selectedType = '';
    this.selectedStatus = '';
    this.filteredTransactions = [...this.allTransactions];
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
    return `${prefix}${amount.toFixed(2)} €`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  }

  goBack(): void {
    this.router.navigate(['/main/dashboard']);
  }
}