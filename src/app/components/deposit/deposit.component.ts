import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { CompteService } from '../../services/compte.service';
import { Compte } from '../../models/compte.interface';

@Component({
  selector: 'app-deposit',
  imports: [CommonModule, FormsModule],
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
})
export class DepositComponent implements OnInit {
  amount: number | null = null;
  loading = false;
  error = '';
  success = '';
  compteUser: Compte | null = null;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private compteService: CompteService
  ) {}

  ngOnInit(): void {
    this.recuperCompteUtilisateur();
  }

  recuperCompteUtilisateur() {
    this.compteService.recuperCompteUtilisateur(2).subscribe({
      next: (res) => {
        console.log(res);
        this.compteUser = res;
      },
      error(err) {
        console.error('Error survenu lors de la recuperation du compte');
      },
    });
  }

  onSubmit(): void {
    if (!this.amount || this.amount <= 0) {
      this.error = 'Veuillez saisir un montant valide';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    if(!this.compteUser) {
      this.error = 'Compte est obligatoire';
      return;
    }

    this.compteService.deposit(this.compteUser?.id, this.amount).subscribe({
      next: (result) => {
        this.loading = false;
        if (result) {
          this.success = `Dépôt de ${this.amount} F CFA effectué avec succès !`;
          setTimeout(() => {
            this.router.navigate(['/main/dashboard']);
          }, 2000);
        } else {
          this.error = 'Erreur lors du dépôt';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Une erreur est survenue lors du dépôt';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/main/dashboard']);
  }
}
