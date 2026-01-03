export interface IReturnFilter {
  status?: 'CHO_XU_LY' | 'DA_HOAN_TIEN' | 'DA_HUY';
  customer?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface IReturnItem {
  product: string;
  variant: {
    colorId: string;
    sizeId: string;
  };
  quantity: number;
  price: number;
  reason?: string;
}

export interface IReturnCreate {
  originalOrder: string;
  customer: string;
  items: IReturnItem[];
  totalRefund: number;
}

export interface IReturnUpdate {
  items?: IReturnItem[];
  totalRefund?: number;
}

export interface IReturnStatusUpdate {
  status: 'CHO_XU_LY' | 'DA_HOAN_TIEN' | 'DA_HUY';
}

export interface IReturnSearchParams {
  query: string;
}

export interface IReturnStatsParams {
  startDate?: string;
  endDate?: string;
}

// === Customer Return Interfaces ===

export interface IReturnableOrdersParams {
  page?: number;
  limit?: number;
}

export interface ICustomerReturnRequest {
  originalOrder: string;
  items: {
    product: string;
    variant: {
      colorId: string;
      sizeId: string;
    };
    quantity: number;
  }[];
  reason: string;
}

export interface IMyReturnsParams {
  page?: number;
  limit?: number;
} 