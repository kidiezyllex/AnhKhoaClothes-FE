'use client';

import { useState } from 'react';
 
import { useValidateVoucher } from '@/hooks/voucher';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from '@mdi/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { mdiTicket, mdiClose, mdiLoading, mdiCheck } from '@mdi/js';
interface VoucherFormProps {
  orderValue: number;
  onApplyVoucher: (voucherData: { code: string; discount: number; voucherId: string }) => void;
  onRemoveVoucher: () => void;
  appliedVoucher?: { code: string; discount: number; voucherId: string } | null;
}

const VoucherForm = ({ orderValue, onApplyVoucher, onRemoveVoucher, appliedVoucher }: VoucherFormProps) => {
  const [voucherCode, setVoucherCode] = useState('');
  const validateVoucher = useValidateVoucher();

  const handleApplyVoucher = async () => {
    try {
      const result = await validateVoucher.mutateAsync({
        code: voucherCode,
        orderValue
      });

      if (result.success && result.data.voucher) {
        const voucher = result.data.voucher;
        onApplyVoucher({
          code: voucher.code,
          discount: result.data.discountValue,
          voucherId: voucher.id
        });
        toast.success(`Áp dụng mã giảm giá ${voucher.code} thành công`);
        setVoucherCode('');
      } else {
        toast.error(result.message || 'Mã giảm giá không hợp lệ');
      }
    } catch (error) {
      toast.error('Không thể kiểm tra mã giảm giá. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Mã giảm giá</h3>
      <AnimatePresence mode="wait">
        {appliedVoucher ? (
          <motion.div
            key="applied-voucher"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center justify-between p-2 border border-green-200 bg-green-50 rounded-[6px]"
          >
            <div className="flex items-center gap-2">
              <Icon path={mdiTicket} size={0.7} className="text-primary" />
              <div>
                <div className="font-medium text-sm">{appliedVoucher.code}</div>
                <div className="text-xs text-maintext">Giảm {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appliedVoucher.discount)}</div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onRemoveVoucher}
              className="h-8 w-8 p-0 rounded-full text-maintext hover:bg-red-50 hover:text-red-600"
            >
              <Icon path={mdiClose} size={0.7} />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="voucher-form"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
                className="pr-10"
              />
              <Icon
                path={mdiTicket}
                size={0.7}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-maintext"
              />
            </div>
            <Button
              onClick={handleApplyVoucher}
              disabled={validateVoucher.isPending}
              className="whitespace-nowrap flex items-center gap-1"
            >
              {validateVoucher.isPending ? (
                <Icon path={mdiLoading} size={0.7} className="animate-spin" />
              ) : (
                <Icon path={mdiCheck} size={0.7} />
              )}
              Áp dụng
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoucherForm; 