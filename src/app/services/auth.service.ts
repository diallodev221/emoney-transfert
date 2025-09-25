import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import {
  User,
  UserRegistration,
  LoginCredentials,
  LoginResponse,
} from '../models/user.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private authUrl = 'http://localhost:9090/api/auth';

  constructor(private readonly http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
     
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authUrl}/login`, credentials)
      .pipe(
        tap((res) => {
          if (res.utilisateur) {
            this.currentUserSubject.next(res.utilisateur);
            localStorage.setItem(
              'currentUser',
              JSON.stringify(res.utilisateur)
            );
            localStorage.setItem('token', res.token);
          }
        })
      );
  }

  register(userData: UserRegistration): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/register`, userData)
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.clear();
  }


  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.profile?.name === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthToken(): string | null {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      return "";
    }
    return savedToken
  }

  updateUserBalance(userId: number, newBalance: number): void {
    // const userIndex = this.users.findIndex((u) => u.id === userId);
    // if (userIndex !== -1) {
    //   this.users[userIndex].balance = newBalance;
    //   if (this.currentUserSubject.value?.id === userId) {
    //     const updatedUser = {
    //       ...this.currentUserSubject.value,
    //       balance: newBalance,
    //     };
    //     this.currentUserSubject.next(updatedUser);
    //     localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    //   }
    // }
  }

  // findUserByPhone(phone: string): User | undefined {
  //   // return this.users.find((u) => u.phone === phone && u.isActive);
  //   return null
  // }

  // getAllUsers(): User[] {
  //   return this.users;
  // }
}
