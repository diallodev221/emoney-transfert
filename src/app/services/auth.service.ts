import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, UserRegistration, LoginCredentials } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private users: User[] = [
    {
      id: '1',
      firstName: 'Admin',
      lastName: 'System',
      phone: '123456789',
      email: 'admin@system.com',
      country: 'Senegal',
      idNumber: 'ID123456',
      role: 'admin',
      balance: 0,
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      firstName: 'Anna',
      lastName: 'Seck',
      phone: '987654321',
      email: 'anna@email.com',
      country: 'Senegal',
      idNumber: 'ID789012',
      role: 'user',
      balance: 1500.50,
      isActive: true,
      createdAt: new Date('2024-01-15')
    }
  ];

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<{ success: boolean; user?: User; message?: string }> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const user = this.users.find(u => 
          u.phone === credentials.phone && u.isActive
        );

        if (user) {
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          return { success: true, user };
        }
        
        return { success: false, message: 'Numéro de téléphone ou mot de passe incorrect' };
      })
    );
  }

  register(userData: UserRegistration): Observable<{ success: boolean; user?: User; message?: string }> {
    return of(null).pipe(
      delay(1500),
      map(() => {
        if (this.users.find(u => u.phone === userData.phone)) {
          return { success: false, message: 'Ce numéro de téléphone est déjà utilisé' };
        }

        const newUser: User = {
          id: (this.users.length + 1).toString(),
          ...userData,
          role: 'user',
          balance: 0,
          isActive: true,
          createdAt: new Date()
        };

        this.users.push(newUser);
        return { success: true, user: newUser };
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateUserBalance(userId: string, newBalance: number): void {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex].balance = newBalance;
      if (this.currentUserSubject.value?.id === userId) {
        const updatedUser = { ...this.currentUserSubject.value, balance: newBalance };
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  }

  findUserByPhone(phone: string): User | undefined {
    return this.users.find(u => u.phone === phone && u.isActive);
  }

  getAllUsers(): User[] {
    return this.users;
  }
}