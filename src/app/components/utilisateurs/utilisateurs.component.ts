import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.interface';
import { AuthService } from '../../services/auth.service';
import { CompteService } from '../../services/compte.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-utilisateurs',
  imports: [],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css',
})
export class UtilisateursComponent implements OnInit {
  users: User[] = [];

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router,
    private compteService: CompteService
  ) {}

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    // Charger les utilisateurs
  //   this.users = this.authService
  //     .getAllUsers()
  //     .filter((u) => u.role === 'user');
  }
}
