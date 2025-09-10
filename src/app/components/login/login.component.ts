import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  credentials = {
    phone: '',
    password: ''
  };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.phone || !this.credentials.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.success && result.user) {
          if (result.user.role === 'admin') {
            this.router.navigate(['/main/admin']);
          } else {
            this.router.navigate(['/main/dashboard']);
          }
        } else {
          this.error = result.message || 'Erreur lors de la connexion';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Une erreur est survenue';
      }
    });
  }
}