import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Transaction, TransferRequest } from '../models/transaction.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      amount: 1000,
      fee: 0,
      totalAmount: 1000,
      toUserId: '2',
      status: 'completed',
      description: 'Dépôt initial',
      createdAt: new Date('2024-01-16'),
      processedAt: new Date('2024-01-16')
    },
    {
      id: '2',
      type: 'transfer_received',
      amount: 500,
      fee: 5,
      totalAmount: 500,
      fromUserId: '1',
      toUserId: '2',
      fromUser: { firstName: 'Admin', lastName: 'System', phone: '123456789' },
      toUser: { firstName: 'Anna', lastName: 'Seck', phone: '987654321' },
      status: 'completed',
      description: 'Bonus de bienvenue',
      createdAt: new Date('2024-01-17'),
      processedAt: new Date('2024-01-17')
    },
    {
      id: '3',
      type: 'transfer_received',
      amount: 500,
      fee: 5,
      totalAmount: 500,
      fromUserId: '1',
      toUserId: '2',
      fromUser: { firstName: 'Admin', lastName: 'System', phone: '123456789' },
      toUser: { firstName: 'Anna', lastName: 'Seck', phone: '987654321' },
      status: 'completed',
      description: 'Bonus de bienvenue',
      createdAt: new Date('2024-01-17'),
      processedAt: new Date('2024-01-17')
    }
  ];

  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.transactions);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor(private authService: AuthService) {}

  deposit(amount: number): Observable<{ success: boolean; message?: string; transaction?: Transaction }> {
    return of(null).pipe(
      delay(2000),
      map(() => {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          return { success: false, message: 'Utilisateur non connecté' };
        }

        if (amount <= 0) {
          return { success: false, message: 'Le montant doit être supérieur à 0' };
        }

        const transaction: Transaction = {
          id: (this.transactions.length + 1).toString(),
          type: 'deposit',
          amount,
          fee: 0,
          totalAmount: amount,
          toUserId: currentUser.id,
          status: 'completed',
          description: 'Dépôt d\'argent',
          createdAt: new Date(),
          processedAt: new Date()
        };

        this.transactions.push(transaction);
        this.transactionsSubject.next([...this.transactions]);
        
        this.authService.updateUserBalance(currentUser.id, currentUser.balance + amount);

        return { success: true, transaction };
      })
    );
  }

  withdraw(amount: number): Observable<{ success: boolean; message?: string; transaction?: Transaction }> {
    return of(null).pipe(
      delay(2000),
      map(() => {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          return { success: false, message: 'Utilisateur non connecté' };
        }

        if (amount <= 0) {
          return { success: false, message: 'Le montant doit être supérieur à 0' };
        }

        const fee = amount * 0.01; // 1% de frais
        const totalAmount = amount + fee;

        if (currentUser.balance < totalAmount) {
          return { success: false, message: 'Solde insuffisant (frais de 1% inclus)' };
        }

        const transaction: Transaction = {
          id: (this.transactions.length + 1).toString(),
          type: 'withdrawal',
          amount,
          fee,
          totalAmount,
          fromUserId: currentUser.id,
          status: 'completed',
          description: 'Retrait d\'argent',
          createdAt: new Date(),
          processedAt: new Date()
        };

        this.transactions.push(transaction);
        this.transactionsSubject.next([...this.transactions]);
        
        this.authService.updateUserBalance(currentUser.id, currentUser.balance - totalAmount);

        return { success: true, transaction };
      })
    );
  }

  transfer(transferData: TransferRequest): Observable<{ success: boolean; message?: string; transaction?: Transaction }> {
    return of(null).pipe(
      delay(2000),
      map(() => {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          return { success: false, message: 'Utilisateur non connecté' };
        }

        const recipient = this.authService.findUserByPhone(transferData.toUserPhone);
        if (!recipient) {
          return { success: false, message: 'Destinataire introuvable' };
        }

        if (recipient.id === currentUser.id) {
          return { success: false, message: 'Vous ne pouvez pas vous transférer de l\'argent à vous-même' };
        }

        if (transferData.amount <= 0) {
          return { success: false, message: 'Le montant doit être supérieur à 0' };
        }

        const fee = transferData.amount * 0.005; // 0.5% de frais
        const totalAmount = transferData.amount + fee;

        if (currentUser.balance < totalAmount) {
          return { success: false, message: 'Solde insuffisant (frais de 0.5% inclus)' };
        }

        // Transaction pour l'expéditeur
        const sendTransaction: Transaction = {
          id: (this.transactions.length + 1).toString(),
          type: 'transfer_sent',
          amount: transferData.amount,
          fee,
          totalAmount,
          fromUserId: currentUser.id,
          toUserId: recipient.id,
          toUser: {
            firstName: recipient.firstName,
            lastName: recipient.lastName,
            phone: recipient.phone
          },
          status: 'completed',
          description: transferData.description || 'Transfert d\'argent',
          createdAt: new Date(),
          processedAt: new Date()
        };

        // Transaction pour le destinataire
        const receiveTransaction: Transaction = {
          id: (this.transactions.length + 2).toString(),
          type: 'transfer_received',
          amount: transferData.amount,
          fee: 0,
          totalAmount: transferData.amount,
          fromUserId: currentUser.id,
          toUserId: recipient.id,
          fromUser: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            phone: currentUser.phone
          },
          status: 'completed',
          description: transferData.description || 'Transfert d\'argent',
          createdAt: new Date(),
          processedAt: new Date()
        };

        this.transactions.push(sendTransaction, receiveTransaction);
        this.transactionsSubject.next([...this.transactions]);
        
        // Mise à jour des soldes
        this.authService.updateUserBalance(currentUser.id, currentUser.balance - totalAmount);
        this.authService.updateUserBalance(recipient.id, recipient.balance + transferData.amount);

        return { success: true, transaction: sendTransaction };
      })
    );
  }

  getUserTransactions(userId: string): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(transactions => transactions
        .filter(t => t.fromUserId === userId || t.toUserId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      )
    );
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(transactions => [...transactions].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    );
  }
}