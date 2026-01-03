export interface IPaymentFilter {
  orderId?: string;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  method?: 'CASH' | 'BANK_TRANSFER';
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface IBankTransferInfo {
  bankName?: string;
  accountNumber?: string;
  transactionCode?: string;
  transferDate?: string | Date;
}

export interface IPaymentCreate {
  order: string;
  amount: number;
  method: 'CASH' | 'BANK_TRANSFER';
  bankTransferInfo?: IBankTransferInfo;
  note?: string;
}

export interface IPaymentStatusUpdate {
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  note?: string;
} 