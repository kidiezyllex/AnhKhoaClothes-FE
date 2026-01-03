import React, { useState } from 'react';
 
import { useNavigate } from 'react-router-dom';
import { PaymentMethods } from '../Checkout/PaymentMethods';
import { useToast } from '../../hooks/useToast';
import { createOrder } from '../../services/order';
import { useCartStore } from '../../stores/cart';

interface CartCheckoutProps {
  onClose?: () => void;
}

interface ShippingAddress {
  name: string;
  phoneNumber: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  specificAddress: string;
}

export const CartCheckout: React.FC<CartCheckoutProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const { items, total, clearCart } = useCartStore();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    phoneNumber: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    specificAddress: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async () => {
    try {
      if (items.length === 0) {
        showToast({
          title: 'Lỗi',
          message: 'Giỏ hàng trống',
          type: 'error'
        });
        return;
      }

      setIsProcessing(true);
      const orderData = {
        items: items.map(item => ({
          product: item.product.id,
          variant: {
            colorId: item.variant?.colorId,
            sizeId: item.variant?.sizeId
          },
          quantity: item.quantity,
          price: item.product.price
        })),
        subTotal: total,
        total: total,
        shippingAddress,
        paymentMethod: 'PENDING'
      };
      const response = await createOrder(orderData as any);
      
      if (response.success) {
        setOrderId(response.data.id);
        setShowPaymentMethods(true);
      } else {
        throw new Error('Không thể tạo đơn hàng');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      showToast({
        title: 'Lỗi',
        message: 'Đã có lỗi xảy ra khi tạo đơn hàng',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentComplete = () => {
    showToast({
      title: 'Thành công',
      message: 'Đặt hàng thành công',
      type: 'success'
    });
    clearCart();
    navigate(`/orders/${orderId}`);
    onClose?.();
  };

  if (showPaymentMethods && orderId) {
    return (
      <PaymentMethods
        orderId={orderId}
        amount={total}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  return (
    <div className="mt-6">
      <div className="border-t border-gray-200 py-4 px-4 sm:px-4">
        <h3 className="text-lg font-medium text-maintext mb-4">Thông tin giao hàng</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-maintext">
              Họ tên người nhận
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              value={shippingAddress.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-[6px] shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-maintext">
              Số điện thoại
            </label>
            <Input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={shippingAddress.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-[6px] shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="specificAddress" className="block text-sm font-medium text-maintext">
              Địa chỉ cụ thể
            </label>
            <Input
              type="text"
              name="specificAddress"
              id="specificAddress"
              value={shippingAddress.specificAddress}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-[6px] shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Add province, district, ward selectors here */}
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-base font-medium text-maintext">
            <p>Tổng tiền</p>
            <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</p>
          </div>
          <p className="mt-0.5 text-sm text-maintext">Đã bao gồm phí vận chuyển và thuế</p>
          <div className="mt-6">
            <button
              onClick={handleCheckout}
              disabled={isProcessing || items.length === 0}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-[6px] shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
            </button>
          </div>
          <div className="mt-6 flex justify-center text-sm text-center text-maintext">
            <p>
              hoặc{' '}
              <button
                type="button"
                className="text-indigo-600 font-medium hover:text-indigo-500"
                onClick={onClose}
              >
                Tiếp tục mua sắm<span aria-hidden="true"> &rarr;</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 