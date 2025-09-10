export interface User {
  id: string;
  firstName: string;
  lastName: string;
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
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  country: string;
  idNumber: string;
  password: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}