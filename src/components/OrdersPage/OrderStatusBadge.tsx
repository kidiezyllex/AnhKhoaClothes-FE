'use client';

import { cn } from '@/lib/utils';
import { OrderStatus, PaymentStatus } from './mockData';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

interface StatusDetails {
  label: string;
  bgColor: string;
  textColor: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className }) => {
  const getStatusDetails = (status: OrderStatus): StatusDetails => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ xác nhận',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
        };
      case 'processing':
        return {
          label: 'Đang xử lý',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
        };
      case 'shipping':
        return {
          label: 'Đang giao hàng',
          bgColor: 'bg-indigo-100',
          textColor: 'text-indigo-800',
        };
      case 'delivered':
        return {
          label: 'Đã giao hàng',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
        };
      case 'returned':
        return {
          label: 'Đã trả hàng',
          bgColor: 'bg-gray-100',
          textColor: 'text-maintext',
        };
      default:
        return {
          label: 'Không xác định',
          bgColor: 'bg-gray-100',
          textColor: 'text-maintext',
        };
    }
  };

  const statusDetails = getStatusDetails(status);

  return (
    <span
      className={cn(
        'px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap',
        statusDetails.bgColor,
        statusDetails.textColor,
        className
      )}
    >
      {statusDetails.label}
    </span>
  );
};

interface OrderPaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export const OrderPaymentStatusBadge: React.FC<OrderPaymentStatusBadgeProps> = ({
  status,
  className,
}) => {
  const getStatusDetails = (status: PaymentStatus): StatusDetails => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ thanh toán',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
        };
      case 'paid':
        return {
          label: 'Đã thanh toán',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
        };
      case 'failed':
        return {
          label: 'Thanh toán thất bại',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
        };
      case 'refunded':
        return {
          label: 'Đã hoàn tiền',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
        };
      default:
        return {
          label: 'Không xác định',
          bgColor: 'bg-gray-100',
          textColor: 'text-maintext',
        };
    }
  };

  const statusDetails = getStatusDetails(status);

  return (
    <span
      className={cn(
        'px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap',
        statusDetails.bgColor,
        statusDetails.textColor,
        className
      )}
    >
      {statusDetails.label}
    </span>
  );
}; 