"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/useUserContext";
import { useAvailableVouchersForUser } from "@/hooks/voucher";
import { IVoucher } from "@/interface/response/voucher";
import { formatDate } from "@/lib/utils";
import { formatPrice } from "@/utils/formatters";
import { mdiAlertOctagon, mdiContentCopy, mdiTicket } from "@mdi/js";
import { Icon } from "@mdi/react";
import { toast } from "react-toastify";

export const VouchersTab = () => {
  const { user } = useUser();
  const userId = user?.id;
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
    return formatPrice(discountValue);
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
            <Icon path={mdiAlertOctagon} size={0.8} className="text-primary" />
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
            <Icon path={mdiTicket} size={0.8} />
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
            <Icon path={mdiTicket} size={0.8} className="text-primary" />
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
                      variant="INACTIVE"
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
                            toast.success(`Đã sao chép mã: ${voucher.code}`);
                          })
                          .catch((err) => {
                            toast.error("Không thể sao chép mã giảm giá.");
                          });
                      }}
                    >
                      <Icon path={mdiContentCopy} size={0.8} />
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
