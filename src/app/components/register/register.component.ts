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
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userData: UserRegistration = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    country: '',
    idNumber: '',
    password: ''
  };
  loading = false;
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
        if (result.success) {
          this.success = 'Compte créé avec succès ! Redirection vers la connexion...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.error = result.message || 'Erreur lors de la création du compte';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Une erreur est survenue lors de la création du compte';
      }
    });
  }

  private validateForm(): boolean {
    if (!this.userData.firstName.trim()) {
      this.error = 'Le prénom est requis';
      return false;
    }
    if (!this.userData.lastName.trim()) {
      this.error = 'Le nom est requis';
      return false;
    }
    if (!this.userData.phone.trim()) {
      this.error = 'Le numéro de téléphone est requis';
      return false;
    }
    if (!this.userData.country) {
      this.error = 'Le pays est requis';
      return false;
    }
    if (!this.userData.idNumber.trim()) {
      this.error = 'Le numéro de pièce d\'identité est requis';
      return false;
    }
    if (!this.userData.password || this.userData.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return false;
    }

    return true;
  }
}