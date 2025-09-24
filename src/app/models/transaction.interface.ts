import { Compte } from './compte.interface';

export interface Transaction {
  id: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_SENT' | 'TRANSFER_RECEIVED';
  montant: number;
  frais: number;
  totalAmount: number;
  source?: Compte;
  destinataire?: Compte;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  date: Date;
}

export interface TransferRequest {
  compteSourceId: number;
  amount: number;
  description?: string;
  compteDestinataireId: number;
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER_SENT = 'TRANSFER_SENT',
  TRANSFER_RECEIVED = 'TRANSFER_RECEIVED',
}

export enum TransactionStatus {
  TERMINE = 'TERMINE',
  EN_COURS = 'EN_COURS',
  ECHOUE = 'ECHOUE',
}
