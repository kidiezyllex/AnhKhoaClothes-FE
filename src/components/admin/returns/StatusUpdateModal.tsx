'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icon } from '@mdi/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { mdiAlertCircle, mdiCheckCircle, mdiCancel, mdiCurrencyUsd } from '@mdi/js';
interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (returnId: string, status: 'CHO_XU_LY' | 'DA_HOAN_TIEN' | 'DA_HUY') => Promise<void>;
  returnId: string;
  currentStatus: string;
  isLoading?: boolean;
}

export default function StatusUpdateModal({
  isOpen,
  onClose,
  onConfirm,
  returnId,
  currentStatus,
  isLoading = false
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'DA_HOAN_TIEN':
        return {
          label: 'Phê duyệt hoàn tiền',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: mdiCheckCircle,
          description: 'Yêu cầu trả hàng sẽ được phê duyệt và tiền sẽ được hoàn trả cho khách hàng.'
        };
      case 'DA_HUY':
        return {
          label: 'Từ chối yêu cầu',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: mdiCancel,
          description: 'Yêu cầu trả hàng sẽ bị từ chối và không có tiền hoàn trả.'
        };
      default:
        return null;
    }
  };

  const handleConfirm = async () => {
    if (!selectedStatus || (selectedStatus !== 'DA_HOAN_TIEN' && selectedStatus !== 'DA_HUY')) return;
    await onConfirm(returnId, selectedStatus as 'DA_HOAN_TIEN' | 'DA_HUY');
    setSelectedStatus('');
  };

  const handleClose = () => {
    setSelectedStatus('');
    onClose();
  };

  const statusInfo = selectedStatus ? getStatusInfo(selectedStatus) : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon path={mdiAlertCircle} size={1} className="text-orange-500" />
            Cập nhật trạng thái yêu cầu trả hàng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-maintext mb-2">Trạng thái hiện tại:</p>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
              Chờ xử lý
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Chọn trạng thái mới:</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DA_HOAN_TIEN">
                  <div className="flex items-center gap-2">
                    <Icon path={mdiCheckCircle} size={0.7} className="text-green-600" />
                    Phê duyệt hoàn tiền
                  </div>
                </SelectItem>
                <SelectItem value="DA_HUY">
                  <div className="flex items-center gap-2">
                    <Icon path={mdiCancel} size={0.7} className="text-red-600" />
                    Từ chối yêu cầu
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {statusInfo && (
            <Alert className={`${statusInfo.bgColor} ${statusInfo.borderColor}`}>
              <Icon path={statusInfo.icon} size={0.7} className={statusInfo.color} />
              <AlertDescription className={statusInfo.color}>
                <strong>{statusInfo.label}</strong>
                <br />
                {statusInfo.description}
                {selectedStatus === 'DA_HOAN_TIEN' && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-blue-700">
                    <Icon path={mdiCurrencyUsd} size={0.7} className="inline mr-1" />
                    <strong>Lưu ý:</strong> Khi phê duyệt hoàn tiền, hệ thống sẽ tự động cộng lại số lượng sản phẩm vào kho.
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedStatus || isLoading}
            variant={selectedStatus === 'DA_HOAN_TIEN' ? 'default' : 'destructive'}
          >
            {isLoading ? 'Đang cập nhật...' : 'Xác nhận cập nhật'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 