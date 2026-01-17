import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useVouchers } from "@/hooks/voucher";
import { cn } from "@/lib/utils";
import { mdiChevronLeft, mdiContentCopy, mdiTag } from "@mdi/js";
import { Icon } from "@mdi/react";
import { motion } from "framer-motion";
import React from "react";
import { toast } from "react-toastify";

interface VouchersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVoucherSelect: (code: string) => void;
  formatCurrency: (amount: number) => string;
}

const VouchersDialog: React.FC<VouchersDialogProps> = ({
  open,
  onOpenChange,
  onVoucherSelect,
  formatCurrency,
}) => {
  const {
    data: vouchersData,
    isLoading,
    isError,
  } = useVouchers({ page: 1, limit: 100, status: "ACTIVE" });
  const handleCopyCode = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success(`Đã sao chép mã: ${code}`);
        onVoucherSelect(code);
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error("Không thể sao chép mã.");
      });
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const isVoucherExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isVoucherOutOfStock = (voucher: any) => {
    return voucher.quantity - voucher.usedCount <= 0;
  };

  const isVoucherDisabled = (voucher: any) => {
    return isVoucherExpired(voucher.endDate) || isVoucherOutOfStock(voucher);
  };

  // Map API fields to component expected fields
  const mapVoucherData = (voucher: any) => {
    const discountValue = voucher.value ? Number(voucher.value) : 0;
    return {
      ...voucher,
      discountType: voucher.type, // Map 'type' to 'discountType'
      discountValue: isNaN(discountValue) ? 0 : discountValue, // Handle possible NaN
      maxValue: voucher.maxDiscount ? Number(voucher.maxDiscount) : null, // Convert string to number
      minOrderValue: voucher.minOrderValue ? Number(voucher.minOrderValue) : 0, // Convert string to number
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] flex flex-col ">
        <DialogHeader className="pb-6 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <Icon path={mdiTag} size={1} className="text-primary" />
            <span>Danh sách mã giảm giá</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="space-y-4 py-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <div className="grid grid-cols-7 gap-4">
                    {[...Array(7)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 border-b border-border last:border-b-0"
                  >
                    <div className="grid grid-cols-7 gap-4 items-center">
                      {[...Array(7)].map((_, j) => (
                        <Skeleton key={j} className="h-6 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <Icon path={mdiTag} size={2} className="text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Lỗi khi tải dữ liệu
              </h3>
              <p className="text-gray-700 text-center max-w-md">
                Không thể tải danh sách mã giảm giá. Vui lòng kiểm tra kết nối
                mạng và thử lại.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            </div>
          ) : !vouchersData?.data?.vouchers ||
            vouchersData.data.vouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                <Icon path={mdiTag} size={2} className="text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Chưa có mã giảm giá
              </h3>
              <p className="text-gray-700 text-center max-w-md">
                Hiện tại không có mã giảm giá nào đang hoạt động trong hệ thống.
              </p>
            </div>
          ) : (
            <div className="py-0">
              {/* Header Stats */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold text-primary text-lg">
                      {vouchersData.data.vouchers.length}
                    </span>{" "}
                    mã giảm giá
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold text-green-600 text-lg">
                      {
                        vouchersData.data.vouchers.filter(
                          (v: any) => !isVoucherDisabled(mapVoucherData(v)),
                        ).length
                      }
                    </span>{" "}
                    khả dụng
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold text-red-600 text-lg">
                      {
                        vouchersData.data.vouchers.filter((v: any) =>
                          isVoucherDisabled(mapVoucherData(v)),
                        ).length
                      }
                    </span>{" "}
                    không khả dụng
                  </div>
                </div>
              </div>

              {/* Enhanced Table with shadcn/ui components */}
              <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-white">
                <ScrollArea className="max-h-[50vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Mã giảm giá</TableHead>
                        <TableHead className="w-[200px]">
                          Tên chương trình
                        </TableHead>
                        <TableHead className="text-center w-[80px]">
                          Loại
                        </TableHead>
                        <TableHead className="text-right w-[120px]">
                          Giá trị
                        </TableHead>
                        <TableHead className="text-right w-[150px]">
                          Đơn tối thiểu
                        </TableHead>
                        <TableHead className="text-center w-[80px]">
                          Còn lại
                        </TableHead>
                        <TableHead className="text-center w-[100px]">
                          Hết hạn
                        </TableHead>
                        <TableHead className="text-center w-[150px]">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vouchersData.data.vouchers.map(
                        (voucherRaw: any, index: number) => {
                          const voucher = mapVoucherData(voucherRaw);
                          const isExpired = isVoucherExpired(voucher.endDate);
                          const isOutOfStock = isVoucherOutOfStock(voucher);
                          const isDisabled = isVoucherDisabled(voucher);
                          const remainingQuantity =
                            voucher.quantity - voucher.usedCount;

                          return (
                            <motion.tr
                              key={voucher.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.05,
                              }}
                              className={cn(
                                "transition-all duration-200 hover:bg-gray-50/50",
                                isDisabled && "bg-gray-50/30 opacity-75",
                              )}
                            >
                              {/* Voucher Code */}
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn(
                                      "h-2 w-2 rounded-full",
                                      isDisabled
                                        ? "bg-red-400"
                                        : "bg-green-400",
                                    )}
                                  />
                                  <div>
                                    <div
                                      className={cn(
                                        "font-mono font-bold text-sm tracking-wider",
                                        isDisabled
                                          ? "text-gray-700"
                                          : "text-primary",
                                      )}
                                    >
                                      {voucher.code}
                                    </div>
                                    <div className="text-xs text-gray-700">
                                      ID: {String(voucher.id).slice(-6)}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>

                              {/* Program Name */}
                              <TableCell>
                                <div
                                  className={cn(
                                    "font-medium text-sm leading-tight",
                                    isDisabled
                                      ? "text-gray-700"
                                      : "text-gray-700",
                                  )}
                                >
                                  {voucher.name}
                                </div>
                                <div className="text-xs text-gray-700 mt-1">
                                  Đã dùng: {voucher.usedCount}/
                                  {voucher.quantity}
                                </div>
                              </TableCell>

                              {/* Type */}
                              <TableCell className="text-center">
                                <Badge
                                  variant={
                                    voucher.discountType === "PERCENTAGE"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={cn(
                                    "text-xs",
                                    voucher.discountType === "PERCENTAGE"
                                      ? "bg-blue-100 text-blue-700 border-blue-200"
                                      : "bg-purple-100 text-purple-700 border-purple-200",
                                  )}
                                >
                                  {voucher.discountType === "PERCENTAGE"
                                    ? "%"
                                    : "VNĐ"}
                                </Badge>
                              </TableCell>

                              {/* Value */}
                              <TableCell className="text-right">
                                <div
                                  className={cn(
                                    "font-bold text-sm",
                                    isDisabled
                                      ? "text-gray-700"
                                      : "text-primary",
                                  )}
                                >
                                  {voucher.discountType === "PERCENTAGE"
                                    ? `${voucher.discountValue}%`
                                    : formatCurrency(voucher.discountValue)}
                                </div>
                                {voucher.discountType === "PERCENTAGE" &&
                                  voucher.maxValue && (
                                    <div className="text-xs text-gray-700">
                                      Max: {formatCurrency(voucher.maxValue)}
                                    </div>
                                  )}
                              </TableCell>

                              {/* Min Order */}
                              <TableCell className="text-right">
                                <div className="font-semibold text-sm text-gray-700">
                                  {formatCurrency(voucher.minOrderValue)}
                                </div>
                              </TableCell>

                              {/* Remaining */}
                              <TableCell className="text-center">
                                <Badge
                                  variant={
                                    remainingQuantity <= 5
                                      ? "destructive"
                                      : remainingQuantity <= 20
                                        ? "outline"
                                        : "secondary"
                                  }
                                  className={cn(
                                    "text-xs font-semibold",
                                    remainingQuantity <= 5
                                      ? "bg-red-100 text-red-700 border-red-200"
                                      : remainingQuantity <= 20
                                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                        : "bg-green-100 text-green-700 border-green-200",
                                  )}
                                >
                                  {remainingQuantity}
                                </Badge>
                              </TableCell>

                              {/* Expiry */}
                              <TableCell className="text-center">
                                <div
                                  className={cn(
                                    "text-xs font-medium",
                                    isExpired
                                      ? "text-red-600"
                                      : "text-gray-700",
                                  )}
                                >
                                  {formatDate(voucher.endDate)}
                                </div>
                                {isExpired && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs mt-1"
                                  >
                                    Hết hạn
                                  </Badge>
                                )}
                              </TableCell>

                              {/* Actions */}
                              <TableCell className="text-center">
                                <motion.div
                                  whileHover={
                                    !isDisabled ? { scale: 1.05 } : {}
                                  }
                                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                                >
                                  <Button
                                    size="sm"
                                    className={cn(
                                      "px-4 py-2 text-xs font-semibold transition-all duration-200",
                                      isDisabled
                                        ? "bg-gray-200 text-gray-700 cursor-not-allowed hover:bg-gray-200"
                                        : "bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white shadow-sm hover:shadow-sm",
                                    )}
                                    onClick={() =>
                                      !isDisabled &&
                                      handleCopyCode(voucher.code)
                                    }
                                    disabled={isDisabled}
                                  >
                                    <Icon
                                      path={mdiContentCopy}
                                      size={0.6}
                                      className="mr-1.5"
                                    />
                                    {isExpired
                                      ? "Hết hạn"
                                      : isOutOfStock
                                        ? "Hết lượt"
                                        : "Chọn mã"}
                                  </Button>
                                </motion.div>

                                {isDisabled && (
                                  <div className="text-xs text-red-500 mt-1 font-medium">
                                    {isExpired
                                      ? "Đã hết hạn"
                                      : "Hết lượt sử dụng"}
                                  </div>
                                )}
                              </TableCell>
                            </motion.tr>
                          );
                        },
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>

              {/* Footer Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-border">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <span>Khả dụng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-400" />
                      <span>Không khả dụng</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-700">
                    Cập nhật lần cuối: {new Date().toLocaleTimeString("vi-VN")}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-8 py-2 font-medium"
          >
            <Icon path={mdiChevronLeft} size={0.8} className="mr-2" />
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VouchersDialog;
