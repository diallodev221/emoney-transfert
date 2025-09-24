import { Component, OnInit } from '@angular/core';
import { CompteService } from '../../services/compte.service';
import { Compte } from '../../models/compte.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../models/user.interface';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-comptes',
  templateUrl: './comptes.component.html',
  styleUrl: './comptes.component.css',
  imports: [CommonModule, FormsModule, LucideAngularModule],
})
export class ComptesComponent implements OnInit {
  comptes: Compte[] = [];
  users: User[] = [];

  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedCompte: Compte | null = null;

  constructor(private router: Router, private compteService: CompteService) {}

  ngOnInit(): void {
    this.compteService.recupereListComptes().subscribe((data) => {
      this.comptes = data;
      console.log('liste comptes: ', data);
    });
    this.loadData();
  }

  loadData(): void {
    // Charger les utilisateurs
    // this.users = this.authService
    //   .getAllUsers()
    //   .filter((u) => u.role === 'user');
  }

  openAddCompteModal() {
    this.modalMode = 'add';
    this.selectedCompte = {
      id: 0,
      numeroCompte: '',
      solde: 0,
      active: true,
      dateCreation: '',
      utilisateur: { id: 0, prenom: '', nom: '' },
    };
    this.showModal = true;
  }

  openEditCompteModal(compte: Compte) {
    this.modalMode = 'edit';
    this.selectedCompte = { ...compte };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedCompte = null;
  }
}
