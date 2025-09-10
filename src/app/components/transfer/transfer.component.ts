import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {
  currentUser: User | null = null;
  transferData = {
    toUserPhone: '',
    amount: null as number | null,
    description: ''
  };
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
    if (this.transferData.amount && this.transferData.amount > 0) {
      this.fees = this.transferData.amount * 0.005; // 0.5% de frais
      this.totalAmount = this.transferData.amount + this.fees;
    } else {
      this.fees = 0;
      this.totalAmount = 0;
    }
  }

  canTransfer(): boolean {
    if (!this.currentUser || !this.transferData.amount || this.transferData.amount <= 0) {
      return false;
    }
    return this.currentUser.balance >= this.totalAmount;
  }

  onSubmit(): void {
    if (!this.transferData.toUserPhone || !this.transferData.amount || this.transferData.amount <= 0) {
      this.error = 'Veuillez remplir tous les champs requis';
      return;
    }

    if (!this.canTransfer()) {
      this.error = 'Solde insuffisant pour effectuer ce transfert';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const transferRequest = {
      toUserPhone: this.transferData.toUserPhone,
      amount: this.transferData.amount,
      description: this.transferData.description || undefined
    };

    this.transactionService.transfer(transferRequest).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.success) {
          this.success = `Transfert de ${this.transferData.amount}€ effectué avec succès ! (Frais: ${this.fees.toFixed(2)}€)`;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        } else {
          this.error = result.message || 'Erreur lors du transfert';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Une erreur est survenue lors du transfert';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
