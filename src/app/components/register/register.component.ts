import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRegistration } from '../../models/user.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userData: UserRegistration = {
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
    numeroPiece: '',
    motDePasse: '',
    pays: '',
  };
  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    this.success = '';

    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    this.authService.register(this.userData).subscribe({
      next: (result) => {
        this.loading = false;
        if (result) {
          this.success = 'Compte créé avec succès ! Redirection vers la connexion...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.error = 'Erreur lors de la création du compte';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Une erreur est survenue lors de la création du compte';
      }
    });
  }

  private validateForm(): boolean {
    if (!this.userData.prenom || !this.userData.prenom.trim()) {
      this.error = 'Le prénom est requis';
      return false;
    }
    if (!this.userData.nom || !this.userData.nom.trim()) {
      this.error = 'Le nom est requis';
      return false;
    }
    if (!this.userData.telephone || !this.userData.telephone.trim()) {
      this.error = 'Le numéro de téléphone est requis';
      return false;
    }
    if (!this.userData.pays || !this.userData.pays.trim()) {
      this.error = 'Le pays est requis';
      return false;
    }
    if (!this.userData.numeroPiece || !this.userData.numeroPiece.trim()) {
      this.error = 'Le numéro de pièce d\'identité est requis';
      return false;
    }
    if (!this.userData.motDePasse || this.userData.motDePasse.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return false;
    }
    return true;
  }
}