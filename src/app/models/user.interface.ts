export interface User {
  id: number;
  prenom: string;
  nom: string;
  phone?: string; // ancien champ
  email?: string;
  country?: string; // ancien champ
  photo?: string;
  idNumber?: string; // ancien champ
  idPhoto?: string; // ancien champ
  role?: 'user' | 'admin'; // ancien champ
  balance?: number; // ancien champ
  isActive?: boolean; // ancien champ
  createdAt?: Date; // ancien champ

  // Champs du modèle JSON fourni
  telephone?: string;
  pays?: string;
  numeroPiece?: string;
  photoPiece?: string;
  profile?: any;
}

export interface UserRegistration {
  prenom: string;
  nom: string;
  phone: string;
  email?: string;
  country: string;
  idNumber: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  typeToken: string;
  utilisateur: User;
}
