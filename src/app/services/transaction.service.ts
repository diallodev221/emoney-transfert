import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Transaction, TransferRequest } from '../models/transaction.interface';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private urltransaction: string = 'http://localhost:9090/api/transactions';

  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor(private authService: AuthService, private http: HttpClient) {}

  transfer(transferData: TransferRequest) {
    return this.http
      .post(`${this.urltransaction}/${transferData.compteSourceId}`, {
        destinataireId: transferData.compteDestinataireId,
        montant: transferData.amount,
      })
      .pipe(tap((res) => console.log('response: ', res)));
    // return of(null).pipe(
    //   delay(2000),
    //   map(() => {
    //     const currentUser = this.authService.getCurrentUser();
    //     if (!currentUser) {
    //       return { success: false, message: 'Utilisateur non connecté' };
    //     }
    // const recipient = this.authService.findUserByPhone(transferData.toUserPhone);
    // if (!recipient) {
    //   return { success: false, message: 'Destinataire introuvable' };
    // }
    // if (recipient.id === currentUser.id) {
    //   return { success: false, message: 'Vous ne pouvez pas vous transférer de l\'argent à vous-même' };
    // }
    // if (transferData.amount <= 0) {
    //   return { success: false, message: 'Le montant doit être supérieur à 0' };
    // }
    // const fee = transferData.amount * 0.005; // 0.5% de frais
    // const totalAmount = transferData.amount + fee;
    // if (currentUser.balance < totalAmount) {
    //   return { success: false, message: 'Solde insuffisant (frais de 0.5% inclus)' };
    // }
    // Transaction pour l'expéditeur
    // const sendTransaction: Transaction = {
    //   id: (this.transactions.length + 1).toString(),
    //   type: 'transfer_sent',
    //   amount: transferData.amount,
    //   fee,
    //   totalAmount,
    //   fromUserId: currentUser.id,
    //   toUserId: recipient.id,
    //   toUser: {
    //     firstName: recipient.firstName,
    //     lastName: recipient.lastName,
    //     phone: recipient.phone
    //   },
    //   status: 'completed',
    //   description: transferData.description || 'Transfert d\'argent',
    //   createdAt: new Date(),
    //   processedAt: new Date()
    // };
    // Transaction pour le destinataire
    // const receiveTransaction: Transaction = {
    //   id: (this.transactions.length + 2).toString(),
    //   type: 'transfer_received',
    //   amount: transferData.amount,
    //   fee: 0,
    //   totalAmount: transferData.amount,
    //   fromUserId: currentUser.id,
    //   toUserId: recipient.id,
    //   fromUser: {
    //     firstName: currentUser.firstName,
    //     lastName: currentUser.lastName,
    //     phone: currentUser.phone
    //   },
    //   status: 'completed',
    //   description: transferData.description || 'Transfert d\'argent',
    //   createdAt: new Date(),
    //   processedAt: new Date()
    // };
    // this.transactions.push(sendTransaction, receiveTransaction);
    // this.transactionsSubject.next([...this.transactions]);
    // // Mise à jour des soldes
    // this.authService.updateUserBalance(currentUser.id, currentUser.balance - totalAmount);
    // this.authService.updateUserBalance(recipient.id, recipient.balance + transferData.amount);
    //     return { success: true, transaction: null };
    //   })
    // );
  }

  getUserTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.urltransaction}/current-user`);
  }

  get10RecentTransactionsOfCurrentUser(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.urltransaction}/10-recent`);
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.urltransaction}`);
  }

  getFilteredTransactions(type: string, status: string): Observable<Transaction[]> {
    console.log(type, status)
    return this.http.get<Transaction[]>(`${this.urltransaction}/filter?type=${type}&status=${status}`);
  }
}
