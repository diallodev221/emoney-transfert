import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Compte } from '../models/compte.interface';

@Injectable({
  providedIn: 'root',
})
export class CompteService {
  private sprignbootUrl: string = 'http://localhost:9090/api/comptes';

  constructor(private http: HttpClient) {}

  // recupere la liste des comptes
  recupereListComptes() {
    return this.http.get<Compte[]>(`${this.sprignbootUrl}/actifs`);
  }

  recuperCompteUtilisateur(userId: number) {
    return this.http.get<Compte>(`${this.sprignbootUrl}/utilisateur/${userId}`);
  }

  deposit(compteId: number, amount: number) {
    return this.http.post<Compte>(
      `${this.sprignbootUrl}/${compteId}/crediter?montant=${amount}`,
      null
    );
  }

  retrait(compteId: number, amount: number) {
    return this.http.post<Compte>(
      `${this.sprignbootUrl}/${compteId}/debiter?montant=${amount}`,
      null
    );
  }

  getSolde() {
    return this.http.get<{ solde : number}>(`${this.sprignbootUrl}/solde`);
  }
}
