'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface OrderItem {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  subTotal: number;
  total: number;
  shippingAddress: {
    name: string;
    phoneNumber: string;
    provinceId: string;
    districtId: string;
    wardId: string;
    specificAddress: string;
  };
  paymentMethod: 'COD' | 'VNPAY';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!user?.id) {
          navigate('/login');
          return;
        }

        const response = await fetch(`/api/orders/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setOrder(data.data);
        } else {
          throw new Error(data.message || 'Không thể tải thông tin đơn hàng');
        }
      } catch (error: any) {
        showToast({
          title: "Lỗi",
          message: error.message || "Đã có lỗi xảy ra khi tải đơn hàng",
          type: "error"
        });
        navigate('/orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
      }, [params.id, user, navigate, showToast]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}/cancel`, {
        method: 'PUT'
      });
      const data = await response.json();

      if (data.success) {
        showToast({
          title: "Thành công",
          message: "Đã hủy đơn hàng thành công",
          type: "success"
        });
        setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
      } else {
        throw new Error(data.message || 'Không thể hủy đơn hàng');
      }
    } catch (error: any) {
      showToast({
        title: "Lỗi",
        message: error.message || "Đã có lỗi xảy ra khi hủy đơn hàng",
        type: "error"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8 flex items-center justify-center">
        <div>Đang tải...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container max-w-6xl py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Không tìm thấy đơn hàng
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id.slice(-6)}</h1>
        <div className="flex items-center gap-4">
          <Badge className={`${getStatusColor(order.status)} text-white`}>
            {getStatusText(order.status)}
          </Badge>
          {order.status === 'pending' && (
            <Button variant="destructive" onClick={handleCancelOrder}>
              Hủy đơn hàng
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin giao hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Người nhận</h3>
                <p className="text-muted-foreground mt-1">
                  {order.shippingAddress.name}<br />
                  {order.shippingAddress.phoneNumber}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Địa chỉ</h3>
                <p className="text-muted-foreground mt-1">
                  {order.shippingAddress.specificAddress}<br />
                  {order.shippingAddress.wardId}, {order.shippingAddress.districtId}<br />
                  {order.shippingAddress.provinceId}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chi tiết thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Phương thức thanh toán</h3>
                <p className="text-muted-foreground mt-1">
                  {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'VNPay'}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Thời gian đặt hàng</h3>
                <p className="text-muted-foreground mt-1">
                  {format(new Date(order.createdAt), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                </p>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>${order.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Tổng cộng</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 py-4 border-b last:border-0">
                <div className="w-20 h-20 bg-muted rounded relative overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <div className="flex justify-between mt-2 text-muted-foreground">
                    <span>Số lượng: {item.quantity}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 