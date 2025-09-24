import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { User } from '../../models/user.interface';
import { Transaction } from '../../models/transaction.interface';
import { CompteService } from '../../services/compte.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { DashboardService } from '../../services/dashboard.service';
import { AdminStatistics } from '../../models/admin.interface';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  currentUser: User | null = null;
  users: User[] = [];
  recentTransactions: Transaction[] = [];
  stats: AdminStatistics = {
    totalUsers: 0,
    totalTransactions: 0,
    totalBalance: 0,
    totalFees: 0,
  };

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router,
    private compteService: CompteService,
    private utilisateurService: UtilisateurService,
    private readonly dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
    this.getStatistics();
  }

  loadData(): void {
    // Charger les utilisateurs
    this.utilisateurService.recuperListUtilisateurs().subscribe((data) => {
      this.users = data;
      console.log('users: ', data);
    });

    // Charger les transactions
    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions.slice(0, 10);
      },
    });
  }

  getStatistics() {
    this.dashboardService.getStatistics().subscribe({
      next: (res: AdminStatistics) => {
        console.table(res);
        this.stats = res;
      },
    });
  }

  load10RecentTransactions(): void {
    this.transactionService.get10RecentTransactionsOfCurrentUser().subscribe({
      next: (res) => {
        this.recentTransactions = res;
      },
      error() {
        console.error(
          'Erreur survenu lors de la recuperation des 10 récents transactions'
        );
      },
    });
  }

  getTransactionTitle(transaction: Transaction): string {
    // const user = this.users.find(u => u.id === transaction.fromUserId || u.id === transaction.toUserId);
    // const userName = user ? `${user.prenom} ${user.nom}` : 'Utilisateur';

    // switch (transaction.type) {
    //   case 'deposit':
    //     return `Dépôt - ${userName}`;
    //   case 'withdrawal':
    //     return `Retrait - ${userName}`;
    //   case 'transfer_sent':
    //     return `Transfert ${transaction.fromUser?.firstName} → ${transaction.toUser?.firstName}`;
    //   case 'transfer_received':
    //     return `Transfert ${transaction.fromUser?.firstName} → ${transaction.toUser?.firstName}`;
    //   default:
    //     return 'Transaction';
    // }
    return '';
  }

  getTransactionIconClass(type: string): string {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-600';
      case 'withdrawal':
        return 'bg-red-100 text-red-600';
      case 'transfer_sent':
      case 'transfer_received':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
