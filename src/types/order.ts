export interface IOrder {
  id: string;
  customer: string;
  code?: string;
  orderReference?: string;
  items: Array<{
    product: string;
    quantity: number;
    price: number;
    variant?: {
      colorId?: string;
      sizeId?: string;
    };
  }>;
  subTotal: number;
  total: number;
  shippingAddress: {
    name: string;
    phoneNumber: string;
    provinceId: string;
    districtId: string;
    wardId: string;
    specificAddress: string;
  };
  paymentMethod: 'COD' | 'BANK_TRANSFER' | 'CASH' | 'MIXED';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message?: string;
  data?: IOrder & {
    vnpayUrl?: string; // URL thanh toán VNPay nếu có
  };
} 