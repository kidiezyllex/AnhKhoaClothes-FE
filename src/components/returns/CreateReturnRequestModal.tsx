'use client';

import { useState, useEffect } from 'react';
 
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateReturnRequest } from '@/hooks/return';
import { IReturnableOrder } from '@/interface/response/return';
import { ICustomerReturnRequest } from '@/interface/request/return';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { Icon } from '@mdi/react';
import { mdiMinus, mdiPlus } from '@mdi/js';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface CreateReturnRequestModalProps {
  order: IReturnableOrder | null;
}

interface SelectedItem {
  product: string;
  variant: {
    colorId: string;
    sizeId: string;
  };
  quantity: number;
  maxQuantity: number;
  price: number;
  productName: string;
  productImage: string;
  variantInfo: string;
}

export default function CreateReturnRequestModal({ order }: CreateReturnRequestModalProps) {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createReturnRequest = useCreateReturnRequest();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (order) {
      setSelectedItems([]);
      setReason('');
    }
  }, [order]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleItemSelect = (item: any, checked: boolean) => {
    if (checked) {
      const newItem: SelectedItem = {
        product: item.product.id,
        variant: item.variant,
        quantity: 1,
        maxQuantity: item.quantity,
        price: item.price,
        productName: item.product.name,
        productImage: item.product.images[0] || '/placeholder.jpg',
        variantInfo: `${item.variant.color?.name || ''} - ${item.variant.size?.name || ''}`
      };
      setSelectedItems(prev => [...prev, newItem]);
    } else {
      setSelectedItems(prev => prev.filter(selected => 
        !(selected.product === item.product.id && 
          selected.variant.colorId === item.variant.colorId && 
          selected.variant.sizeId === item.variant.sizeId)
      ));
    }
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    setSelectedItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.maxQuantity)) } : item
    ));
  };

  const isItemSelected = (item: any) => {
    return selectedItems.some(selected => 
      selected.product === item.product?.id && 
      selected.variant.colorId === item.variant.colorId && 
      selected.variant.sizeId === item.variant.sizeId
    );
  };

  const getTotalRefund = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async () => {
    if (!order || selectedItems.length === 0 || !reason.trim()) {
      toast.error('Vui lòng chọn sản phẩm và nhập lý do trả hàng');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ICustomerReturnRequest = {
        originalOrder: order.id,
        items: selectedItems.map(item => ({
          product: item.product,
          variant: item.variant,
          quantity: item.quantity
        })),
        reason: reason.trim()
      };

      await createReturnRequest.mutateAsync(payload);
      toast.success('Yêu cầu trả hàng đã được gửi thành công');
      queryClient.invalidateQueries({ queryKey: ['myReturns'] });
      queryClient.invalidateQueries({ queryKey: ['returnableOrders'] });
      
      // Reset form
      setSelectedItems([]);
      setReason('');
    } catch (error) {
      toast.error('Gửi yêu cầu trả hàng thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return null;

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Tạo yêu cầu trả hàng</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Order Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-maintext">Mã đơn hàng:</span>
                <span className="ml-2 font-medium">#{order.code}</span>
              </div>
              <div>
                <span className="text-maintext">Tổng tiền:</span>
                <span className="ml-2 font-medium">{formatCurrency(order.total)}</span>
              </div>
              <div>
                <span className="text-maintext">Ngày đặt:</span>
                <span className="ml-2 font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <div>
                <span className="text-maintext">Trạng thái:</span>
                <span className="ml-2 font-medium text-green-600">Đã hoàn thành</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Selection */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Chọn sản phẩm cần trả</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={isItemSelected(item)}
                      onCheckedChange={(checked) => handleItemSelect(item, checked as boolean)}
                    />
                    <img
                      src={item.product.images[0] || '/placeholder.jpg'}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-maintext">
                        {item.variant.color?.name} - {item.variant.size?.name}
                      </p>
                      <p className="text-sm text-maintext">
                        Đã mua: {item.quantity} | Giá: {formatCurrency(item.price)}
                      </p>
                    </div>
                    {isItemSelected(item) && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Số lượng trả:</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const selectedIndex = selectedItems.findIndex(selected => 
                                selected.product === item.product?.id && 
                                selected.variant.colorId === item.variant.colorId && 
                                selected.variant.sizeId === item.variant.sizeId
                              );
                              if (selectedIndex !== -1) {
                                handleQuantityChange(selectedIndex, selectedItems[selectedIndex].quantity - 1);
                              }
                            }}
                          >
                            <Icon path={mdiMinus} size={0.7} />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={item.quantity}
                            value={selectedItems.find(selected => 
                              selected.product === item.product?.id && 
                              selected.variant.colorId === item.variant.colorId && 
                              selected.variant.sizeId === item.variant.sizeId
                            )?.quantity || 1}
                            onChange={(e) => {
                              const selectedIndex = selectedItems.findIndex(selected => 
                                selected.product === item.product?.id && 
                                selected.variant.colorId === item.variant.colorId && 
                                selected.variant.sizeId === item.variant.sizeId
                              );
                              if (selectedIndex !== -1) {
                                handleQuantityChange(selectedIndex, parseInt(e.target.value) || 1);
                              }
                            }}
                            className="w-16 text-center"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const selectedIndex = selectedItems.findIndex(selected => 
                                selected.product === item.product?.id && 
                                selected.variant.colorId === item.variant.colorId && 
                                selected.variant.sizeId === item.variant.sizeId
                              );
                              if (selectedIndex !== -1) {
                                handleQuantityChange(selectedIndex, selectedItems[selectedIndex].quantity + 1);
                              }
                            }}
                          >
                            <Icon path={mdiPlus} size={0.7} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reason */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Lý do trả hàng *</h3>
            <Textarea
              placeholder="Vui lòng mô tả lý do bạn muốn trả hàng..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Summary */}
        {selectedItems.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Tóm tắt yêu cầu trả hàng</h3>
              <div className="space-y-2">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.productName} ({item.variantInfo}) x{item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Tổng tiền hoàn trả:</span>
                  <span className="text-primary">{formatCurrency(getTotalRefund())}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" disabled={isSubmitting}>
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || selectedItems.length === 0 || !reason.trim()}
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
} 