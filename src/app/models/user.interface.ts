export interface User {
  id: number;
  prenom: string;
  nom: string;
  email?: string;
  photo?: string;
  isActive?: boolean; 
  dateInscription?: Date; 
  telephone?: string;
  pays?: string;
  numeroPiece?: string;
  photoPiece?: string;
  profile?: Profile;
}

export interface UserRequestUpdate {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  pays: string;
  numeroPiece: string;
  profileId: number;
}

export interface Profile {
  id: number;
  name: string;
  description: string;
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
