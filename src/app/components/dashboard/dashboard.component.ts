import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { User } from '../../models/user.interface';
import { Transaction } from '../../models/transaction.interface';
import { CompteService } from '../../services/compte.service';
import { Compte } from '../../models/compte.interface';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentTransactions: Transaction[] = [];
  solde: number | undefined;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router,
    private readonly compteService: CompteService
    
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.getSolde(this.currentUser.id);
    }
    this.load10RecentTransactions();
  }

  getSolde(userId: number) {
    this.compteService.recuperCompteUtilisateur(userId).subscribe({
      next: (res) => {
        this.solde = res.solde;
        console.log('solde: ', res.solde);
      },
      error(err) {
        console.error('Erreur survenu lors de la récupération du solde.');
      },
    });
  }

  load10RecentTransactions(): void { 
    this.transactionService.get10RecentTransactionsOfCurrentUser().subscribe({
      next: (res) => {
        this.recentTransactions = res
        console.log("transactions: ", res)
      },
      error() {
        console.error("Erreur survenu lors de la recuperation des 10 récents transactions")
      },
    })
  }

  getTransactionTitle(transaction: Transaction): string {
    switch (transaction.type) {
      case 'DEPOSIT':
        return "Dépôt d'argent";
      case 'WITHDRAWAL':
        return "Retrait d'argent";
      case 'TRANSFER_SENT':
        return `Transfert vers ${transaction.source?.utilisateur?.prenom} ${transaction.source?.utilisateur?.nom}`;
      case 'TRANSFER_RECEIVED':
        return `Reçu de ${transaction.destinataire?.utilisateur?.prenom} ${transaction.destinataire?.utilisateur?.nom}`;
      default:
        return 'Transaction';
    }
  }

  getTransactionIconClass(type: string): string {
    switch (type) {
      case 'DEPOSIT':
        return 'bg-green-100 text-green-600';
      case 'WITHDRAWAL':
        return 'bg-red-100 text-red-600';
      case 'TRANSFERT_SENT':
        return 'bg-blue-100 text-blue-600';
      case 'TRANSFERT_RECEIVED':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getAmountClass(type: string): string {
    switch (type) {
      case 'deposit':
      case 'TRANSFERT_RECEIVED':
        return 'text-green-600';
      case 'WITHDRAWAL':
      case 'TRANSFERT_SENT':
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  }

  getTransactionAmountDisplay(transaction: Transaction): string {
    const prefix =
      transaction.type === 'DEPOSIT' ||
      transaction.type === 'TRANSFER_RECEIVED'
        ? '+'
        : '-';
    const amount =
      transaction.type === 'TRANSFER_SENT'
        ? transaction.totalAmount
        : transaction.montant;
    return `${prefix}${amount.toFixed(2)} F CFA`;
  }

  navigateToDeposit(): void {
    this.router.navigate(['/main/deposit']);
  }

  navigateToTransfer(): void {
    this.router.navigate(['/main/transfer']);
  }

  navigateToWithdraw(): void {
    this.router.navigate(['/main/withdraw']);
  }

  navigateToTransactions(): void {
    this.router.navigate(['/main/transactions']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
