import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.interface';
import { CompteService } from '../../services/compte.service';
import { Compte } from '../../models/compte.interface';
import { TransferRequest } from '../../models/transaction.interface';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
})
export class TransferComponent implements OnInit {
  currentUser: User | null = null;
  transferData = {
    compteDst: '',
    amount: null as number | null,
    description: '',
  };
  fees = 0;
  totalAmount = 0;
  loading = false;
  error = '';
  success = '';
  users: User[] = [];

  comptes: Compte[] = [];
  soldeDisponible: number = 0;
  currentCompte: Compte | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private compteService: CompteService,
    private transactionService: TransactionService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.recuperComptes();

    if(this.currentUser) {
      this.recupererCompteCurrentUser(this.currentUser.id);
    }


  }

  recupererCompteCurrentUser(userId: number) {
    this.compteService.recuperCompteUtilisateur(userId).subscribe({
      next: (res) => {
        console.log("current user account: ", res)
        this.soldeDisponible = res.solde
        this.currentCompte = res
      },
      error(err) {
        console.error("Erreur survenu lors de la recuperation du compte de l'utilisateur connecté")
      },
    })
  }

  recuperComptes() {
    this.compteService.recupereListComptesAEnvoyer().subscribe({
      next: (res) => {
        console.log('Comptes: ', res);
        this.comptes = res;
      },
    });
  }

  

  calculateFees(): void {
    if (this.transferData.amount && this.transferData.amount > 0) {
      this.fees = this.transferData.amount * 0.005; // 0.5% de frais
      this.totalAmount = this.transferData.amount - this.fees;
    } else {
      this.fees = 0;
      this.totalAmount = 0;
    }
  }

  canTransfer(): boolean {
    if (
      !this.currentCompte ||
      !this.transferData.amount ||
      this.transferData.amount <= 0
    ) {
      return false;
    }
    return this.currentCompte?.solde >= this.totalAmount;
  }

  onSubmit(): void {
    if (
      !this.transferData.compteDst ||
      !this.transferData.amount ||
      this.transferData.amount <= 0 ||
      !this.currentCompte
    ) {
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

  

    const transferRequest: TransferRequest = {
      compteSourceId: this.currentCompte.id,
      amount: this.transferData.amount,
      description: this.transferData.description || undefined,
      compteDestinataireId: parseInt(this.transferData.compteDst),
    };

    console.log("Transaction: ", transferRequest)

    this.transactionService.transfer(transferRequest).subscribe({
      next: (result) => {
        this.loading = false;
        if (result) {
          this.success = `Transfert de ${
            this.transferData.amount
          }CFA effectué avec succès ! (Frais: ${this.fees.toFixed(2)} CFA)`;
          setTimeout(() => {
            this.router.navigate(['/main/dashboard']);
          }, 2000);
        } else {
          this.error = 'Erreur lors du transfert';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Une erreur est survenue lors du transfert';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/main/dashboard']);
  }
}
