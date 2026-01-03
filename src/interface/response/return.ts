import { IReturnItem } from "../request/return";

export interface IReturnProduct {
  id: string;
  name: string;
  code: string;
  images?: string[];
  price?: number;
}

export interface IReturnCustomer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface IReturnStaff {
  id: string;
  fullName: string;
}

export interface IReturnOrder {
  id: string;
  code: string;
  createdAt?: string;
}

export interface IPopulatedReturnItem extends Omit<IReturnItem, 'product'> {
  product: IReturnProduct;
}

export interface IReturn {
  id: string;
  code: string;
  originalOrder: string | IReturnOrder;
  customer: string | IReturnCustomer;
  staff: string | IReturnStaff;
  items: IPopulatedReturnItem[] | IReturnItem[];
  totalRefund: number;
  status: 'CHO_XU_LY' | 'DA_HOAN_TIEN' | 'DA_HUY';
  createdAt: string;
  updatedAt: string;
}

export interface IReturnResponse {
  success: boolean;
  message: string;
  data: IReturn;
}

export interface IReturnsResponse {
  success: boolean;
  message: string;
  data: {
    returns: IReturn[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface IReturnStats {
  totalReturns: number;
  pendingReturns: number;
  refundedReturns: number;
  cancelledReturns: number;
  totalRefundAmount: number;
}

export interface IReturnStatsResponse {
  success: boolean;
  message: string;
  data: IReturnStats;
}

export interface IReturnSearchResponse {
  success: boolean;
  message: string;
  data: IReturn[];
}

export interface IActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

// === Customer Return Response Interfaces ===

export interface IReturnableOrderItem {
  product: {
    id: string;
    name: string;
    images: string[];
    code: string;
  };
  variant: any;
  quantity: number;
  price: number;
}

export interface IReturnableOrder {
  id: string;
  code: string;
  orderStatus: 'HOAN_THANH';
  items: IReturnableOrderItem[];
  total: number;
  createdAt: string;
}

export interface IReturnableOrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: IReturnableOrder[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
} 