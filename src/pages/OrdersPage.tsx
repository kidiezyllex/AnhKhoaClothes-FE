"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

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
  paymentMethod: "COD" | "VNPAY";
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.id) {
          navigate("/login");
          return;
        }

        const response = await fetch(`/api/orders?customer=${user.id}`);
        const data = await response.json();

        if (data.success) {
          setOrders(data.data);
        } else {
          throw new Error(data.message || "Không thể tải danh sách đơn hàng");
        }
      } catch (error: any) {
        showToast({
          title: "Lỗi",
          message: error.message || "Đã có lỗi xảy ra khi tải đơn hàng",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate, showToast]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8 flex items-center justify-center">
        <div>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Bạn chưa có đơn hàng nào
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Đơn hàng #{order.id.slice(-6)}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${getStatusColor(order.status)} text-white`}
                  >
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Thông tin giao hàng</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.name}
                        <br />
                        {order.shippingAddress.phoneNumber}
                        <br />
                        {order.shippingAddress.specificAddress}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Chi tiết thanh toán</h3>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Phương thức:</span>
                          <span>
                            {order.paymentMethod === "COD"
                              ? "Thanh toán khi nhận hàng"
                              : "VNPay"}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium mt-2">
                          <span>Tổng tiền:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Sản phẩm</h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded relative overflow-hidden">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                              <span>x{item.quantity}</span>
                              <span>${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
