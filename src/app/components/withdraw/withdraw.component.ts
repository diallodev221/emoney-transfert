import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent {
  currentUser: User | null = null;
  amount: number | null = null;
  fees = 0;
  totalAmount = 0;
  loading = false;
  error = '';
  success = '';

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  calculateFees(): void {
    if (this.amount && this.amount > 0) {
      this.fees = this.amount * 0.01; // 1% de frais
      this.totalAmount = this.amount + this.fees;
    } else {
      this.fees = 0;
      this.totalAmount = 0;
    }
  }

  canWithdraw(): boolean {
    if (!this.currentUser || !this.amount || this.amount <= 0) {
      return false;
    }
    return this.currentUser.balance >= this.totalAmount;
  }

  onSubmit(): void {
    if (!this.amount || this.amount <= 0) {
      this.error = 'Veuillez saisir un montant valide';
      return;
    }

    if (!this.canWithdraw()) {
      this.error = 'Solde insuffisant pour effectuer ce retrait';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.transactionService.withdraw(this.amount).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.success) {
          this.success = `Retrait de ${this.amount} F CFA effectué avec succès ! (Frais: ${this.fees.toFixed(2)} F CFA)`;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        } else {
          this.error = result.message || 'Erreur lors du retrait';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Une erreur est survenue lors du retrait';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
