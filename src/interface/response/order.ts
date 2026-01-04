// import { IShippingAddress, IOrderItem } from "../request/order"; // Remove this line
import { IVoucher } from "./voucher";

export interface IOrderProduct {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  price?: number;
}

export interface IOrderCustomer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  addresses?: any[];
}

export interface IOrderStaff {
  id: string;
  fullName: string;
}

// Define IOrderItem locally for IPopulatedOrderItem
export interface IOrderItem {
  id?: string;
  product_id: number;
  name: string;
  qty: number;
  size_selected: string;
  color_selected: string;
  images: string[];
  price_sale: number;
}

export interface IShippingAddress {
  address: string;
  city: string;
  postal_code: string;
  country: string;
  recipient_phone_number: string;
}

export interface IOrder {
  id: string;
  user_id: string;
  payment_method: string;
  payment_result?: any;
  tax_price: number;
  shipping_price: number;
  total_price: number;
  is_paid: boolean;
  paid_at: string | null;
  is_delivered: boolean;
  delivered_at: string | null;
  is_cancelled: boolean;
  is_processing: boolean;
  is_outfit_purchase: boolean;
  status: 'CHO_XAC_NHAN' | 'CHO_GIAO_HANG' | 'DANG_VAN_CHUYEN' | 'DA_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY';
  created_at: string;
  updated_at: string;
  items: IOrderItem[];
  shipping_address: IShippingAddress;
  // Compatibility fields
  code?: string;
  createdAt?: string;
  total?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
}

export interface IOrdersResponse {
  status: string;
  message: string;
  data: {
    orders: IOrder[];
    page: number;
    pages: number;
    perPage: number;
    count: number;
    // Compatibility pagination
    pagination?: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface IOrderResponse {
  status: string;
  message: string;
  data: IOrder;
}

export interface IActionResponse {
  status: string;
  message: string;
  data?: any;
} 