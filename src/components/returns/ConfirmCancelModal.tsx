'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@mdi/react';
import { mdiAlertCircle } from '@mdi/js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface ConfirmCancelModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmCancelModal({ onConfirm, onCancel, isLoading = false }: ConfirmCancelModalProps) {
  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Icon path={mdiAlertCircle} size={1} className="text-red-500" />
          Xác nhận hủy yêu cầu
        </DialogTitle>
      </DialogHeader>

      <div className="py-4">
        <p className="text-maintext">
          Bạn có chắc chắn muốn hủy yêu cầu trả hàng này không? 
          Hành động này không thể hoàn tác.
        </p>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Không, giữ lại
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Đang hủy...' : 'Có, hủy yêu cầu'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
} 