import React from 'react';
import { RadioGroup } from '@headlessui/react';
import { FaCreditCard, FaMoneyBillWave, FaTruck } from 'react-icons/fa';
import { createVNPayUrl, createCODPayment } from '../../services/payment';
import { useToast } from '../../hooks/useToast';

interface PaymentMethodsProps {
  orderId: string;
  amount: number;
  onPaymentComplete: () => void;
}

const paymentMethods = [
  {
    id: 'vnpay',
    title: 'Thanh toán qua VNPay',
    description: 'Thanh toán an toàn với thẻ ATM, Visa, MasterCard',
    icon: FaCreditCard
  },
  {
    id: 'cod',
    title: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: FaTruck
  }
];

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  orderId,
  amount,
  onPaymentComplete
}) => {
  const [selectedMethod, setSelectedMethod] = React.useState(paymentMethods[0]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { showToast } = useToast();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      if (selectedMethod.id === 'vnpay') {
        const orderInfo = `Thanh toan don hang #${orderId}`;
        const response = await createVNPayUrl(orderId, amount, orderInfo);
        if (response.success && response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          throw new Error('Không thể tạo URL thanh toán');
        }
      } else if (selectedMethod.id === 'cod') {
        const response = await createCODPayment(orderId, amount);
        if (response.success) {
          showToast({
            title: 'Thành công',
            message: 'Đã tạo đơn hàng COD',
            type: 'success'
          });
          onPaymentComplete();
        } else {
          throw new Error('Không thể tạo thanh toán COD');
        }
      }
    } catch (error) {
      showToast({
        title: 'Lỗi',
        message: 'Đã có lỗi xảy ra',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <RadioGroup value={selectedMethod} onChange={setSelectedMethod}>
        <RadioGroup.Label className="text-lg font-medium text-maintext">
          Chọn phương thức thanh toán
        </RadioGroup.Label>

        <div className="mt-4 space-y-4">
          {paymentMethods.map((method) => (
            <RadioGroup.Option
              key={method.id}
              value={method}
              className={({ checked }) =>
                `${
                  checked ? 'bg-indigo-50 border-indigo-500' : 'border-gray-200'
                } relative border rounded-[6px] p-4 flex cursor-pointer focus:outline-none`
              }
            >
              {({ checked }) => (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className="font-medium text-maintext"
                        >
                          {method.title}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className="text-maintext"
                        >
                          {method.description}
                        </RadioGroup.Description>
                      </div>
                    </div>
                    <div
                      className={`${
                        checked ? 'text-indigo-500' : 'text-maintext'
                      } flex-shrink-0`}
                    >
                      <method.icon className="w-6 h-6" />
                    </div>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-[6px] hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
      </button>
    </div>
  );
}; 