import { Component, OnInit } from '@angular/core';
import { CompteService } from '../../services/compte.service';
import { Compte } from '../../models/compte.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-comptes',
  templateUrl: './comptes.component.html',
  styleUrl: './comptes.component.css',
  imports: [CommonModule],
})
export class ComptesComponent implements OnInit {
  comptes: Compte[] = [];

  constructor(
    private router: Router,
    private compteService: CompteService
  ) {}

  users: User[] = [];

  ngOnInit(): void {
    this.compteService.recupereListComptes().subscribe((data) => {
      this.comptes = data;
      console.log("liste comptes: ", data)
    });
    this.loadData();
  }

  loadData(): void {
    // Charger les utilisateurs
    // this.users = this.authService
    //   .getAllUsers()
    //   .filter((u) => u.role === 'user');
  }
}
