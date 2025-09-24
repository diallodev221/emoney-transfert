import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.interface';
import { UtilisateurService } from '../../services/utilisateur.service';
import { CommonModule } from '@angular/common';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class UtilisateursComponent implements OnInit {
  users: User[] = [];

  showUserModal = false;
  userModalMode: 'add' | 'edit' = 'add';
  selectedUser: User | null = null;

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

  openAddUserModal() {
    this.userModalMode = 'add';
    this.selectedUser = {
      id: 0,
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      pays: '',
      numeroPiece: '',
      photo: '',
      photoPiece: '',
    };
    this.showUserModal = true;
  }

  openEditUserModal(user: User) {
    this.userModalMode = 'edit';
    this.selectedUser = { ...user };
    this.showUserModal = true;
  }

  closeUserModal() {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  toggleUserActive(user: User) {
    // Inverse l'état actif/inactif localement
    user.isActive = !user.isActive;
    // Si tu veux persister côté serveur, décommente et adapte :
    // this.utilisateurService.updateUserStatus(user.id, !user.isActive).subscribe(() => this.loadData());
  }
}
