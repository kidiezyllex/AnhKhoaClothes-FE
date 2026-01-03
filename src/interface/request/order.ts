export interface IOrderFilter {
  customer?: string;
  orderStatus?: 'CHO_XAC_NHAN' | 'CHO_GIAO_HANG' | 'DANG_VAN_CHUYEN' | 'DA_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY';
  paymentStatus?: 'PENDING' | 'PARTIAL_PAID' | 'PAID';
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IOrderItem {
  product: string;
  variant?: {
    colorId?: string;
    sizeId?: string;
  };
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  name?: string;
  phoneNumber?: string;
  provinceId?: string;
  districtId?: string;
  wardId?: string;
  specificAddress?: string;
}

export interface IOrderCreate {
  customer: string;
  items: {
    product: string;
    variant: {
      colorId: string;
      sizeId: string;
    };
    quantity: number;
    price: number;
  }[];
  voucher?: string;
  subTotal: number;
  discount: number;
  total: number;
  shippingAddress: {
    name: string;
    phoneNumber: string;
    provinceId: string;
    districtId: string;
    wardId: string;
    specificAddress: string;
  };
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'COD' | 'MIXED';
  orderId: string;
}

export interface IOrderUpdate {
  shippingAddress?: IShippingAddress;
  orderStatus?: 'CHO_XAC_NHAN' | 'CHO_GIAO_HANG' | 'DANG_VAN_CHUYEN' | 'DA_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY';
  paymentStatus?: 'PENDING' | 'PARTIAL_PAID' | 'PAID';
}

export interface IOrderStatusUpdate {
  status: 'CHO_XAC_NHAN' | 'CHO_GIAO_HANG' | 'DANG_VAN_CHUYEN' | 'DA_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY';
}

export interface IOrderUpdateStatusPayload {
  status: IOrderStatusUpdate['status'];
}

export interface IPOSOrderItem {
  product: string;      // Product ID
  quantity: number;
  price: number;
  variant: {
    colorId: string;  // Variant Color ID
    sizeId: string;   // Variant Size ID
  };
}

export interface IPOSShippingAddress {
  name: string;
  phoneNumber: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  specificAddress: string;
}

export interface IPOSOrderCreateRequest {
  orderId?: string; 
  customer: string; 
  items: IPOSOrderItem[];
  subTotal: number;
  total: number;
  shippingAddress: IPOSShippingAddress;
  paymentMethod: string; 
  discount: number;
  voucher?: string; 
  orderStatus: string;
} 