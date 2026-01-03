import type { IOrder, CreateOrderResponse } from '@/types/order';

export interface CreateOrderData {
  customer: string;
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
  metadata?: {
    clientTimestamp?: number;
    uniqueSuffix?: number;
    attemptNumber?: number;
    [key: string]: any;
  };
  timestamp?: number;
  orderReference?: string;
}

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    // Get token from cookies as that's where it's being stored by the auth system
    const token = localStorage.getItem('accessToken');
    return token;
  }
  return null;
};

export const createOrder = async (data: CreateOrderData): Promise<CreateOrderResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục',
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Đã có lỗi xảy ra khi tạo đơn hàng',
    };
  }
};

export const getOrder = async (id: string): Promise<{ success: boolean; data?: IOrder; message?: string }> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục',
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Đã có lỗi xảy ra khi tải thông tin đơn hàng',
    };
  }
};

export const getOrders = async (customerId?: string): Promise<{ success: boolean; data?: IOrder[]; message?: string }> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục',
      };
    }

    const url = customerId 
      ? `${process.env.NEXT_PUBLIC_API_URL}/orders?customer=${customerId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/orders`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Đã có lỗi xảy ra khi tải danh sách đơn hàng',
    };
  }
};

export const updateOrderPayment = async (
  orderId: string, 
  paymentData: any
): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục',
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Đã có lỗi xảy ra khi cập nhật trạng thái thanh toán',
    };
  }
}; 