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
    email: '',
    password: ''
  };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (result) => {
        console.log("user: ", result.utilisateur)
        console.log("token: ", result.token)
        this.loading = false;
        if (result.token && result.utilisateur) {

          this.router.navigate(['/main/dashboard']);
          // if (result.user.role === 'admin') {
          // } else {
          //   this.router.navigate(['/main/dashboard']);
          // }
        } else {
          this.error = 'Erreur lors de la connexion';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Une erreur est survenue';
      }
    });
  }
}