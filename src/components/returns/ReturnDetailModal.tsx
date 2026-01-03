'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useMyReturnDetail, useCancelMyReturn } from '@/hooks/return';
import { IReturn } from '@/interface/response/return';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Icon } from '@mdi/react';
import ConfirmCancelModal from './ConfirmCancelModal';
import { mdiCheckCircle, mdiClockOutline, mdiCancel } from '@mdi/js';
interface ReturnDetailModalProps {
  returnItem: IReturn | null;
}

export default function ReturnDetailModal({ returnItem }: ReturnDetailModalProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { data: detailData, isLoading } = useMyReturnDetail((returnItem as any)?.id || '');
  const cancelReturn = useCancelMyReturn();
  const queryClient = useQueryClient();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CHO_XU_LY':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
            <Icon path={mdiClockOutline} size={0.7} className="mr-1" />
            Chờ xử lý
          </Badge>
        );
      case 'DA_HOAN_TIEN':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <Icon path={mdiCheckCircle} size={0.7} className="mr-1" />
            Đã hoàn tiền
          </Badge>
        );
      case 'DA_HUY':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <Icon path={mdiCancel} size={0.7} className="mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getStatusTimeline = (status: string, createdAt: string, updatedAt: string) => {
    const steps = [
      { key: 'CHO_XU_LY', label: 'Chờ xử lý', date: createdAt },
      { key: 'DA_HOAN_TIEN', label: 'Đã hoàn tiền', date: status === 'DA_HOAN_TIEN' ? updatedAt : null },
      { key: 'DA_HUY', label: 'Đã hủy', date: status === 'DA_HUY' ? updatedAt : null }
    ];

    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = step.key === status;
          const isCompleted = step.date !== null;
          
          return (
            <div key={step.key} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-maintext'
              }`}>
                {isCompleted ? (
                  <Icon path={mdiCheckCircle} size={0.7} />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-maintext'}`}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-sm text-maintext">{formatDate(step.date)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleCancelReturn = async () => {
    if (!returnItem) return;
    
    try {
      await cancelReturn.mutateAsync((returnItem as any)?.id);
      toast.success('Đã hủy yêu cầu trả hàng thành công');
      queryClient.invalidateQueries({ queryKey: ['myReturns'] });
      queryClient.invalidateQueries({ queryKey: ['myReturn', (returnItem as any)?.id] });
      setShowCancelConfirm(false);
    } catch (error) {
      toast.error('Hủy yêu cầu trả hàng thất bại');
    }
  };

  if (!returnItem) return null;

  const returnData = detailData?.data || returnItem;

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Chi tiết yêu cầu trả hàng #{returnData.code}</span>
          {getStatusBadge(returnData.status)}
        </DialogTitle>
      </DialogHeader>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Return Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin yêu cầu trả hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-maintext">Mã yêu cầu:</span>
                  <span className="ml-2 font-medium">#{returnData.code}</span>
                </div>
                <div>
                  <span className="text-maintext">Đơn hàng gốc:</span>
                  <span className="ml-2 font-medium">
                    #{typeof returnData.originalOrder === 'string' 
                      ? returnData.originalOrder 
                      : returnData.originalOrder.code}
                  </span>
                </div>
                <div>
                  <span className="text-maintext">Ngày tạo:</span>
                  <span className="ml-2 font-medium">{formatDate(returnData.createdAt)}</span>
                </div>
                <div>
                  <span className="text-maintext">Tổng tiền hoàn trả:</span>
                  <span className="ml-2 font-medium text-primary">{formatCurrency(returnData.totalRefund)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái xử lý</CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusTimeline(returnData.status, returnData.createdAt, returnData.updatedAt)}
            </CardContent>
          </Card>

          {/* Return Items */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm trả hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Phân loại</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Đơn giá</TableHead>
                    <TableHead>Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returnData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <img
                            src={'/placeholder.jpg'}
                            alt="Product"
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium">
                              {typeof item === 'object' && 'product' in item && typeof item.product === 'object' 
                                ? item.product.name 
                                : 'Sản phẩm'}
                            </p>
                            <p className="text-sm text-maintext">
                              {typeof item === 'object' && 'product' in item && typeof item.product === 'object' 
                                ? item.product.code 
                                : ''}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>Màu: {item.variant?.colorId || 'N/A'}</p>
                          <p>Size: {item.variant?.sizeId || 'N/A'}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>


        </div>
      )}

      <DialogFooter>
        <div className="flex gap-2">
          {returnData.status === 'CHO_XU_LY' && (
            <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Icon path={mdiCancel} size={0.7} className="mr-1" />
                  Hủy yêu cầu
                </Button>
              </DialogTrigger>
              <ConfirmCancelModal
                onConfirm={handleCancelReturn}
                onCancel={() => setShowCancelConfirm(false)}
                isLoading={cancelReturn.isPending}
              />
            </Dialog>
          )}
          <Button variant="outline">
            Đóng
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
} 