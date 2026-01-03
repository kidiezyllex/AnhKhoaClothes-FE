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
  id: string;
  product: string; // This will be replaced by IOrderProduct in IPopulatedOrderItem
  variant?: { // Assuming variant is optional here and might have colorId/sizeId
    colorId?: string;
    sizeId?: string;
  };
  quantity: number;
  price: number;
  // Add other necessary fields if IOrderItem is used elsewhere or has more props
}

export interface IProductVariant {
  id: number;
  productId: number;
  colorId: number;
  sizeId: number;
  price: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: number;
    code: string;
    name: string;
    description: string;
    weight: string;
    status: string;
    brand: {
      id: number;
      name: string;
    };
    category: {
      id: number;
      name: string;
    };
    material: {
      id: number;
      name: string;
    };
  };
  color: {
    id: number;
    name: string;
    code: string;
  };
  size: {
    id: number;
    value: string;
  };
  images: Array<{
    id: number;
    imageUrl: string;
  }>;
}

export interface IPopulatedOrderItem extends Omit<IOrderItem, 'product'> {
  product?: IOrderProduct;
  productVariant?: IProductVariant;
}

// Define IShippingAddress locally for IOrder
export interface IShippingAddress {
  name: string;
  phoneNumber: string;
  provinceId: string; // Or full Province object if populated
  districtId: string; // Or full District object
  wardId: string;     // Or full Ward object
  specificAddress: string;
  // country?: string;
  // zipCode?: string;
}

export interface IOrder {
  id: string;
  orderNumber?: string;
  code: string;
  customerId?: number;
  staffId?: number;
  voucherId?: number | null;
  customer: IOrderCustomer;
  staff?: IOrderStaff;
  items: IPopulatedOrderItem[];
  voucher?: any;
  subTotal: number;
  discount: number;
  total: number;
  shippingAddress?: IShippingAddress;
  shippingName: string;
  shippingPhoneNumber: string;
  shippingProvinceId: string;
  shippingDistrictId: string;
  shippingWardId: string;
  shippingSpecificAddress: string;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'COD' | 'MIXED';
  paymentStatus: 'PENDING' | 'PARTIAL_PAID' | 'PAID';
  orderStatus: 'CHO_XAC_NHAN' | 'CHO_GIAO_HANG' | 'DANG_VAN_CHUYEN' | 'DA_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY';
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderResponse {
  success: boolean;
  data: {
    id: string;
    orderNumber: string;
    customer: any;
    items: any[];
    voucher: any;
    subTotal: number;
    discount: number;
    total: number;
    shippingAddress: any;
    paymentMethod: string;
    orderStatus: 'CHO_XAC_NHAN' | 'CHO_GIAO_HANG' | 'DANG_VAN_CHUYEN' | 'DA_GIAO_HANG' | 'HOAN_THANH' | 'DA_HUY';
    paymentStatus: 'PENDING' | 'PARTIAL_PAID' | 'PAID';
    createdAt: string;
    updatedAt: string;
  };
}

export interface IOrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: IOrder[];
    pagination: {
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

export interface IPOSOrderCreateResponse {
  success: boolean;
  message: string;
  data: IOrder;
} 