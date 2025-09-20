export interface Compte {
  id: number;
  solde: number;
  active: boolean;
  dateCreation: string;
  utilisateur: Utilisateur;
}

export interface Utilisateur {
  id: number;
  prenom: string;
  nom: string;
}
