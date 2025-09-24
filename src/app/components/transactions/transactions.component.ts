import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, TransactionStatus, TransactionType } from '../../models/transaction.interface';    
import { FormsModule } from '@angular/forms'; //ce que g ajoute


@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  allTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  selectedType: TransactionType | string = '';
  selectedStatus: TransactionStatus | string = '';

  // Définition des statuts pour affichage dans les filtres ou ailleurs
  statusList: { libelle: string; value: TransactionStatus }[] = [
    { libelle: 'Terminé', value: TransactionStatus.TERMINE },
    { libelle: 'En cours', value: TransactionStatus.EN_COURS },
    { libelle: 'Échoué', value: TransactionStatus.ECHOUE },
  ];

  typesList: { libelle: string; value: TransactionType }[] = [
    { libelle: 'Dépôt', value: TransactionType.DEPOSIT },
    { libelle: 'Retrait', value: TransactionType.WITHDRAWAL },
    { libelle: 'Transfert envoyé', value: TransactionType.TRANSFER_SENT },
    { libelle: 'Transfert reçu', value: TransactionType.TRANSFER_RECEIVED },
  ];

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.transactionService.getUserTransactions().subscribe({
      next: (res) => {
        console.log('transactions: ', res);
      },
    });
    this.loadFilteredTransactions();
  }

  loadFilteredTransactions(): void {
    this.transactionService
      .getFilteredTransactions(this.selectedType, this.selectedStatus)
      .subscribe({
        next: (res) => {
          this.filteredTransactions = res;
        },
        error() {
          console.error(
            'Erreur survenu lors de la recuperation des 10 récents transactions'
          );
        },
      });
  }

  // applyFilters(): void {
  //   this.filteredTransactions = this.allTransactions.filter((transaction) => {
  //     if (this.selectedType && transaction.type !== this.selectedType) {
  //       return false;
  //     }
  //     if (this.selectedStatus && transaction.status !== this.selectedStatus) {
  //       return false;
  //     }
  //     return true;
  //   });
  // }

  resetFilters(): void {
    this.selectedType = '';
    this.selectedStatus = '';
    this.filteredTransactions = [...this.allTransactions];
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
      case 'TRASFERT_SENT':
        return 'bg-blue-100 text-blue-600';
      case 'TRASFERT_RECEIVED':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getAmountClass(type: string): string {
    switch (type) {
      case 'DEPOSIT':
      case 'TRASFERT_RECEIVED':
        return 'text-green-600';
      case 'WITHDRAWAL':
      case 'TRASFERT_SENT':
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  }

  getTransactionAmountDisplay(transaction: Transaction): string {
    const prefix =
      transaction.type === 'DEPOSIT' || transaction.type === 'TRANSFER_RECEIVED'
        ? '+'
        : '-';
    const amount =
      transaction.type === 'TRANSFER_SENT'
        ? transaction.totalAmount
        : transaction.montant;
    return `${prefix}${amount.toFixed(1)} FCFA`;
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