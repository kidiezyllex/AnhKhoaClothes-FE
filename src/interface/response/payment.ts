import { IBankTransferInfo } from "../request/payment";
import { IOrder } from "./order";

export interface IPaymentOrder {
  id: string;
  code: string;
  customer: {
    id: string;
    fullName: string;
    code?: string;
    email?: string;
  };
  total: number;
  paymentStatus?: 'PENDING' | 'PARTIAL_PAID' | 'PAID';
  orderStatus?: 'CHO_XAC_NHAN' | 'CHO_GIAO_HANG' | 'DANG_VAN_CHUYEN' | 'DA_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY';
}

export interface IPayment {
  id: string;
  code: string;
  order: string | IPaymentOrder;
  amount: number;
  method: 'CASH' | 'BANK_TRANSFER';
  bankTransferInfo?: IBankTransferInfo;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentResponse {
  success: boolean;
  message: string;
  data: IPayment;
}

export interface IPaymentsResponse {
  success: boolean;
  message: string;
  data: {
    payments: IPayment[];
    pagination?: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface IActionResponse {
  success: boolean;
  message: string;
  data?: any;
} 