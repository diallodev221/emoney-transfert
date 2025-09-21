import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.interface';
import { UtilisateurService } from '../../services/utilisateur.service';
import { CommonModule } from '@angular/common';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css',
  standalone: true,
})
export class UtilisateursComponent implements OnInit {
  users: User[] = [];

  constructor(
    private router: Router,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Charger les utilisateurs
    this.utilisateurService.recuperListUtilisateurs().subscribe((data) => {
      this.users = data;
      console.log('users: ', data);
    });
  }
}
