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
import {
  useCancelMyReturn,
  useMyReturnDetail,
  useMyReturns,
} from "@/hooks/return";
import { IReturn } from "@/interface/response/return";
import { formatPrice } from "@/utils/formatters";
import { mdiCancel, mdiEye, mdiKeyboardReturn } from "@mdi/js";
import { Icon } from "@mdi/react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import React, { useState } from "react";
import { toast } from "react-toastify";

// --- Components ---

export const ReturnStatusBadge = ({ status }: { status: string }) => {
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
    className: "bg-gray-400 text-gray-700 border-gray-500",
  };

  return (
    <Badge className={`${config.className} rounded-[4px] font-normal`}>
      {config.label}
    </Badge>
  );
};

export const ReturnDetailDialog: React.FC<{
  returnId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
}> = ({ returnId, open, onOpenChange, onCancel }) => {
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
      onError: () => toast.error("Đã xảy ra lỗi khi hủy yêu cầu"),
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
          <div className="p-8 text-center text-red-500">
            Đã xảy ra lỗi khi tải thông tin trả hàng.
          </div>
        ) : (
          returnData?.data && (
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
                          : `#${returnData.data.originalOrder.id
                              .slice(-6)
                              .toUpperCase()}`}
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Sản phẩm trả hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {returnData.data.items.map((item: any, idx: number) => {
                        const productVariant = item.productVariant as any;
                        const product = productVariant?.product || item.product;
                        const imageUrl =
                          productVariant?.images?.[0]?.imageUrl ||
                          product?.variants?.[0]?.images?.[0];

                        return (
                          <div
                            key={idx}
                            className="flex items-center space-x-3 p-3 border rounded-lg"
                          >
                            <img
                              src={imageUrl || "/images/white-image.png"}
                              alt={product?.name}
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
                              {productVariant?.color && (
                                <p className="text-xs text-muted-foreground">
                                  Màu: {productVariant.color.name}
                                </p>
                              )}
                              {productVariant?.size && (
                                <p className="text-xs text-muted-foreground">
                                  Size: {productVariant.size.value}
                                </p>
                              )}
                              {item.reason && (
                                <p className="text-sm text-muted-foreground italic">
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
                      <Icon path={mdiCancel} size={0.8} />
                    )}
                    Hủy yêu cầu
                  </Button>
                )}
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

// --- Main Tab Component ---

export const ReturnsTab = () => {
  const { data: returnsData, isLoading, isError, refetch } = useMyReturns();
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null);
  const [returnDetailOpen, setReturnDetailOpen] = useState(false);

  const handleViewReturnDetails = (id: string) => {
    setSelectedReturnId(id);
    setReturnDetailOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon
              path={mdiKeyboardReturn}
              size={0.8}
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
            <div className="py-8 text-center text-red-500">
              Đã xảy ra lỗi khi tải đơn trả hàng. Vui lòng thử lại sau.
            </div>
          ) : !returnsData?.data?.returns?.length ? (
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
                        {format(new Date(returnItem.createdAt), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        {typeof returnItem.originalOrder === "string"
                          ? returnItem.originalOrder
                          : `#${returnItem.originalOrder.id
                              .slice(-6)
                              .toUpperCase()}`}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <div className="flex flex-col gap-1">
                          {returnItem.items
                            .slice(0, 2)
                            .map((item: any, idx) => (
                              <div key={idx} className="text-xs">
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
                          <Icon path={mdiEye} size={0.8} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ReturnDetailDialog
        returnId={selectedReturnId}
        open={returnDetailOpen}
        onOpenChange={setReturnDetailOpen}
        onCancel={() => refetch()}
      />
    </>
  );
};
