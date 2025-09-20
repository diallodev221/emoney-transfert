
export interface User {
  id: number;
  prenom: string;
  nom: string;
  phone: string;
  email?: string;
  country: string;
  photo?: string;
  idNumber: string;
  idPhoto?: string;
  role: 'user' | 'admin';
  balance: number;
  isActive: boolean;
  createdAt: Date;
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
  utilisateur: User
}

