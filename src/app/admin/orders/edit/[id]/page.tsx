'use client';

import { useState, useEffect } from 'react';
 
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@mdi/react';
import { mdiArrowLeft, mdiContentSave } from '@mdi/js';
import { useOrderDetail, useUpdateOrder, useUpdateOrderStatus } from '@/hooks/order';
import { IOrderUpdate, IOrderStatusUpdate } from '@/interface/request/order';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function EditOrderPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: orderData, isLoading, isError } = useOrderDetail(id as string);
  const updateOrder = useUpdateOrder();
  const updateOrderStatus = useUpdateOrderStatus();
  const [formData, setFormData] = useState<IOrderUpdate>({});
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (orderData?.data) {
      const order = orderData.data;
      setOrderStatus(order.orderStatus);
      setPaymentStatus(order.paymentStatus);
      
      if (order.shippingAddress) {
        setFormData({
          shippingAddress: {
            name: order.shippingAddress.name,
            phoneNumber: order.shippingAddress.phoneNumber,
            provinceId: order.shippingAddress.provinceId,
            districtId: order.shippingAddress.districtId,
            wardId: order.shippingAddress.wardId,
            specificAddress: order.shippingAddress.specificAddress,
          }
        });
      }
    }
  }, [orderData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      // Update order information
      if (Object.keys(formData).length > 0) {
        await updateOrder.mutateAsync({
          orderId: id as string,
          payload: formData
        });
      }
      
      // Update order status if changed
      if (orderStatus && orderStatus !== orderData?.data.orderStatus) {
        await updateOrderStatus.mutateAsync({
          orderId: id as string,
          payload: { status: orderStatus as any }
        });
      }
      
      toast.success('Cập nhật đơn hàng thành công');
      navigate('/admin/orders');
    } catch (error) {
      toast.error('Cập nhật đơn hàng thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-white">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (isError || !orderData) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  const order = orderData.data;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/orders">Quản lý đơn hàng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chỉnh sửa đơn hàng #{order.orderNumber}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <Icon path={mdiArrowLeft} size={0.7} className="mr-2" />
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên người nhận</Label>
                    <Input
                      id="name"
                      value={formData.shippingAddress?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Tên người nhận hàng"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.shippingAddress?.phoneNumber || ''}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Số điện thoại người nhận"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Tỉnh/Thành phố</Label>
                    <Select 
                      value={formData.shippingAddress?.provinceId || ''} 
                      onValueChange={(value) => handleInputChange('provinceId', value)}
                    >
                      <SelectTrigger id="province">
                        <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Render province options dynamically */}
                        <SelectItem value={order.shippingAddress?.provinceId || ''}>
                          {order.shippingAddress?.provinceName || 'Không có dữ liệu'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện</Label>
                    <Select 
                      value={formData.shippingAddress?.districtId || ''} 
                      onValueChange={(value) => handleInputChange('districtId', value)}
                    >
                      <SelectTrigger id="district">
                        <SelectValue placeholder="Chọn Quận/Huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Render district options dynamically */}
                        <SelectItem value={order.shippingAddress?.districtId || ''}>
                          {order.shippingAddress?.districtName || 'Không có dữ liệu'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ward">Phường/Xã</Label>
                    <Select 
                      value={formData.shippingAddress?.wardId || ''} 
                      onValueChange={(value) => handleInputChange('wardId', value)}
                    >
                      <SelectTrigger id="ward">
                        <SelectValue placeholder="Chọn Phường/Xã" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Render ward options dynamically */}
                        <SelectItem value={order.shippingAddress?.wardId || ''}>
                          {order.shippingAddress?.wardName || 'Không có dữ liệu'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specificAddress">Địa chỉ cụ thể</Label>
                  <Input
                    id="specificAddress"
                    value={formData.shippingAddress?.specificAddress || ''}
                    onChange={(e) => handleInputChange('specificAddress', e.target.value)}
                    placeholder="Số nhà, tên đường, khu vực..."
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Các sản phẩm trong đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-[6px]">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-maintext uppercase tracking-wider">
                          Sản phẩm
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-maintext uppercase tracking-wider">
                          Đơn giá
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-maintext uppercase tracking-wider">
                          Số lượng
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-maintext uppercase tracking-wider">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              {item.product.imageUrl && (
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img 
                                    className="h-10 w-10 rounded-[6px] object-cover" 
                                    src={item.product.imageUrl} 
                                    alt={item.product.name} 
                                  />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <div className="text-sm font-medium text-maintext">
                                  {item.product.name}
                                </div>
                                {item.variant && (
                                  <div className="text-sm text-maintext">
                                    {item.variant.colorName && item.variant.sizeName && 
                                      `${item.variant.colorName} / ${item.variant.sizeName}`
                                    }
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-maintext">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-maintext">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Tổng tiền sản phẩm:</span>
                    <span className="font-medium">{formatCurrency(order.subTotal)}</span>
                  </div>
                  {order.voucher && (
                    <div className="flex justify-between">
                      <span className="text-sm">Giảm giá ({order.voucher.code}):</span>
                      <span className="font-medium text-red-500">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Tổng thanh toán:</span>
                    <span className="text-lg font-bold">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Mã đơn hàng</Label>
                  <Input id="orderNumber" value={order.orderNumber} disabled />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="createdAt">Ngày tạo</Label>
                  <Input id="createdAt" value={formatDate(order.createdAt)} disabled />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="orderStatus">Trạng thái đơn hàng</Label>
                  <Select value={orderStatus} onValueChange={setOrderStatus}>
                    <SelectTrigger id="orderStatus">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CHO_XAC_NHAN">Chờ xác nhận</SelectItem>
                      <SelectItem value="CHO_GIAO_HANG">Chờ giao hàng</SelectItem>
                      <SelectItem value="DANG_VAN_CHUYEN">Đang vận chuyển</SelectItem>
                      <SelectItem value="DA_GIAO_HANG">Đã giao hàng</SelectItem>
                      <SelectItem value="HOAN_THANH">Hoàn thành</SelectItem>
                      <SelectItem value="DA_HUY">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Trạng thái thanh toán</Label>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger id="paymentStatus">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Chưa thanh toán</SelectItem>
                      <SelectItem value="PARTIAL_PAID">Thanh toán một phần</SelectItem>
                      <SelectItem value="PAID">Đã thanh toán</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
                  <Input 
                    id="paymentMethod" 
                    value={
                      order.paymentMethod === 'CASH' ? 'Tiền mặt' :
                      order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản ngân hàng' :
                      order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' :
                      order.paymentMethod === 'MIXED' ? 'Thanh toán nhiều phương thức' :
                      'Không xác định'
                    } 
                    disabled 
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="customer">Khách hàng</Label>
                  <Input 
                    id="customer" 
                    value={`${order.customer.fullName} (${order.customer.phoneNumber})`} 
                    disabled 
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Đang cập nhật...</span>
                  ) : (
                    <>
                      <Icon path={mdiContentSave} size={0.7} className="mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
} 