import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent {
  amount: number | null = null;
  loading = false;
  error = '';
  success = '';

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.amount || this.amount <= 0) {
      this.error = 'Veuillez saisir un montant valide';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.transactionService.deposit(this.amount).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.success) {
          this.success = `Dépôt de ${this.amount} F CFA effectué avec succès !`;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        } else {
          this.error = result.message || 'Erreur lors du dépôt';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Une erreur est survenue lors du dépôt';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}