'use client';

import { useState, useEffect } from 'react';
 
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useReturnDetail, useUpdateReturn } from '@/hooks/return';
import { IReturnUpdate } from '@/interface/request/return';
import { toast } from 'react-toastify';
import { Icon } from '@mdi/react';
import { mdiArrowLeft, mdiPlus, mdiMinus, mdiContentSave, mdiCancel } from '@mdi/js';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface EditReturnPageProps {
  params: {
    id: string;
  };
}

interface EditableItem {
  product: string;
  variant: {
    colorId: string;
    sizeId: string;
  };
  quantity: number;
  price: number;
  reason?: string;
  maxQuantity: number;
  productName: string;
  productCode: string;
  productImage: string;
  variantInfo: string;
}

export default function EditReturnPage({ params }: EditReturnPageProps) {
  const { id } = params;
  const [editableItems, setEditableItems] = useState<EditableItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: returnData, isLoading, isError } = useReturnDetail(id);
  const updateReturn = useUpdateReturn();
  const navigate = useNavigate();

  useEffect(() => {
    if (returnData?.data) {
      const items = returnData.data.items.map((item: any) => ({
        product: typeof item.product === 'string' ? item.product : item.product.id,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        reason: item.reason || '',
        maxQuantity: item.quantity + 5, // Mock max quantity
        productName: typeof item.product === 'string' ? 'Sản phẩm' : item.product.name,
        productCode: typeof item.product === 'string' ? item.product : item.product.code,
        productImage: typeof item.product === 'string' ? '/placeholder.jpg' : (item.product.images?.[0] || '/placeholder.jpg'),
        variantInfo: `${item.variant?.color?.name || 'N/A'} - ${item.variant?.size?.name || 'N/A'}`
      }));
      setEditableItems(items);
    }
  }, [returnData]);

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
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Chờ xử lý</Badge>;
      case 'DA_HOAN_TIEN':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Đã hoàn tiền</Badge>;
      case 'DA_HUY':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    setEditableItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.maxQuantity)) } : item
    ));
  };

  const handleReasonChange = (index: number, reason: string) => {
    setEditableItems(prev => prev.map((item, i) => 
      i === index ? { ...item, reason } : item
    ));
  };

  const getTotalRefund = () => {
    return editableItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async () => {
    if (editableItems.length === 0) {
      toast.error('Phải có ít nhất một sản phẩm trong yêu cầu trả hàng');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: IReturnUpdate = {
        items: editableItems.map(item => ({
          product: item.product,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
          reason: item.reason
        })),
        totalRefund: getTotalRefund()
      };

      await updateReturn.mutateAsync({ returnId: id, payload });
      toast.success('Cập nhật yêu cầu trả hàng thành công');
      navigate('/admin/returns');
    } catch (error) {
      toast.error('Cập nhật yêu cầu trả hàng thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (isError || !returnData?.data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Không thể tải thông tin yêu cầu trả hàng</p>
        <a href="/admin/returns" className="mt-4">
          <Button className="mt-4">Quay lại danh sách</Button>
        </a>
      </div>
    );
  }

  const returnInfo = returnData.data;
  const customer = typeof returnInfo.customer === 'string' 
    ? { fullName: 'Không có thông tin', email: '', phoneNumber: '' }
    : returnInfo.customer;
  const order = typeof returnInfo.originalOrder === 'string'
    ? { code: returnInfo.originalOrder }
    : returnInfo.originalOrder;

  // Only allow editing if status is CHO_XU_LY
  const canEdit = returnInfo.status === 'CHO_XU_LY';

  return (
    <div className="space-y-4">
      <div className='flex justify-between items-start'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/returns">Quản lý trả hàng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chỉnh sửa yêu cầu trả hàng</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <a href="/admin/returns" className="mr-2">
          <Button variant="outline">
            <Icon path={mdiArrowLeft} size={0.7} className="mr-2" />
            Quay lại
          </Button>
        </a>
      </div>

      {!canEdit && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <Icon path={mdiCancel} size={0.8} />
              <p className="font-medium">
                Không thể chỉnh sửa yêu cầu trả hàng này vì trạng thái không phải "Chờ xử lý"
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Return Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Thông tin yêu cầu trả hàng</span>
            {getStatusBadge(returnInfo.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Thông tin yêu cầu</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-maintext">Mã yêu cầu:</span>
                  <span className="ml-2 font-medium">#{returnInfo.code}</span>
                </div>
                <div>
                  <span className="text-maintext">Ngày tạo:</span>
                  <span className="ml-2 font-medium">{formatDate(returnInfo.createdAt)}</span>
                </div>
                <div>
                  <span className="text-maintext">Đơn hàng gốc:</span>
                  <span className="ml-2 font-medium">#{order.code}</span>
                </div>
                <div>
                  <span className="text-maintext">Tổng tiền hiện tại:</span>
                  <span className="ml-2 font-medium text-primary">{formatCurrency(returnInfo.totalRefund)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Thông tin khách hàng</h3>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <span className="text-maintext">Tên khách hàng:</span>
                  <span className="ml-2 font-medium">{customer.fullName}</span>
                </div>
                <div>
                  <span className="text-maintext">Email:</span>
                  <span className="ml-2 font-medium">{customer.email || 'Không có'}</span>
                </div>
                <div>
                  <span className="text-maintext">Số điện thoại:</span>
                  <span className="ml-2 font-medium">{customer.phoneNumber || 'Không có'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Items */}
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm trả hàng</CardTitle>
          {canEdit && (
            <p className="text-sm text-maintext">
              Bạn có thể chỉnh sửa số lượng và lý do trả hàng cho từng sản phẩm
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editableItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.productName}</h4>
                    <p className="text-sm text-maintext">SKU: {item.productCode}</p>
                    <p className="text-sm text-maintext">{item.variantInfo}</p>
                    <p className="text-sm text-maintext">Giá: {formatCurrency(item.price)}</p>
                  </div>
                  
                  {canEdit && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Số lượng:</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Icon path={mdiMinus} size={0.7} />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          max={item.maxQuantity}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                          className="w-20 text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(index, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <Icon path={mdiPlus} size={0.7} />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!canEdit && (
                    <div className="text-right">
                      <p className="text-sm text-maintext">Số lượng</p>
                      <p className="font-medium">{item.quantity}</p>
                    </div>
                  )}
                </div>
                
                {canEdit && (
                  <div className="mt-4">
                    <label className="text-sm font-medium mb-1 block">Lý do trả hàng</label>
                    <Textarea
                      placeholder="Nhập lý do trả hàng..."
                      value={item.reason || ''}
                      onChange={(e) => handleReasonChange(index, e.target.value)}
                      rows={2}
                    />
                  </div>
                )}
                
                {!canEdit && item.reason && (
                  <div className="mt-4">
                    <label className="text-sm font-medium mb-1 block">Lý do trả hàng</label>
                    <p className="text-sm text-maintext p-2 bg-gray-50 rounded">{item.reason}</p>
                  </div>
                )}
                
                <div className="mt-2 pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-maintext">Thành tiền:</span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tóm tắt</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editableItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-maintext">{item.variantInfo}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Tổng tiền hoàn trả mới:</span>
              <span className="text-primary">{formatCurrency(getTotalRefund())}</span>
            </div>
            {getTotalRefund() !== returnInfo.totalRefund && (
              <div className="flex justify-between items-center text-sm text-maintext mt-1">
                <span>Tổng tiền cũ:</span>
                <span>{formatCurrency(returnInfo.totalRefund)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {canEdit && (
        <div className="flex justify-end gap-4">
          <a href="/admin/returns">
            <Button variant="outline" disabled={isSubmitting}>
              Hủy
            </Button>
          </a>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || editableItems.length === 0}
          >
            <Icon path={mdiContentSave} size={0.7} className="mr-2" />
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      )}
    </div>
  );
} 