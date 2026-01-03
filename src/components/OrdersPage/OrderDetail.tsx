"use client";

import { useState } from "react";
import { Order, OrderStatusHistory } from "./mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge, OrderPaymentStatusBadge } from "./OrderStatusBadge";
import { Icon } from "@mdi/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose }) => {
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");

  //                                                                                                                     Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  //                                                                                                                     Định dạng ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  //                                                                                                                     Lấy tên phương thức thanh toán
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "cash":
        return "Tiền mặt";
      case "banking":
        return "Chuyển khoản ngân hàng";
      case "card":
        return "Thẻ tín dụng/ghi nợ";
      case "momo":
        return "Ví MoMo";
      case "zalopay":
        return "ZaloPay";
      default:
        return "Không xác định";
    }
  };

  //                                                                                                                     Lấy tên loại đơn hàng
  const getOrderTypeName = (type: string) => {
    switch (type) {
      case "store":
        return "Mua tại cửa hàng";
      case "online":
        return "Đặt hàng online";
      default:
        return "Không xác định";
    }
  };

  //                                                                                                                     Render lịch sử trạng thái
  const renderStatusHistory = (history: OrderStatusHistory[]) => {
    return (
      <div className="space-y-4 my-4">
        {history.map((item, index) => (
          <div key={index} className="flex items-start">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {index === 0 ? (
                  <Icon path={mdiTruckDeliveryOutline} size={0.7} />
                ) : index === history.length - 1 ? (
                  <Icon path={mdiCheckCircleOutline} size={0.7} />
                ) : (
                  <Icon path={mdiCreditCardOutline} size={0.7} />
                )}
              </div>
              {index < history.length - 1 && (
                <div className="absolute top-9 bottom-0 left-1/2 w-px h-full -translate-x-1/2 bg-gray-200" />
              )}
            </div>
            <div className="ml-4 min-h-[6rem]">
              <div className="flex items-center text-sm">
                <OrderStatusBadge status={item.status} />
                <span className="ml-2 text-maintext">
                  {formatDate(item.timestamp)}
                </span>
                <span className="ml-2 text-maintext text-xs">
                  (
                  {formatDistanceToNow(new Date(item.timestamp), {
                    addSuffix: true,
                    locale: vi,
                  })}
                  )
                </span>
              </div>
              {item.note && (
                <p className="mt-1 text-sm text-maintext max-w-xl">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-[6px] shadow-sm w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold">
              Chi tiết đơn hàng #{order.code}
            </h2>
            <p className="text-maintext text-sm">
              Ngày tạo: {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-maintext hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
              title="In hóa đơn"
            >
              <Icon path={mdiPrinter} size={1} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-maintext hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
              title="Đóng"
            >
              <Icon path={mdiClose} size={1} />
            </button>
          </div>
        </div>

        <div className="p-4 border-b bg-white">
          <div className="flex space-x-4">
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === "details"
                  ? "border-primary text-primary"
                  : "border-transparent text-maintext hover:text-maintext hover:border-gray-300"
              )}
              onClick={() => setActiveTab("details")}
            >
              Chi tiết đơn hàng
            </button>
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-maintext hover:text-maintext hover:border-gray-300"
              )}
              onClick={() => setActiveTab("history")}
            >
              Lịch sử trạng thái
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeTab === "details" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Thông tin đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-maintext">Mã đơn hàng:</span>
                      <span className="font-medium">{order.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maintext">Trạng thái:</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maintext">Loại đơn hàng:</span>
                      <span>{getOrderTypeName(order.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maintext">Ngày đặt hàng:</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maintext">Cập nhật lần cuối:</span>
                      <span>{formatDate(order.updatedAt)}</span>
                    </div>
                    {order.note && (
                      <div className="pt-2 border-t">
                        <span className="text-maintext block mb-1">
                          Ghi chú:
                        </span>
                        <p className="text-maintext">{order.note}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Thông tin khách hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-maintext">Tên khách hàng:</span>
                      <span className="font-medium">
                        {order.customer.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maintext">Số điện thoại:</span>
                      <span>{order.customer.phone}</span>
                    </div>
                    {order.customer.email && (
                      <div className="flex justify-between">
                        <span className="text-maintext">Email:</span>
                        <span>{order.customer.email}</span>
                      </div>
                    )}
                    {order.type === "online" && order.deliveryAddress && (
                      <div className="pt-2 border-t">
                        <span className="text-maintext block mb-1">
                          Địa chỉ giao hàng:
                        </span>
                        <p className="text-maintext">
                          {order.deliveryAddress.fullName},{" "}
                          {order.deliveryAddress.phone}
                        </p>
                        <p className="text-maintext">
                          {order.deliveryAddress.address}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-3 font-medium">Sản phẩm</th>
                          <th className="pb-3 font-medium">Đơn giá</th>
                          <th className="pb-3 font-medium">Số lượng</th>
                          <th className="pb-3 font-medium text-right">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-4">
                              <div className="flex items-center">
                                <div className="relative h-12 w-12 rounded overflow-hidden mr-3 flex-shrink-0">
                                  <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {item.productName}
                                  </p>
                                  <p className="text-maintext text-xs">
                                    Size: {item.size}, Màu: {item.color}
                                  </p>
                                  <p className="text-maintext text-xs">
                                    SKU: {item.sku}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="py-4">{item.quantity}</td>
                            <td className="py-4 text-right">
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            colSpan={3}
                            className="pt-4 text-right font-medium"
                          >
                            Tạm tính:
                          </td>
                          <td className="pt-4 text-right">
                            {formatCurrency(order.totalAmount)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={3}
                            className="pt-2 text-right font-medium"
                          >
                            Giảm giá:
                          </td>
                          <td className="pt-2 text-right text-red-600">
                            -{formatCurrency(order.discountAmount)}
                          </td>
                        </tr>
                        {order.shippingFee > 0 && (
                          <tr>
                            <td
                              colSpan={3}
                              className="pt-2 text-right font-medium"
                            >
                              Phí vận chuyển:
                            </td>
                            <td className="pt-2 text-right">
                              {formatCurrency(order.shippingFee)}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td
                            colSpan={3}
                            className="pt-4 text-right font-medium text-lg"
                          >
                            Tổng cộng:
                          </td>
                          <td className="pt-4 text-right font-bold text-lg text-primary">
                            {formatCurrency(order.finalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Thông tin thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-maintext">
                      Phương thức thanh toán:
                    </span>
                    <span>{getPaymentMethodName(order.paymentMethod)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-maintext">
                      Trạng thái thanh toán:
                    </span>
                    <OrderPaymentStatusBadge status={order.paymentStatus} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-maintext">Số tiền:</span>
                    <span className="font-medium text-primary">
                      {formatCurrency(order.finalAmount)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Lịch sử trạng thái đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderStatusHistory(order.statusHistory.slice().reverse())}
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  );
};
