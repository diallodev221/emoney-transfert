export interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'transfer_sent' | 'transfer_received';
  amount: number;
  fee: number;
  totalAmount: number;
  fromUserId?: string;
  toUserId?: number;
  fromUser?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  toUser?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  createdAt: Date;
  processedAt?: Date;
}

export interface TransferRequest {
  toUserPhone: string;
  amount: number;
  description?: string;
}