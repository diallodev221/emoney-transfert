export interface Compte {
  id: number;
  solde: number;
  active: boolean;
  dateCreation: string;
  utilisateur: UtilisateurCompte;
  numeroCompte: string;
}

export interface UtilisateurCompte {
  id: number;
  prenom: string;
  nom: string;
}
