import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.interface';
import { CompteService } from '../../services/compte.service';
import { Compte } from '../../models/compte.interface';

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css'],
})
export class WithdrawComponent implements OnInit {
  currentUser: User | null = null;
  amount: number | null = null;
  fees = 0;
  totalAmount = 0;
  loading = false;
  error = '';
  success = '';
  soldeDisponible: number | undefined;
  currentCompte: Compte | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private compteService: CompteService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    if (this.currentUser) {
      this.recupererCompteCurrentUser(this.currentUser.id);
    }
  }

  recupererCompteCurrentUser(userId: number) {
    this.compteService.recuperCompteUtilisateur(userId).subscribe({
      next: (res) => {
        console.log('current user account: ', res);
        this.soldeDisponible = res.solde;
        this.currentCompte = res;
      },
      error(err) {
        console.error(
          "Erreur survenu lors de la recuperation du compte de l'utilisateur connecté"
        );
      },
    });
  }

  canWithdraw(): boolean {
    if (!this.currentCompte || !this.amount || this.amount <= 0) {
      return false;
    }
    return this.currentCompte?.solde >= this.amount;
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

    if (!this.currentCompte) {
      this.error = 'Un compte est obligatoire';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.compteService.retrait(this.currentCompte.id, this.amount).subscribe({
      next: (result) => {
        this.loading = false;
        if (result) {
          this.success = `Retrait de ${this.amount} F CFA effectué avec succès !`;
          setTimeout(() => {
            this.router.navigate(['/main/dashboard']);
          }, 2000);
        } else {
          this.error = 'Erreur lors du retrait';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Une erreur est survenue lors du retrait';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/main/dashboard']);
  }
}
