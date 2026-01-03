"use client";

import React, { useEffect, useState, createContext } from "react";

import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@mdi/react";
import {
  mdiLock,
  mdiAccountEdit,
  mdiChevronRight,
  mdiOrderBoolAscending,
  mdiEye,
  mdiMapMarker,
  mdiCreditCardOutline,
  mdiCashMultiple,
  mdiAlertCircleOutline,
  mdiContentSaveOutline,
  mdiTicketPercentOutline,
  mdiContentCopy,
  mdiTruck,
  mdiPackageVariant,
  mdiCheckCircle,
  mdiClockOutline,
  mdiCancel,
  mdiKeyboardReturn,
  mdiPlus,
  mdiDelete,
  mdiMinus,
} from "@mdi/js";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useUser } from "@/context/useUserContext";
import { useOrdersByUser, useOrderDetail } from "@/hooks/order";
import { useToast } from "@/hooks/useToast";
import { useUpdateUserProfile, useChangePassword } from "@/hooks/account";
import { useAvailableVouchersForUser } from "@/hooks/voucher";
import {
  useReturnableOrders,
  useCreateReturnRequest,
  useMyReturns,
  useMyReturnDetail,
  useCancelMyReturn,
} from "@/hooks/return";
import { IVoucher } from "@/interface/response/voucher";
import { IOrder } from "@/interface/response/order";
import { IReturn, IReturnableOrder } from "@/interface/response/return";
import { ICustomerReturnRequest } from "@/interface/request/return";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { formatPrice } from "@/utils/formatters";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const sidebarAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const contentAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.2 } },
};

export const AccountTabContext = createContext({
  activeTab: "profile",
  setActiveTab: (tab: string) => {},
});

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    CHO_XAC_NHAN: {
      label: "Chờ xác nhận",
      className: "!bg-yellow-400 !text-white !border-yellow-500 text-nowrap",
    },
    CHO_GIAO_HANG: {
      label: "Chờ giao hàng",
      className: "!bg-blue-400 !text-white !border-blue-500 text-nowrap",
    },
    DANG_VAN_CHUYEN: {
      label: "Đang vận chuyển",
      className: "!bg-orange-400 !text-white !border-orange-500 text-nowrap",
    },
    DA_GIAO_HANG: {
      label: "Đã giao hàng",
      className: "!bg-green-400 !text-white !border-green-500 text-nowrap",
    },
    HOAN_THANH: {
      label: "Hoàn thành",
      className: "!bg-emerald-400 !text-white !border-emerald-500 text-nowrap",
    },
    DA_HUY: {
      label: "Đã hủy",
      className: "!bg-red-400 !text-white !border-red-500 text-nowrap",
    },
  };

  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-400 text-maintext border-gray-500",
  };

  return (
    <Badge className={`${config.className} rounded-[4px] font-normal`}>
      {config.label}
    </Badge>
  );
};

interface OrderDetailDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  orderId,
  open,
  onOpenChange,
}) => {
  const { data: orderData, isLoading, isError } = useOrderDetail(orderId || "");

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng";
      case "VNPAY":
        return "Thanh toán qua VNPay";
      case "BANK_TRANSFER":
        return "Chuyển khoản ngân hàng";
      default:
        return method;
    }
  };

  const getPaymentStatusName = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ thanh toán";
      case "PAID":
        return "Đã thanh toán";
      case "FAILED":
        return "Thanh toán thất bại";
      case "REFUNDED":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  const getShippingProgress = (orderStatus: string, createdAt: string) => {
    const orderDate = new Date(createdAt);
    const now = new Date();

    // Generate realistic timestamps based on order status
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
        icon: mdiClockOutline,
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
            icon: mdiClockOutline,
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
            color: "bg-green-500",
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
            color: "bg-green-500",
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
            color: "bg-green-500",
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
            icon: mdiClockOutline,
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
          <div className="p-8 text-center">
            <p className="text-red-500">
              Đã xảy ra lỗi khi tải thông tin đơn hàng.
            </p>
          </div>
        ) : orderData && orderData.data ? (
          <>
            <DialogHeader className="border-b pb-4">
              <DialogTitle>
                Chi tiết đơn hàng #{(orderData.data as any)?.code}
              </DialogTitle>
              <DialogDescription className="mt-2">
                Ngày đặt: {formatDate(orderData.data.createdAt)}
              </DialogDescription>
              <div className="mt-2">
                <OrderStatusBadge status={orderData.data.orderStatus} />
              </div>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Thông tin giao hàng */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Icon path={mdiMapMarker} size={0.7} className="mr-2" />
                      Địa chỉ giao hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">
                        Người nhận:
                      </span>
                      <span className="font-medium">
                        {(orderData.data as any).shippingName ||
                          orderData.data.customer?.fullName ||
                          "Chưa cập nhật"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">
                        Số điện thoại:
                      </span>
                      <span>
                        {(orderData.data as any).shippingPhoneNumber ||
                          orderData.data.customer?.phoneNumber ||
                          "Chưa cập nhật"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">
                        Địa chỉ:
                      </span>
                      <span>
                        {(orderData.data as any).shippingSpecificAddress ||
                          "Chưa cập nhật địa chỉ giao hàng"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                {/* Thông tin thanh toán */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Icon
                        path={mdiCreditCardOutline}
                        size={0.7}
                        className="mr-2"
                      />
                      Thông tin thanh toán
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
                            orderData.data.paymentMethod === "COD"
                              ? mdiCashMultiple
                              : mdiCreditCardOutline
                          }
                          size={0.7}
                          className="mr-2 text-primary"
                        />
                        <span>
                          {getPaymentMethodName(orderData.data.paymentMethod)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-muted-foreground w-32">
                        Trạng thái:
                      </span>
                      <span>
                        <Badge
                          className={
                            orderData.data.paymentStatus === "PAID"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "!bg-extra text-white"
                          }
                        >
                          {getPaymentStatusName(orderData.data.paymentStatus)}
                        </Badge>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Thông tin đơn hàng */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Icon
                      path={mdiOrderBoolAscending}
                      size={0.7}
                      className="mr-2"
                    />
                    Chi tiết đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Hình ảnh</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-center">Số lượng</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderData.data.items.map((item, index) => {
                        const productVariant = item.productVariant as any;
                        const product = productVariant?.product;
                        const imageUrl = productVariant?.images?.[0]?.imageUrl;
                        const color = productVariant?.color;
                        const size = productVariant?.size;

                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <img
                                src={imageUrl || "/images/white-image.png"}
                                alt={product?.name || ""}
                                className="w-16 h-16 object-contain rounded-md"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div>
                                <div className="font-medium">
                                  {product?.name || "Sản phẩm không xác định"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Mã: {product?.code || "N/A"}
                                </div>
                                {product?.brand && (
                                  <div className="text-xs text-muted-foreground">
                                    Thương hiệu: {product.brand.name}
                                  </div>
                                )}
                                {color && (
                                  <div className="text-xs text-muted-foreground">
                                    Màu: {color.name}
                                  </div>
                                )}
                                {size && (
                                  <div className="text-xs text-muted-foreground">
                                    Size: {size.value}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatPrice(parseFloat(item.price.toString()))}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatPrice(
                                parseFloat(item.price.toString()) *
                                  item.quantity
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  <div className="mt-6 space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tạm tính:</span>
                      <span>
                        {formatPrice(
                          parseFloat(orderData.data.subTotal.toString())
                        )}
                      </span>
                    </div>
                    {parseFloat(orderData.data.discount.toString()) > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Giảm giá:</span>
                        <span>
                          -
                          {formatPrice(
                            parseFloat(orderData.data.discount.toString())
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Phí vận chuyển:
                      </span>
                      <span>
                        {formatPrice(
                          parseFloat(orderData.data.total.toString()) -
                            parseFloat(orderData.data.subTotal.toString()) +
                            parseFloat(orderData.data.discount.toString()) || 0
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-3">
                      <span>Tổng tiền:</span>
                      <span className="text-primary">
                        {formatPrice(
                          parseFloat(orderData.data.total.toString())
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tiến trình đơn hàng */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon
                      path={mdiTruck}
                      size={0.7}
                      className="mr-3 text-primary"
                    />
                    Tiến trình đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="relative">
                    {getShippingProgress(
                      orderData.data.orderStatus,
                      orderData.data.createdAt
                    ).map((step, index, array) => (
                      <div
                        key={index}
                        className="relative flex items-start pb-8 last:pb-0"
                      >
                        {/* Timeline line */}
                        {index < array.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-gray-300 to-gray-200"></div>
                        )}

                        {/* Icon container */}
                        <div className="relative flex-shrink-0 mr-4">
                          <div
                            className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center shadow-sm ring-4 ring-white`}
                          >
                            <Icon
                              path={step.icon}
                              size={0.7}
                              className="text-white"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-sm transition-shadow duration-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-maintext">
                              {step.title}
                            </h4>
                            <span className="text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded-full">
                              {step.time}
                            </span>
                          </div>
                          <p className="text-sm text-maintext leading-relaxed">
                            {step.message}
                          </p>
                          {step.completed && (
                            <div className="mt-3 flex items-center text-xs text-green-600">
                              <Icon
                                path={mdiCheckCircle}
                                size={0.7}
                                className="mr-1"
                              />
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
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Không tìm thấy thông tin đơn hàng.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Return Status Badge Component
const ReturnStatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    CHO_XU_LY: {
      label: "Chờ xử lý",
      className: "!bg-yellow-400 !text-white !border-yellow-500 text-nowrap",
    },
    DA_HOAN_TIEN: {
      label: "Đã hoàn tiền",
      className: "!bg-green-400 !text-white !border-green-500 text-nowrap",
    },
    DA_HUY: {
      label: "Đã hủy",
      className: "!bg-red-400 !text-white !border-red-500 text-nowrap",
    },
  };

  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-400 text-maintext border-gray-500",
  };

  return (
    <Badge className={`${config.className} rounded-[4px] font-normal`}>
      {config.label}
    </Badge>
  );
};

interface CreateReturnDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateReturnDialog: React.FC<CreateReturnDialogProps> = ({
  orderId,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const createReturnMutation = useCreateReturnRequest();
  const { data: returnableOrdersData } = useReturnableOrders();
  const { profile } = useUser();
  const userId = profile?.data?.id;
  const { data: ordersData } = useOrdersByUser(userId || "");

  const [selectedItems, setSelectedItems] = useState<
    Array<{
      product: string;
      variant: { colorId: string; sizeId: string };
      quantity: number;
      maxQuantity: number;
      productName: string;
      price: number;
    }>
  >([]);
  const [reason, setReason] = useState("");

  const returnableOrder = returnableOrdersData?.data?.orders?.find(
    (o) => o.id === orderId
  );
  const displayOrder = ordersData?.data?.orders?.find((o) => o.id === orderId);
  const order = displayOrder || returnableOrder;

  const handleAddItem = (item: any) => {
    const productVariant = item.productVariant as any;
    const product = productVariant?.product;

    if (!product || !productVariant) {
      toast.error("Không thể xác định thông tin sản phẩm");
      return;
    }

    const existingIndex = selectedItems.findIndex(
      (si) =>
        si.product === product.id &&
        si.variant.colorId === productVariant.colorId &&
        si.variant.sizeId === productVariant.sizeId
    );

    if (existingIndex >= 0) {
      const newItems = [...selectedItems];
      if (newItems[existingIndex].quantity < item.quantity) {
        newItems[existingIndex].quantity += 1;
        setSelectedItems(newItems);
      }
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          product: product.id,
          variant: {
            colorId: productVariant.colorId,
            sizeId: productVariant.sizeId,
          },
          quantity: 1,
          maxQuantity: item.quantity,
          productName: product.name,
          price: item.price,
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
      onError: (error) => {
        toast.error("Đã xảy ra lỗi khi tạo yêu cầu trả hàng");
      },
    });
  };

  if (!open || !orderId || !order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu trả hàng - Đơn #{order.code}</DialogTitle>
          <DialogDescription>
            Chọn sản phẩm bạn muốn trả và nhập lý do trả hàng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Sản phẩm trong đơn hàng:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {order.items.map((item, index) => {
                const productVariant = item.productVariant as any;
                const product = productVariant?.product;
                const imageUrl = productVariant?.images?.[0]?.imageUrl;
                const color = productVariant?.color;
                const size = productVariant?.size;

                if (!product) {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src="/images/white-image.png"
                          alt="Sản phẩm không xác định"
                          className="w-12 h-12 object-contain rounded"
                        />
                        <div>
                          <p className="font-medium text-muted-foreground">
                            Sản phẩm không xác định
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Số lượng: {item.quantity} | Giá:{" "}
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="gap-2"
                      >
                        Không thể trả
                      </Button>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={imageUrl || "/images/white-image.png"}
                        alt={product?.name || "Sản phẩm"}
                        className="w-12 h-12 object-contain rounded"
                      />
                      <div>
                        <p className="font-medium">
                          {product?.name || "Sản phẩm không xác định"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Số lượng: {item.quantity} | Giá:{" "}
                          {formatPrice(item.price)}
                        </p>
                        {product?.code && (
                          <p className="text-xs text-muted-foreground">
                            Mã: {product.code}
                          </p>
                        )}
                        {color && (
                          <p className="text-xs text-muted-foreground">
                            Màu: {color.name}
                          </p>
                        )}
                        {size && (
                          <p className="text-xs text-muted-foreground">
                            Size: {size.value}
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
                      <Icon path={mdiPlus} size={0.7} />
                      Thêm
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sản phẩm đã chọn trả */}
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
                        className="gap-1"
                      >
                        <Icon path={mdiMinus} size={0.7} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newItems = [...selectedItems];
                          newItems.splice(index, 1);
                          setSelectedItems(newItems);
                        }}
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <Icon path={mdiDelete} size={0.7} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lý do trả hàng */}
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
              <Icon path={mdiKeyboardReturn} size={0.7} />
            )}
            Gửi yêu cầu trả hàng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Return Detail Dialog
interface ReturnDetailDialogProps {
  returnId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
}

const ReturnDetailDialog: React.FC<ReturnDetailDialogProps> = ({
  returnId,
  open,
  onOpenChange,
  onCancel,
}) => {
  const {
    data: returnData,
    isLoading,
    isError,
  } = useMyReturnDetail(returnId || "");
  const cancelReturnMutation = useCancelMyReturn();

  const handleCancelReturn = () => {
    if (!returnId) return;

    cancelReturnMutation.mutate(returnId, {
      onSuccess: () => {
        toast.success("Đã hủy yêu cầu trả hàng");
        onCancel?.();
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error("Đã xảy ra lỗi khi hủy yêu cầu");
      },
    });
  };

  if (!open || !returnId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="text-red-500">
              Đã xảy ra lỗi khi tải thông tin trả hàng.
            </p>
          </div>
        ) : returnData && returnData.data ? (
          <>
            <DialogHeader>
              <DialogTitle>
                Chi tiết trả hàng #{returnData.data.code}
              </DialogTitle>
              <DialogDescription>
                Ngày tạo:{" "}
                {format(
                  new Date(returnData.data.createdAt),
                  "dd/MM/yyyy HH:mm",
                  { locale: vi }
                )}
              </DialogDescription>
              <div className="mt-2">
                <ReturnStatusBadge status={returnData.data.status} />
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {/* Thông tin đơn hàng gốc */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Thông tin đơn hàng gốc
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Mã đơn hàng:{" "}
                    <span className="font-medium">
                      {typeof returnData.data.originalOrder === "string"
                        ? returnData.data.originalOrder
                        : returnData.data.originalOrder.code}
                    </span>
                  </p>
                </CardContent>
              </Card>

              {/* Sản phẩm trả hàng */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Sản phẩm trả hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {returnData.data.items.map((item: any, index) => {
                      // Check if it's the new structure with productVariant or old structure with product
                      const productVariant = item.productVariant as any;
                      const product = productVariant?.product || item.product;
                      const imageUrl =
                        productVariant?.images?.[0]?.imageUrl ||
                        product?.variants?.[0]?.images?.[0];
                      const color = productVariant?.color;
                      const size = productVariant?.size;

                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 border rounded-lg"
                        >
                          <img
                            src={imageUrl || "/images/white-image.png"}
                            alt={product?.name || "Sản phẩm"}
                            className="w-12 h-12 object-contain rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">
                              {product?.name || "Sản phẩm không xác định"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Số lượng: {item.quantity} | Giá:{" "}
                              {formatPrice(item.price)}
                            </p>
                            {product?.code && (
                              <p className="text-xs text-muted-foreground">
                                Mã: {product.code}
                              </p>
                            )}
                            {color && (
                              <p className="text-xs text-muted-foreground">
                                Màu: {color.name}
                              </p>
                            )}
                            {size && (
                              <p className="text-xs text-muted-foreground">
                                Size: {size.value}
                              </p>
                            )}
                            {item.reason && (
                              <p className="text-sm text-muted-foreground">
                                Lý do: {item.reason}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Tổng tiền hoàn */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Thông tin hoàn tiền
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Tổng tiền hoàn:</span>
                    <span className="text-primary">
                      {formatPrice(returnData.data.totalRefund)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              {returnData.data.status === "CHO_XU_LY" && (
                <Button
                  variant="destructive"
                  onClick={handleCancelReturn}
                  disabled={cancelReturnMutation.isPending}
                  className="gap-2"
                >
                  {cancelReturnMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
                  ) : (
                    <Icon path={mdiCancel} size={0.7} />
                  )}
                  Hủy yêu cầu
                </Button>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Không tìm thấy thông tin trả hàng.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Tab Thông tin cá nhân
const ProfileTab = () => {
  const { profile } = useUser();
  const userData = profile?.data;
  const { showToast } = useToast();
  const updateProfileMutation = useUpdateUserProfile();

  // Form validation schema
  const formSchema = z.object({
    fullName: z
      .string()
      .min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    phoneNumber: z
      .string()
      .regex(/^[0-9]{10,11}$/, { message: "Số điện thoại không hợp lệ" })
      .optional()
      .or(z.literal("")),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      phoneNumber: userData?.phoneNumber || "",
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (userData) {
      form.reset({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
      });
    }
  }, [userData, form]);

  // Submit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateProfileMutation.mutate(
      {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber || undefined,
      },
      {
        onSuccess: (response) => {
          showToast({
            title: "Cập nhật thành công",
            message: "Thông tin cá nhân đã được cập nhật",
            type: "success",
          });
        },
        onError: (error) => {
          showToast({
            title: "Lỗi",
            message: error.message || "Đã xảy ra lỗi khi cập nhật thông tin",
            type: "error",
          });
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon path={mdiAccountEdit} size={0.7} className="text-primary" />
          <span>Cập nhật thông tin cá nhân</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="sm:w-1/3 flex flex-col items-center space-y-4">
                <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-semibold">
                  {userData?.fullName?.charAt(0) ||
                    userData?.email?.charAt(0) ||
                    "U"}
                </div>
                <Button
                  variant="outline"
                  className="w-full max-w-[160px]"
                  type="button"
                >
                  Thay đổi ảnh
                </Button>
              </div>

              <div className="sm:w-2/3 space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email" {...field} disabled />
                      </FormControl>
                      <FormDescription>
                        Email không thể thay đổi
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => form.reset()}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="gap-2"
              >
                {updateProfileMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
                ) : (
                  <Icon path={mdiContentSaveOutline} size={0.7} />
                )}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Tab Đổi mật khẩu
const PasswordTab = () => {
  const changePasswordMutation = useChangePassword();
  const { showToast } = useToast();

  // Form validation schema
  const formSchema = z
    .object({
      currentPassword: z
        .string()
        .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
      newPassword: z
        .string()
        .min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" }),
      confirmPassword: z
        .string()
        .min(6, { message: "Mật khẩu xác nhận phải có ít nhất 6 ký tự" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Mật khẩu xác nhận không khớp",
      path: ["confirmPassword"],
    });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Submit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    changePasswordMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.newPassword,
      },
      {
        onSuccess: (response) => {
          showToast({
            title: "Thành công",
            message: "Đổi mật khẩu thành công",
            type: "success",
          });
          form.reset();
        },
        onError: (error) => {
          showToast({
            title: "Lỗi",
            message: error.message || "Đã xảy ra lỗi khi đổi mật khẩu",
            type: "error",
          });
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon path={mdiLock} size={0.7} className="text-primary" />
          <span>Đổi mật khẩu</span>
        </CardTitle>
        <CardDescription>
          Cập nhật mật khẩu để bảo vệ tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu hiện tại</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu hiện tại"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mật khẩu phải có ít nhất 6 ký tự
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => form.reset()}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="gap-2"
              >
                {changePasswordMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
                ) : (
                  <Icon path={mdiLock} size={0.7} />
                )}
                Cập nhật mật khẩu
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Tab Mã giảm giá
const VouchersTab = () => {
  const { profile } = useUser();
  const userId = profile?.data?.id;
  const {
    data: vouchersData,
    isLoading,
    isError,
  } = useAvailableVouchersForUser(userId || "", {});

  const formatDiscountValue = (
    discountType: "PERCENTAGE" | "FIXED_AMOUNT",
    discountValue: number
  ) => {
    if (discountType === "PERCENTAGE") {
      return `${discountValue}%`;
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(discountValue);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-1/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon
              path={mdiAlertCircleOutline}
              size={0.7}
              className="text-primary"
            />
            <span>Lỗi tải mã giảm giá</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            Đã xảy ra lỗi khi tải danh sách mã giảm giá của bạn. Vui lòng thử
            lại sau.
          </p>
        </CardContent>
      </Card>
    );
  }

  const vouchers = vouchersData?.data?.vouchers;
  if (!vouchers || vouchers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon path={mdiTicketPercentOutline} size={0.7} />
            <span>Mã giảm giá</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bạn không có mã giảm giá nào hiện có.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon
              path={mdiTicketPercentOutline}
              size={0.7}
              className="text-primary"
            />
            <span>Mã giảm giá của bạn</span>
          </CardTitle>
          <CardDescription>
            Danh sách các mã giảm giá bạn có thể sử dụng để tiết kiệm khi mua
            sắm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            {vouchers.map((voucher: IVoucher) => (
              <Card
                key={voucher.id}
                className={`relative overflow-hidden shadow-sm transition-all hover:shadow-sm group
                                ${
                                  voucher.status === "INACTIVE" ||
                                  new Date(voucher.endDate) < new Date()
                                    ? "bg-muted/30 border-dashed"
                                    : "bg-card border-primary/20 hover:border-primary/50"
                                }`}
              >
                {(voucher.status === "INACTIVE" ||
                  new Date(voucher.endDate) < new Date()) && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge
                      variant="destructive"
                      className="text-xs px-2 py-1 rounded-full shadow-sm"
                    >
                      {new Date(voucher.endDate) < new Date()
                        ? "Đã hết hạn"
                        : "Ngừng hoạt động"}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-3 relative">
                  {!(
                    voucher.status === "INACTIVE" ||
                    new Date(voucher.endDate) < new Date()
                  ) && (
                    <div className="absolute -top-4 -left-5 w-16 h-16 bg-primary/10 rounded-full transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
                  )}
                  <div className="relative z-0">
                    <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-primary tracking-wide">
                      {voucher.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Mã:{" "}
                      <span className="font-semibold text-foreground tracking-wider bg-primary/10 px-1.5 py-0.5 rounded">
                        {voucher.code}
                      </span>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4.5 text-sm pt-2">
                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-muted-foreground">
                        Giá trị giảm:
                      </span>
                      <span className="font-bold text-lg text-primary">
                        {formatDiscountValue(
                          voucher.discountType,
                          voucher.discountValue
                        )}
                      </span>
                    </div>
                    {voucher.discountType === "PERCENTAGE" &&
                      voucher.maxDiscount && (
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Tối đa:</span>
                          <span>{formatPrice(voucher.maxDiscount)}</span>
                        </div>
                      )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-muted-foreground">
                      Đơn tối thiểu:
                    </span>
                    <span className="font-semibold">
                      {formatPrice(voucher.minOrderValue || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-muted-foreground">
                      Hiệu lực:
                    </span>
                    <span className="font-semibold">
                      {formatDate(voucher.startDate)} -{" "}
                      {formatDate(voucher.endDate)}
                    </span>
                  </div>
                  {voucher.quantity - voucher.usedCount > 0 &&
                    voucher.quantity < Infinity && (
                      <div className="text-xs text-blue-600 flex justify-between items-center">
                        <span className="font-medium text-muted-foreground">
                          Lượt sử dụng còn lại:
                        </span>
                        <span className="font-semibold">
                          {voucher.quantity - voucher.usedCount}
                        </span>
                      </div>
                    )}

                  {voucher.status === "ACTIVE" &&
                  new Date(voucher.endDate) >= new Date() ? (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full mt-4 bg-primary hover:bg-primary/80 text-primary-foreground gap-2 shadow-sm hover:shadow-sm transition-shadow"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(voucher.code)
                          .then(() => {
                            toast.success(`Đã sao chép mã: ${voucher.code}`, {
                              position: "top-right",
                              autoClose: 3000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            });
                          })
                          .catch((err) => {
                            toast.error("Không thể sao chép mã giảm giá.", {
                              position: "top-right",
                              autoClose: 3000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            });
                          });
                      }}
                    >
                      <Icon path={mdiContentCopy} size={0.7} />
                      Sao chép mã
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 cursor-not-allowed"
                      disabled
                    >
                      Không thể sử dụng
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Tab Trả hàng
const ReturnsTab = () => {
  const { data: returnsData, isLoading, isError, refetch } = useMyReturns();
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null);
  const [returnDetailOpen, setReturnDetailOpen] = useState(false);

  const handleViewReturnDetails = (returnId: string) => {
    setSelectedReturnId(returnId);
    setReturnDetailOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon
              path={mdiKeyboardReturn}
              size={0.7}
              className="text-primary"
            />
            <span>Đơn trả hàng của bạn</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="py-8 text-center">
              <p className="text-red-500">
                Đã xảy ra lỗi khi tải đơn trả hàng. Vui lòng thử lại sau.
              </p>
            </div>
          ) : !returnsData ||
            !returnsData.data ||
            !returnsData.data.returns ||
            returnsData.data.returns.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Bạn chưa có đơn trả hàng nào.
              </p>
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px] px-3 py-2">
                      Mã trả hàng
                    </TableHead>
                    <TableHead className="px-3 py-2">Ngày tạo</TableHead>
                    <TableHead className="px-3 py-2">Đơn hàng gốc</TableHead>
                    <TableHead className="px-3 py-2">Sản phẩm</TableHead>
                    <TableHead className="text-right px-3 py-2">
                      Số tiền hoàn
                    </TableHead>
                    <TableHead className="px-3 py-2">Trạng thái</TableHead>
                    <TableHead className="text-center px-3 py-2">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returnsData.data.returns.map((returnItem: IReturn) => (
                    <TableRow key={(returnItem as any)?.id}>
                      <TableCell className="font-medium px-3 py-2">
                        {returnItem.code}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        {formatDate(returnItem.createdAt)}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        {typeof returnItem.originalOrder === "string"
                          ? returnItem.originalOrder
                          : returnItem.originalOrder.code}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <div className="flex flex-col gap-1">
                          {returnItem.items
                            .slice(0, 2)
                            .map((item: any, index) => (
                              <div key={index} className="text-xs">
                                {item.product?.name ||
                                  "Sản phẩm không xác định"}{" "}
                                x{item.quantity}
                              </div>
                            ))}
                          {returnItem.items.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{returnItem.items.length - 2} sản phẩm khác
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium px-3 py-2">
                        {formatPrice(returnItem.totalRefund)}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <ReturnStatusBadge status={returnItem.status} />
                      </TableCell>
                      <TableCell className="text-center px-3 py-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleViewReturnDetails((returnItem as any)?.id)
                          }
                          title="Xem chi tiết"
                        >
                          <Icon path={mdiEye} size={0.7} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {returnsData.data.pagination &&
                returnsData.data.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                      Trang {returnsData.data.pagination.currentPage} /{" "}
                      {returnsData.data.pagination.totalPages}
                    </div>
                  </div>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog chi tiết trả hàng */}
      <ReturnDetailDialog
        returnId={selectedReturnId}
        open={returnDetailOpen}
        onOpenChange={setReturnDetailOpen}
        onCancel={() => refetch()}
      />
    </>
  );
};

export default function GeneralManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [activeTab, setActiveTab] = useState("profile");
  const { isAuthenticated, profile, isLoadingProfile } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const userId = profile?.data?.id;
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

  useEffect(() => {
    const updateActiveTabFromHash = () => {
      if (
        typeof window !== "undefined" &&
        window.location.hash === "#account-tabs"
      ) {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get("tab");

        if (
          tabParam &&
          [
            "profile",
            "password",
            "settings",
            "orders",
            "vouchers",
            "returns",
          ].includes(tabParam)
        ) {
          setActiveTab(tabParam);
        } else {
          setActiveTab("profile");
        }
      }
    };
    updateActiveTabFromHash();
    window.addEventListener("hashchange", updateActiveTabFromHash);

    return () => {
      window.removeEventListener("hashchange", updateActiveTabFromHash);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isLoadingProfile) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, isLoadingProfile, navigate]);

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    {
      title: "Thông tin cá nhân",
      icon: mdiAccountEdit,
      value: "profile",
    },
    {
      title: "Đổi mật khẩu",
      icon: mdiLock,
      value: "password",
    },
    {
      title: "Đơn hàng của bạn",
      icon: mdiOrderBoolAscending,
      value: "orders",
    },
    {
      title: "Trả hàng",
      icon: mdiKeyboardReturn,
      value: "returns",
    },
    {
      title: "Mã giảm giá",
      icon: mdiTicketPercentOutline,
      value: "vouchers",
    },
  ];

  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrderDetailOpen(true);
  };

  const handleCreateReturn = (orderId: string) => {
    setCreateReturnOrderId(orderId);
    setCreateReturnOpen(true);
  };

  const isOrderReturnable = (order: IOrder) => {
    // Kiểm tra xem đơn hàng có thể trả hay không
    return (
      order.orderStatus === "HOAN_THANH" &&
      returnableOrdersData?.data?.orders?.some((ro) => ro.id === order.id)
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng";
      case "VNPAY":
        return "Thanh toán qua VNPay";
      case "BANK_TRANSFER":
        return "Chuyển khoản ngân hàng";
      default:
        return method;
    }
  };

  const getPaymentStatusName = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ thanh toán";
      case "PAID":
        return "Đã thanh toán";
      case "FAILED":
        return "Thanh toán thất bại";
      case "REFUNDED":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  return (
    <AccountTabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="container mx-auto py-8 relative">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="!text-maintext hover:!text-maintext"
              >
                Trang chủ
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="!text-maintext hover:!text-maintext" />
            <BreadcrumbItem>
              <BreadcrumbPage className="!text-maintext hover:!text-maintext">
                Quản lý chung
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <motion.div
            className="md:col-span-3"
            initial="hidden"
            animate="visible"
          >
            <Card className="sticky">
              <CardHeader>
                <CardTitle>Quản lý chung</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col" id="account-sidebar-tabs">
                  {tabs.map((tab) => (
                    <motion.div
                      key={tab.value}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a
                        href={`#account-tabs?tab=${tab.value}`}
                        data-value={tab.value}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-muted ${
                          activeTab === tab.value
                            ? "bg-muted text-primary font-medium"
                            : ""
                        }`}
                        onClick={() => {
                          setActiveTab(tab.value);
                          const tabContentElement =
                            document.getElementById("account-tabs");
                          if (tabContentElement) {
                            tabContentElement.scrollIntoView({
                              behavior: "smooth",
                            });
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <Icon
                            path={tab.icon}
                            size={0.7}
                            className={`mr-3 text-maintext ${
                              activeTab === tab.value ? "text-primary" : ""
                            }`}
                          />
                          <span className="text-maintext">{tab.title}</span>
                        </div>
                        {activeTab === tab.value && (
                          <Icon
                            path={mdiChevronRight}
                            size={0.7}
                            className="text-primary"
                          />
                        )}
                      </a>
                    </motion.div>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content */}
          <motion.div
            className="md:col-span-9"
            initial="hidden"
            animate="visible"
          >
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="profile">
                {activeTab === "profile" && <ProfileTab />}
              </TabsContent>
              <TabsContent value="password">
                {activeTab === "password" && <PasswordTab />}
              </TabsContent>
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon
                        path={mdiOrderBoolAscending}
                        size={0.7}
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
                      <div className="py-8 text-center">
                        <p className="text-red-500">
                          Đã xảy ra lỗi khi tải đơn hàng. Vui lòng thử lại sau.
                        </p>
                      </div>
                    ) : !ordersData ||
                      !ordersData.data ||
                      !ordersData.data.orders ||
                      ordersData.data.orders.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground mb-4">
                          Bạn chưa có đơn hàng nào.
                        </p>
                        <Button variant="outline" asChild>
                          <a href="/products">Mua sắm ngay</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table className="min-w-[1200px]">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[120px] px-3 py-2 whitespace-nowrap">
                                Mã đơn hàng
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
                                <TableCell className="font-medium px-3 py-2 whitespace-nowrap text-maintext">
                                  {order.code}
                                </TableCell>
                                <TableCell className="px-3 py-2 whitespace-nowrap text-maintext">
                                  {format(
                                    new Date(order.createdAt),
                                    "dd/MM/yyyy HH:mm",
                                    { locale: vi }
                                  )}
                                </TableCell>
                                <TableCell className="px-3 py-2">
                                  <div className="flex gap-1 flex-wrap">
                                    {order.items
                                      .slice(0, 3)
                                      .map((item, index) => {
                                        const productVariant =
                                          item.productVariant as any;
                                        const product = productVariant?.product;
                                        const imageUrl =
                                          productVariant?.images?.[0]?.imageUrl;

                                        return (
                                          <div key={index} className="relative">
                                            <img
                                              src={
                                                imageUrl ||
                                                "/images/white-image.png"
                                              }
                                              alt={product?.name || "Sản phẩm"}
                                              className="w-12 h-12 object-contain rounded border"
                                              title={
                                                product?.name ||
                                                "Sản phẩm không xác định"
                                              }
                                            />
                                            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                              {item.quantity}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    {order.items.length > 3 && (
                                      <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                                        +{order.items.length - 3}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-medium px-3 py-2 whitespace-nowrap text-maintext">
                                  {formatPrice(
                                    parseFloat(order.total.toString())
                                  )}
                                </TableCell>
                                <TableCell className="px-3 py-2 ">
                                  <OrderStatusBadge
                                    status={order.orderStatus}
                                  />
                                </TableCell>
                                <TableCell className="px-3 py-2 whitespace-nowrap text-maintext">
                                  {getPaymentMethodName(order.paymentMethod)}
                                </TableCell>
                                <TableCell className="px-3 py-2">
                                  <Badge
                                    className={
                                      order.paymentStatus === "PAID"
                                        ? "!bg-emerald-400 !text-white !border-emerald-500 text-nowrap !rounded"
                                        : "!bg-extra text-nowrap text-white px-2 py-1 rounded"
                                    }
                                  >
                                    {getPaymentStatusName(order.paymentStatus)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center px-3 py-2">
                                  <div className="flex items-center justify-start space-x-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        handleViewOrderDetails(order.id)
                                      }
                                      title="Xem chi tiết"
                                    >
                                      <Icon path={mdiEye} size={0.7} />
                                    </Button>
                                    {isOrderReturnable(order) && (
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                          handleCreateReturn(order.id)
                                        }
                                        title="Yêu cầu trả hàng"
                                      >
                                        <Icon
                                          path={mdiKeyboardReturn}
                                          size={0.7}
                                        />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {ordersData.data.pagination &&
                          ordersData.data.pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-2 py-4">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                              >
                                Trang trước
                              </Button>
                              <div className="text-sm text-muted-foreground">
                                Trang {currentPage} /{" "}
                                {ordersData.data.pagination.totalPages}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                  currentPage ===
                                  ordersData.data.pagination.totalPages
                                }
                                onClick={() => setCurrentPage(currentPage + 1)}
                              >
                                Trang sau
                              </Button>
                            </div>
                          )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="returns">
                {activeTab === "returns" && <ReturnsTab />}
              </TabsContent>
              <TabsContent value="vouchers">
                {activeTab === "vouchers" && <VouchersTab />}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Dialog chi tiết đơn hàng */}
      <OrderDetailDialog
        orderId={selectedOrderId}
        open={orderDetailOpen}
        onOpenChange={setOrderDetailOpen}
      />

      {/* Dialog tạo yêu cầu trả hàng */}
      <CreateReturnDialog
        orderId={createReturnOrderId}
        open={createReturnOpen}
        onOpenChange={setCreateReturnOpen}
        onSuccess={() => {
          refetch();
          refetchReturnableOrders();
        }}
      />
    </AccountTabContext.Provider>
  );
}
