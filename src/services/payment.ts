import { axiosInstance } from './axios';
import { IPaymentResponse } from '../interface/response/payment';

export const createVNPayUrl = async (orderId: string, amount: number, orderInfo: string, orderCode?: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return {
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục',
      };
    }
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/payments/create-vnpay-url`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          orderId,
          amount,
          orderInfo,
          orderCode
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 500) {
          return {
            success: false,
            message: 'Lỗi kết nối đến máy chủ thanh toán. Vui lòng thử lại sau.'
          };
        }
        
        return {
          success: false,
          message: `Lỗi API (${response.status}): ${errorText}`
        };
      }

      const result = await response.json();
      if (result.data && result.data.paymentUrl) {
        return {
          success: true,
          data: { paymentUrl: result.data.paymentUrl }
        };
      }
      return result;
    } catch (fetchError) {
      return {
        success: false,
        message: 'Lỗi kết nối đến máy chủ thanh toán. Vui lòng thử lại sau.'
      };
    }
  } catch (error) {
    console.error('Error creating VNPay URL:', error);
    return {
      success: false,
      message: `Đã xảy ra lỗi khi tạo đường dẫn thanh toán: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

export const createCODPayment = async (orderId: string, amount: number) => {
  const response = await axiosInstance.post<IPaymentResponse>('/payments/cod', {
    orderId,
    amount
  });
  return response.data;
};

export const getPaymentsByOrderId = async (orderId: string) => {
  const response = await axiosInstance.get<IPaymentResponse>(`/orders/${orderId}/payments`);
  return response.data;
}; 