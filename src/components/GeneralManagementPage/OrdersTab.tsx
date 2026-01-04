"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/useUserContext";
import { useOrderDetail, useOrdersByUser } from "@/hooks/order";
import { useCreateReturnRequest, useReturnableOrders } from "@/hooks/return";
import { ICustomerReturnRequest } from "@/interface/request/return";
import { IOrder, IOrderItem } from "@/interface/response/order";
import { formatPrice } from "@/utils/formatters";
import {
  mdiCancel,
  mdiCashMultiple,
  mdiCheckCircle,
  mdiClockTimeFour,
  mdiCreditCardOutline,
  mdiDelete,
  mdiEye,
  mdiKeyboardReturn,
  mdiMapMarker,
  mdiMinus,
  mdiOrderBoolAscending,
  mdiPackageVariant,
  mdiPlus,
  mdiTruck,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import React, { useState } from "react";
import { toast } from "react-toastify";

// --- Components ---

export const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { label: string }> = {
    CHO_XAC_NHAN: { label: "Chờ xác nhận" },
    CHO_GIAO_HANG: { label: "Chờ giao hàng" },
    DANG_VAN_CHUYEN: { label: "Đang vận chuyển" },
    DA_GIAO_HANG: { label: "Đã giao hàng" },
    HOAN_THANH: { label: "Hoàn thành" },
    DA_HUY: { label: "Đã hủy" },
  };

  const config = statusConfig[status] || { label: status };

  return <Badge variant={status as any}>{config.label}</Badge>;
};

export const OrderDetailDialog: React.FC<{
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ orderId, open, onOpenChange }) => {
  const { data: orderData, isLoading, isError } = useOrderDetail(orderId || "");

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng";
      case "VNPAY":
        return "Thanh toán qua VNPay";
      case "MOMO":
        return "Thanh toán MOMO";
      case "STRIPE":
        return "Thanh toán thẻ quốc tế (Stripe)";
      case "BANK_TRANSFER":
        return "Chuyển khoản ngân hàng";
      default:
        return method;
    }
  };

  const getShippingProgress = (orderStatus: string, createdAt: string) => {
    const orderDate = new Date(createdAt);
    const generateTimestamp = (hoursOffset: number) => {
      const timestamp = new Date(
        orderDate.getTime() + hoursOffset * 60 * 60 * 1000
      );
      return format(timestamp, "HH:mm dd/MM/yyyy", { locale: vi });
    };

    const baseProgress = [
      {
        time: generateTimestamp(0),
        title: "Đơn hàng được tạo",
        message:
          "GHN có thông tin chi tiết về gói hàng của bạn và đang chuẩn bị để vận chuyển",
        completed: true,
        icon: mdiClockTimeFour,
        color: "bg-blue-500",
      },
      {
        time: generateTimestamp(2),
        title: "Đang xử lý",
        message:
          "Kiện hàng của bạn đang được gửi đến trung tâm GHN và đang trong quá trình xử lý giao hàng",
        completed: true,
        icon: mdiPackageVariant,
        color: "bg-orange-500",
      },
    ];

    switch (orderStatus) {
      case "CHO_XAC_NHAN":
        return [
          {
            time: generateTimestamp(0),
            title: "Chờ xác nhận",
            message: "Đơn hàng đã được tạo và đang chờ xác nhận từ cửa hàng",
            completed: true,
            icon: mdiClockTimeFour,
            color: "bg-yellow-500",
          },
        ];
      case "CHO_GIAO_HANG":
        return [
          ...baseProgress,
          {
            time: generateTimestamp(4),
            title: "Đã xác nhận",
            message: "GHN đã xác nhận gói hàng của bạn bằng cách quét nhãn",
            completed: true,
            icon: mdiCheckCircle,
            color: "bg-[#EAEBF2]0",
          },
          {
            time: generateTimestamp(6),
            title: "Chuẩn bị giao hàng",
            message: "Kiện hàng của bạn đã được gửi đi từ trung tâm GHN",
            completed: true,
            icon: mdiPackageVariant,
            color: "bg-blue-500",
          },
        ];
      case "DANG_VAN_CHUYEN":
        return [
          ...baseProgress,
          {
            time: generateTimestamp(4),
            title: "Đã xác nhận",
            message: "GHN đã xác nhận gói hàng của bạn bằng cách quét nhãn",
            completed: true,
            icon: mdiCheckCircle,
            color: "bg-[#EAEBF2]0",
          },
          {
            time: generateTimestamp(6),
            title: "Đang vận chuyển",
            message: "Kiện hàng của bạn đã được gửi đi từ trung tâm GHN",
            completed: true,
            icon: mdiTruck,
            color: "bg-blue-500",
          },
          {
            time: generateTimestamp(12),
            title: "Đang phân loại",
            message:
              "Kiện hàng của bạn đang được chuyển đến trung tâm GHN để phân loại",
            completed: true,
            icon: mdiPackageVariant,
            color: "bg-orange-500",
          },
          {
            time: generateTimestamp(18),
            title: "Sẵn sàng giao hàng",
            message:
              "Kiện hàng của bạn đang ở cơ sở địa phương và sẵn sàng để giao hàng",
            completed: true,
            icon: mdiMapMarker,
            color: "bg-purple-500",
          },
        ];
      case "DA_GIAO_HANG":
      case "HOAN_THANH":
        return [
          ...baseProgress,
          {
            time: generateTimestamp(4),
            title: "Đã xác nhận",
            message: "GHN đã xác nhận gói hàng của bạn bằng cách quét nhãn",
            completed: true,
            icon: mdiCheckCircle,
            color: "bg-[#EAEBF2]0",
          },
          {
            time: generateTimestamp(6),
            title: "Đang vận chuyển",
            message: "Kiện hàng của bạn đã được gửi đi từ trung tâm GHN",
            completed: true,
            icon: mdiTruck,
            color: "bg-blue-500",
          },
          {
            time: generateTimestamp(12),
            title: "Đang phân loại",
            message:
              "Kiện hàng của bạn đang được chuyển đến trung tâm GHN để phân loại",
            completed: true,
            icon: mdiPackageVariant,
            color: "bg-orange-500",
          },
          {
            time: generateTimestamp(18),
            title: "Sẵn sàng giao hàng",
            message:
              "Kiện hàng của bạn đang ở cơ sở địa phương và sẵn sàng để giao hàng",
            completed: true,
            icon: mdiMapMarker,
            color: "bg-purple-500",
          },
          {
            time: generateTimestamp(24),
            title: "Đang giao hàng",
            message:
              "Kiện hàng của bạn đang được vận chuyển bằng xe GHN và sẽ được giao trong ngày hôm nay",
            completed: true,
            icon: mdiTruck,
            color: "bg-indigo-500",
          },
          {
            time: generateTimestamp(26),
            title: "Đã đến khu vực",
            message:
              "Kiện hàng của bạn đã đến cơ sở GHN tại khu vực của người nhận",
            completed: true,
            icon: mdiMapMarker,
            color: "bg-teal-500",
          },
          {
            time: generateTimestamp(28),
            title: "Giao hàng thành công",
            message: "Giao hàng thành công. Cảm ơn bạn đã sử dụng dịch vụ!",
            completed: true,
            icon: mdiCheckCircle,
            color: "bg-emerald-500",
          },
        ];
      case "DA_HUY":
        return [
          {
            time: generateTimestamp(0),
            title: "Đơn hàng được tạo",
            message: "Đơn hàng đã được tạo",
            completed: true,
            icon: mdiClockTimeFour,
            color: "bg-blue-500",
          },
          {
            time: generateTimestamp(2),
            title: "Đơn hàng đã hủy",
            message: "Đơn hàng đã bị hủy theo yêu cầu",
            completed: true,
            icon: mdiCancel,
            color: "bg-red-500",
          },
        ];
      default:
        return baseProgress;
    }
  };

  if (!open || !orderId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">
            Đã xảy ra lỗi khi tải thông tin đơn hàng.
          </div>
        ) : (
          orderData?.data && (
            <>
              <DialogHeader className="border-b pb-4">
                <DialogTitle>
                  Chi tiết đơn hàng #{orderData.data.id}
                </DialogTitle>
                <DialogDescription className="mt-2">
                  Ngày đặt:{" "}
                  {format(
                    new Date(orderData.data.created_at),
                    "dd/MM/yyyy HH:mm",
                    { locale: vi }
                  )}
                </DialogDescription>
                <div className="mt-2">
                  <OrderStatusBadge status={orderData.data.status} />
                </div>
              </DialogHeader>

              <div className="py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Icon path={mdiMapMarker} size={0.8} /> Địa chỉ giao
                        hàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div className="flex items-start">
                        <span className="text-muted-foreground w-32">
                          Người nhận:
                        </span>
                        <span className="font-medium">
                          {orderData.data.shipping_address
                            ? "Người nhận"
                            : "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-muted-foreground w-32">
                          Số điện thoại:
                        </span>
                        <span>
                          {orderData.data.shipping_address
                            ?.recipient_phone_number || "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-muted-foreground w-32">
                          Địa chỉ:
                        </span>
                        <span>
                          {orderData.data.shipping_address
                            ? `${orderData.data.shipping_address.address}, ${orderData.data.shipping_address.city}`
                            : "Chưa cập nhật địa chỉ giao hàng"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Icon path={mdiCreditCardOutline} size={0.8} /> Thông
                        tin thanh toán
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div className="flex items-start">
                        <span className="text-muted-foreground w-32">
                          Phương thức:
                        </span>
                        <div className="flex items-center">
                          <Icon
                            path={
                              orderData.data.payment_method === "COD"
                                ? mdiCashMultiple
                                : mdiCreditCardOutline
                            }
                            size={0.8}
                            className="mr-2 text-primary"
                          />
                          <span>
                            {getPaymentMethodName(
                              orderData.data.payment_method
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-muted-foreground w-32">
                          Trạng thái:
                        </span>
                        <Badge
                          variant={orderData.data.is_paid ? "PAID" : "UNPAID"}
                        >
                          {orderData.data.is_paid
                            ? "Đã thanh toán"
                            : "Chờ thanh toán"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Icon path={mdiOrderBoolAscending} size={0.8} /> Chi tiết
                      đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Hình ảnh</TableHead>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead className="text-right">Đơn giá</TableHead>
                          <TableHead className="text-center">
                            Số lượng
                          </TableHead>
                          <TableHead className="text-right">
                            Thành tiền
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderData.data.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <img
                                src={
                                  item.images?.[0] || "/images/white-image.png"
                                }
                                alt={item.name}
                                className="w-20 h-20 object-contain rounded-md"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div>
                                {item.name || "Sản phẩm không xác định"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Mã: {item.product_id || "N/A"}
                              </div>
                              {item.color_selected && (
                                <div className="text-xs text-muted-foreground">
                                  Màu: {item.color_selected}
                                </div>
                              )}
                              {item.size_selected && (
                                <div className="text-xs text-muted-foreground">
                                  Size: {item.size_selected}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatPrice(
                                parseFloat(item.price_sale.toString())
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.qty}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatPrice(
                                parseFloat(item.price_sale.toString()) *
                                  item.qty
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="mt-6 space-y-4 border-t pt-4">
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Tạm tính:</span>
                        <span>
                          {formatPrice(
                            parseFloat(orderData.data.total_price.toString()) -
                              parseFloat(
                                orderData.data.shipping_price.toString()
                              ) -
                              parseFloat(orderData.data.tax_price.toString())
                          )}
                        </span>
                      </div>
                      {parseFloat(orderData.data.tax_price.toString()) > 0 && (
                        <div className="flex justify-between items-center text-green-600 font-medium">
                          <span>Thuế (VAT):</span>
                          <span>
                            {formatPrice(
                              parseFloat(orderData.data.tax_price.toString())
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Phí vận chuyển:</span>
                        <span>
                          {formatPrice(
                            parseFloat(orderData.data.shipping_price.toString())
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold border-t pt-3">
                        <span>Tổng tiền:</span>
                        <span className="text-primary">
                          {formatPrice(
                            parseFloat(orderData.data.total_price.toString())
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon
                        path={mdiTruck}
                        size={0.8}
                        className="text-primary"
                      />{" "}
                      Tiến trình đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="relative">
                      {getShippingProgress(
                        orderData.data.status,
                        orderData.data.created_at
                      ).map((step, index, array) => (
                        <div
                          key={index}
                          className="relative flex items-start pb-8 last:pb-0"
                        >
                          {index < array.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-gray-300 to-gray-200"></div>
                          )}
                          <div className="relative flex-shrink-0 mr-4">
                            <div
                              className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center shadow-sm ring-4 ring-white`}
                            >
                              <Icon
                                path={step.icon}
                                size={0.8}
                                className="text-white"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-100 p-4 shadow-sm transition-shadow duration-200">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-semibold text-gray-700">
                                {step.title}
                              </h4>
                              <span className="text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded-full">
                                {step.time}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {step.message}
                            </p>
                            {step.completed && (
                              <div className="mt-3 flex items-center text-xs text-green-600 font-medium">
                                <Icon
                                  path={mdiCheckCircle}
                                  size={0.8}
                                  className="mr-1"
                                />{" "}
                                Hoàn thành
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter className="border-t pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Đóng
                </Button>
              </DialogFooter>
            </>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export const CreateReturnDialog: React.FC<{
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}> = ({ orderId, open, onOpenChange, onSuccess }) => {
  const createReturnMutation = useCreateReturnRequest();
  const { data: returnableOrdersData } = useReturnableOrders();
  const { user } = useUser();
  const { data: ordersData } = useOrdersByUser(user?.id || "");

  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [reason, setReason] = useState("");

  const returnableOrder = returnableOrdersData?.data?.orders?.find(
    (o) => o.id === orderId
  );
  const displayOrder = ordersData?.data?.orders?.find((o) => o.id === orderId);
  const order = displayOrder || returnableOrder;

  const handleAddItem = (item: IOrderItem) => {
    if (!item.product_id) {
      toast.error("Không thể xác định thông tin sản phẩm");
      return;
    }

    const existingIndex = selectedItems.findIndex(
      (si) =>
        si.product === item.product_id.toString() &&
        si.variant.colorId === item.color_selected &&
        si.variant.sizeId === item.size_selected
    );

    if (existingIndex >= 0) {
      const newItems = [...selectedItems];
      if (newItems[existingIndex].quantity < item.qty) {
        newItems[existingIndex].quantity += 1;
        setSelectedItems(newItems);
      }
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          product: item.product_id.toString(),
          variant: { colorId: item.color_selected, sizeId: item.size_selected },
          quantity: 1,
          maxQuantity: item.qty,
          productName: item.name,
          price: item.price_sale,
        },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...selectedItems];
    if (newItems[index].quantity > 1) {
      newItems[index].quantity -= 1;
    } else {
      newItems.splice(index, 1);
    }
    setSelectedItems(newItems);
  };

  const handleSubmit = () => {
    if (!orderId || selectedItems.length === 0 || !reason.trim()) {
      toast.error("Vui lòng chọn sản phẩm và nhập lý do trả hàng");
      return;
    }

    const payload: ICustomerReturnRequest = {
      originalOrder: orderId,
      items: selectedItems.map((item) => ({
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
      })),
      reason: reason.trim(),
    };

    createReturnMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Yêu cầu trả hàng đã được gửi thành công");
        setSelectedItems([]);
        setReason("");
        onOpenChange(false);
        onSuccess?.();
      },
      onError: () => toast.error("Đã xảy ra lỗi khi tạo yêu cầu trả hàng"),
    });
  };

  if (!open || !orderId || !order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            Tạo yêu cầu trả hàng - Đơn #{order.id.slice(-6).toUpperCase()}
          </DialogTitle>
          <DialogDescription>
            Chọn sản phẩm bạn muốn trả và nhập lý do trả hàng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Sản phẩm trong đơn hàng:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.images?.[0] || "/images/white-image.png"}
                      alt={item.name}
                      className="w-12 h-12 object-contain rounded"
                    />
                    <div>
                      <p className="font-medium">
                        {item.name || "Sản phẩm không xác định"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Số lượng: {item.qty} | Giá:{" "}
                        {formatPrice(item.price_sale)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mã: {item.product_id}
                      </p>
                      {item.color_selected && (
                        <p className="text-xs text-muted-foreground">
                          Màu: {item.color_selected}
                        </p>
                      )}
                      {item.size_selected && (
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size_selected}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem(item)}
                    className="gap-2"
                  >
                    <Icon path={mdiPlus} size={0.8} /> Thêm
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Sản phẩm trả hàng:</h4>
              <div className="space-y-2">
                {selectedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Số lượng: {item.quantity} | Giá:{" "}
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Icon path={mdiMinus} size={0.8} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newItems = [...selectedItems];
                          newItems.splice(index, 1);
                          setSelectedItems(newItems);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Icon path={mdiDelete} size={0.8} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Lý do trả hàng *
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do bạn muốn trả hàng..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              createReturnMutation.isPending ||
              selectedItems.length === 0 ||
              !reason.trim()
            }
            className="gap-2"
          >
            {createReturnMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
            ) : (
              <Icon path={mdiKeyboardReturn} size={0.8} />
            )}
            Gửi yêu cầu trả hàng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Tab Component ---

export const OrdersTab = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: ordersData,
    isLoading,
    isError,
    refetch,
  } = useOrdersByUser(userId || "");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [createReturnOrderId, setCreateReturnOrderId] = useState<string | null>(
    null
  );
  const [createReturnOpen, setCreateReturnOpen] = useState(false);
  const { data: returnableOrdersData, refetch: refetchReturnableOrders } =
    useReturnableOrders();

  const handleViewOrderDetails = (id: string) => {
    setSelectedOrderId(id);
    setOrderDetailOpen(true);
  };

  const handleCreateReturn = (id: string) => {
    setCreateReturnOrderId(id);
    setCreateReturnOpen(true);
  };

  const isOrderReturnable = (order: IOrder) => {
    return (
      order.status === "HOAN_THANH" &&
      returnableOrdersData?.data?.orders?.some((ro) => ro.id === order.id)
    );
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng";
      case "VNPAY":
        return "Thanh toán qua VNPay";
      case "MOMO":
        return "Thanh toán MOMO";
      case "STRIPE":
        return "Thanh toán thẻ quốc tế (Stripe)";
      case "BANK_TRANSFER":
        return "Chuyển khoản ngân hàng";
      default:
        return method;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon
              path={mdiOrderBoolAscending}
              size={0.8}
              className="text-primary"
            />
            <span>Đơn hàng của bạn</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="py-8 text-center text-red-500">
              Đã xảy ra lỗi khi tải đơn hàng. Vui lòng thử lại sau.
            </div>
          ) : !ordersData?.data?.orders?.length ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Bạn chưa có đơn hàng nào.
              </p>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/products")}
              >
                Mua sắm ngay
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px] px-3 py-2 whitespace-nowrap">
                      Đơn hàng
                    </TableHead>
                    <TableHead className="w-[180px] px-3 py-2 whitespace-nowrap">
                      Ngày đặt
                    </TableHead>
                    <TableHead className="w-[200px] px-3 py-2 whitespace-nowrap">
                      Sản phẩm
                    </TableHead>
                    <TableHead className="w-[120px] text-right px-3 py-2 whitespace-nowrap">
                      Tổng tiền
                    </TableHead>
                    <TableHead className="w-[140px] px-3 py-2 whitespace-nowrap">
                      Trạng thái đơn hàng
                    </TableHead>
                    <TableHead className="w-[180px] px-3 py-2 whitespace-nowrap">
                      Phương thức thanh toán
                    </TableHead>
                    <TableHead className="w-[140px] px-3 py-2 whitespace-nowrap">
                      Trạng thái thanh toán
                    </TableHead>
                    <TableHead className="w-[120px] text-center px-3 py-2 whitespace-nowrap">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersData.data.orders.map((order: IOrder) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium px-3 py-2 whitespace-nowrap text-gray-700">
                        #{order.id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell className="px-3 py-2 whitespace-nowrap text-gray-700">
                        {format(
                          new Date(order.created_at),
                          "dd/MM/yyyy HH:mm",
                          { locale: vi }
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <div className="flex gap-1 flex-wrap">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={
                                  item.images?.[0] || "/images/white-image.png"
                                }
                                alt={item.name}
                                className="w-12 h-12 object-contain rounded border"
                                title={item.name}
                              />
                              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                {item.qty}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium px-3 py-2 whitespace-nowrap text-gray-700">
                        {formatPrice(parseFloat(order.total_price.toString()))}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="px-3 py-2 whitespace-nowrap text-gray-700">
                        {getPaymentMethodName(order.payment_method)}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <Badge variant={order.is_paid ? "PAID" : "UNPAID"}>
                          {order.is_paid ? "Đã thanh toán" : "Chờ thanh toán"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center px-3 py-2">
                        <div className="flex items-center justify-start space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewOrderDetails(order.id)}
                            title="Xem chi tiết"
                          >
                            <Icon path={mdiEye} size={0.8} />
                          </Button>
                          {isOrderReturnable(order) && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleCreateReturn(order.id)}
                              title="Yêu cầu trả hàng"
                            >
                              <Icon path={mdiKeyboardReturn} size={0.8} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {ordersData.data.pages > 1 && (
                <div className="flex items-center justify-center space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Trang trước
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Trang {currentPage} / {ordersData.data.pages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === ordersData.data.pages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Trang sau
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <OrderDetailDialog
        orderId={selectedOrderId}
        open={orderDetailOpen}
        onOpenChange={setOrderDetailOpen}
      />
      <CreateReturnDialog
        orderId={createReturnOrderId}
        open={createReturnOpen}
        onOpenChange={setCreateReturnOpen}
        onSuccess={() => {
          refetch();
          refetchReturnableOrders();
        }}
      />
    </>
  );
};
