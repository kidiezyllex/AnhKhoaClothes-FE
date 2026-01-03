'use client';

import { cn } from '@/lib/utils';
import { ReturnReason, ReturnStatus } from './mockData';

interface ReturnStatusBadgeProps {
  status: ReturnStatus;
  className?: string;
}

interface StatusDetails {
  label: string;
  bgColor: string;
  textColor: string;
}

export const ReturnStatusBadge: React.FC<ReturnStatusBadgeProps> = ({ status, className }) => {
  const getStatusDetails = (status: ReturnStatus): StatusDetails => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ xử lý',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
        };
      case 'approved':
        return {
          label: 'Đã chấp nhận',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
        };
      case 'rejected':
        return {
          label: 'Từ chối',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
        };
      case 'completed':
        return {
          label: 'Đã hoàn thành',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
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

interface RefundStatusBadgeProps {
  status: 'pending' | 'completed' | 'failed';
  className?: string;
}

export const RefundStatusBadge: React.FC<RefundStatusBadgeProps> = ({
  status,
  className,
}) => {
  const getStatusDetails = (status: 'pending' | 'completed' | 'failed'): StatusDetails => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ hoàn tiền',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
        };
      case 'completed':
        return {
          label: 'Đã hoàn tiền',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
        };
      case 'failed':
        return {
          label: 'Hoàn tiền thất bại',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
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

interface ReturnReasonBadgeProps {
  reason: ReturnReason;
  className?: string;
}

export const ReturnReasonBadge: React.FC<ReturnReasonBadgeProps> = ({
  reason,
  className,
}) => {
  const getReasonDetails = (reason: ReturnReason): StatusDetails => {
    switch (reason) {
      case 'wrong_size':
        return {
          label: 'Sai kích cỡ',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
        };
      case 'wrong_item':
        return {
          label: 'Sản phẩm không đúng',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
        };
      case 'damaged':
        return {
          label: 'Sản phẩm bị hỏng',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
        };
      case 'defective':
        return {
          label: 'Sản phẩm bị lỗi',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
        };
      case 'changed_mind':
        return {
          label: 'Đổi ý',
          bgColor: 'bg-gray-100',
          textColor: 'text-maintext',
        };
      case 'other':
        return {
          label: 'Lý do khác',
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

  const reasonDetails = getReasonDetails(reason);

  return (
    <span
      className={cn(
        'px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap',
        reasonDetails.bgColor,
        reasonDetails.textColor,
        className
      )}
    >
      {reasonDetails.label}
    </span>
  );
}; 