import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/useUserContext";
import { useToast } from "@/hooks/useToast";
import {
  useAvailableVouchersForUser,
  useValidateVoucher,
} from "@/hooks/voucher";
import { IVoucher } from "@/interface/response/voucher";
import { checkImageUrl } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";
import {
  formatCurrency,
  formatDate,
  formatDiscountValue,
  formatPrice,
} from "@/utils/formatters";
import {
  mdiCheck,
  mdiClose,
  mdiContentCopy,
  mdiDelete,
  mdiMinus,
  mdiPlus,
  mdiTicket,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VouchersListDialog = ({
  open,
  onOpenChange,
  onSelectVoucher,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectVoucher: (code: string) => void;
}) => {
  const { user } = useUser();
  const userId = user?.id;
  const {
    data: vouchersData,
    isLoading,
    isError,
  } = useAvailableVouchersForUser(userId || "", {});

  const handleCopyCode = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success(`Đã sao chép mã: ${code}`);
        onSelectVoucher(code);
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error("Không thể sao chép mã.");
      });
  };

  const vouchers = vouchersData?.data?.vouchers?.map((voucher: any) => {
    const discountValue = voucher.value ? Number(voucher.value) : 0;
    return {
      ...voucher,
      discountType: voucher.type,
      discountValue: isNaN(discountValue) ? 0 : discountValue,
      maxDiscount: voucher.maxDiscount ? Number(voucher.maxDiscount) : null,
      minOrderValue: voucher.minOrderValue ? Number(voucher.minOrderValue) : 0,
    };
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon path={mdiTicket} size={0.8} className="text-primary" />
            Danh sách mã giảm giá
          </DialogTitle>
          <DialogDescription>
            Chọn mã giảm giá bạn muốn áp dụng cho đơn hàng
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2 py-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : isError ? (
            <p className="text-red-500 text-center py-4">
              Lỗi khi tải danh sách mã giảm giá.
            </p>
          ) : !vouchers || vouchers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Bạn không có mã giảm giá nào khả dụng.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
              {vouchers.map((voucher: IVoucher) => {
                const isExpired = new Date(voucher.endDate) < new Date();
                const isInactive = voucher.status === "INACTIVE";
                const isOutOfStock = voucher.quantity - voucher.usedCount <= 0;
                const isDisabled = isExpired || isInactive || isOutOfStock;

                return (
                  <div
                    key={voucher.id}
                    className={`relative flex flex-col overflow-hidden border rounded-lg p-4 transition-all hover:shadow-sm ${
                      isDisabled
                        ? "bg-muted/30 border-dashed opacity-60"
                        : "bg-card border-primary/20 hover:border-primary/50"
                    }`}
                  >
                    {isDisabled && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge variant="destructive" className="text-sm">
                          {isExpired
                            ? "Đã hết hạn"
                            : isInactive
                              ? "Ngừng hoạt động"
                              : "Hết lượt"}
                        </Badge>
                      </div>
                    )}

                    <div className="space-y-3 flex flex-col flex-1">
                      <div>
                        <h4 className="font-bold text-primary">
                          {voucher.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Mã:{" "}
                          <span className="font-mono bg-primary/10 px-1 rounded">
                            {voucher.code}
                          </span>
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Giá trị giảm:
                          </span>
                          <span className="font-bold text-primary text-lg">
                            {formatDiscountValue(
                              voucher.discountType,
                              voucher.discountValue,
                            )}
                          </span>
                        </div>

                        {voucher.discountType === "PERCENTAGE" &&
                          voucher.maxDiscount && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Tối đa:
                              </span>
                              <span className="text-sm">
                                {formatCurrency(voucher.maxDiscount)}
                              </span>
                            </div>
                          )}

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Đơn tối thiểu:
                          </span>
                          <span className="text-sm">
                            {formatCurrency(voucher.minOrderValue || 0)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Hết hạn:
                          </span>
                          <span>{formatDate(voucher.endDate)}</span>
                        </div>

                        {voucher.quantity < Infinity && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Còn lại:
                            </span>
                            <span>{voucher.quantity - voucher.usedCount}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end items-end h-full flex-1 flex-col ">
                        <Button
                          variant={isDisabled ? "outline" : "default"}
                          className="w-full gap-2"
                          onClick={() => handleCopyCode(voucher.code)}
                          disabled={isDisabled}
                        >
                          <Icon path={mdiContentCopy} size={0.8} />
                          {isDisabled ? "Không thể sử dụng" : "Chọn mã này"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const CartSheet: React.FC<CartSheetProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { showToast } = useToast();
  const { user } = useUser();
  const userId = user?.id;
  const {
    items,
    removeFromCart,
    updateQuantity,
    appliedVoucher,
    voucherDiscount,
    setAppliedVoucher,
    removeVoucher,
    subtotal: finalSubtotal,
    tax: finalTax,
    shipping: finalShipping,
    total: finalTotal,
  } = useCartStore();
  const [voucher, setVoucher] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showVouchersDialog, setShowVouchersDialog] = React.useState(false);
  const [quantityInputs, setQuantityInputs] = React.useState<{
    [key: string]: string;
  }>({});

  const validateVoucherMutation = useValidateVoucher();

  React.useEffect(() => {
    const newInputs: { [key: string]: string } = {};
    items.forEach((item) => {
      if (!quantityInputs[item.id]) {
        newInputs[item.id] = item.quantity.toString();
      }
    });
    if (Object.keys(newInputs).length > 0) {
      setQuantityInputs((prev) => ({ ...prev, ...newInputs }));
    }
  }, [items]);

  const handleQuantityInputChange = (id: string, value: string) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    // Allow empty string for user typing
    if (value === "") {
      setQuantityInputs((prev) => ({ ...prev, [id]: value }));
      return;
    }

    const newQuantity = parseInt(value) || 0;

    // Immediate validation feedback
    if (newQuantity < 0) {
      showToast({
        title: "Lỗi",
        message: "Số lượng không thể âm",
        type: "error",
      });
      setQuantityInputs((prev) => ({
        ...prev,
        [id]: item.quantity.toString(),
      }));
      return;
    }

    if (item.stock && newQuantity > item.stock) {
      showToast({
        title: "Lỗi",
        message: `Số lượng không thể vượt quá tồn kho (${item.stock})`,
        type: "error",
      });
      setQuantityInputs((prev) => ({ ...prev, [id]: item.stock!.toString() }));
      return;
    }

    setQuantityInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleQuantityInputBlur = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    const inputValue = quantityInputs[id];
    const newQuantity = parseInt(inputValue) || 0;

    if (newQuantity <= 0) {
      showToast({
        title: "Lỗi",
        message: "Số lượng phải lớn hơn 0",
        type: "error",
      });
      setQuantityInputs((prev) => ({
        ...prev,
        [id]: item.quantity.toString(),
      }));
      return;
    }

    if (item.stock && newQuantity > item.stock) {
      showToast({
        title: "Lỗi",
        message: `Số lượng không thể vượt quá tồn kho (${item.stock})`,
        type: "error",
      });
      setQuantityInputs((prev) => ({ ...prev, [id]: item.stock!.toString() }));
      return;
    }

    updateQuantity(id, newQuantity);
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = item.quantity + delta;

    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    if (item.stock && newQuantity > item.stock) {
      showToast({
        title: "Lỗi",
        message: `Số lượng không thể vượt quá tồn kho (${item.stock})`,
        type: "error",
      });
      return;
    }

    updateQuantity(id, newQuantity);
    setQuantityInputs((prev) => ({ ...prev, [id]: newQuantity.toString() }));
  };

  const handleApplyVoucher = async () => {
    if (!userId) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng đăng nhập để sử dụng mã giảm giá",
        type: "error",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const result = await validateVoucherMutation.mutateAsync({
        code: voucher,
        orderValue: finalSubtotal,
      });

      if (result.success && result.data.voucher) {
        const voucherData = result.data.voucher;
        setAppliedVoucher({
          code: voucherData.code,
          discount: result.data.discountValue,
          voucherId: voucherData.id,
          discountType: voucherData.discountType,
          discountValue: voucherData.discountValue,
          maxDiscount: voucherData.maxDiscount,
        });
        setVoucher("");
        showToast({
          title: "Thành công",
          message: `Áp dụng mã giảm giá ${voucherData.code} thành công`,
          type: "success",
        });
      } else {
        showToast({
          title: "Lỗi",
          message: result.message || "Mã giảm giá không hợp lệ",
          type: "error",
        });
      }
    } catch (error: any) {
      showToast({
        title: "Lỗi",
        message: error.message || "Không thể kiểm tra mã giảm giá",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveVoucher = () => {
    removeVoucher();
    showToast({
      title: "Thành công",
      message: "Đã xóa mã giảm giá",
      type: "success",
    });
  };

  const handleSelectVoucher = (code: string) => {
    setVoucher(code);
  };

  const handleCheckout = async () => {
    try {
      if (items.length === 0) {
        showToast({
          title: "Lỗi",
          message: "Giỏ hàng trống",
          type: "error",
        });
        return;
      }
      toast.info("Đang chuyển đến trang thanh toán");
      navigate("/checkout/shipping");
      onOpenChange(false);
    } catch (error) {
      console.error("Error during checkout:", error);
      showToast({
        title: "Lỗi",
        message: "Đã có lỗi xảy ra khi xử lý đơn hàng",
        type: "error",
      });
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          className="w-full sm:max-w-2xl flex flex-col text-gray-700 p-4 pr-3"
          side="right"
        >
          <SheetHeader className="border-b pb-4">
            <SheetTitle>Giỏ hàng của bạn ({items.length})</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-muted-foreground">
                Giỏ hàng của bạn đang trống
              </p>
              <Button onClick={() => onOpenChange(false)} className="mt-4">
                Tiếp tục mua sắm
              </Button>
            </div>
          ) : (
            <ScrollArea className="flex-1 my-4 pr-2">
              <>
                <div className="space-y-4 pr-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-24 w-24 bg-muted rounded overflow-hidden">
                        <img
                          src={checkImageUrl(item.image)}
                          alt={item.name}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between  mb-2">
                          <h4 className="font-medium line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive text-sm text-red-error"
                          >
                            <Icon path={mdiDelete} size={0.8} />
                          </button>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center justify-between mb-2">
                          {item.stock !== undefined && (
                            <span
                              className={`ml-2 text-sm px-2 py-0.5 rounded-full ${
                                item.stock > 10
                                  ? "bg-green-100 text-green-700"
                                  : item.stock > 0
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              Tồn kho: {item.stock}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded">
                            <button
                              className="px-2 py-1 text-sm hover:bg-muted transition-colors"
                              onClick={() => handleQuantityChange(item.id, -1)}
                            >
                              <Icon path={mdiMinus} size={0.8} />
                            </button>
                            <Input
                              type="number"
                              min="1"
                              max={item.stock}
                              value={quantityInputs[item.id] || item.quantity}
                              onChange={(e) =>
                                handleQuantityInputChange(
                                  item.id,
                                  e.target.value,
                                )
                              }
                              onBlur={() => handleQuantityInputBlur(item.id)}
                              className={`w-16 h-8 text-center border-0 focus:ring-0 text-sm ${
                                item.stock && item.quantity >= item.stock
                                  ? "bg-[#EAEBF2] text-green-800"
                                  : ""
                              }`}
                              title={
                                item.stock
                                  ? `Tồn kho: ${item.stock}`
                                  : undefined
                              }
                            />
                            <button
                              className="px-2 py-1 text-sm hover:bg-muted transition-colors"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              disabled={
                                item.stock ? item.quantity >= item.stock : false
                              }
                            >
                              <Icon path={mdiPlus} size={0.8} />
                            </button>
                          </div>
                          <div>
                            {item.hasDiscount && item.originalPrice && (
                              <div className="text-right">
                                <span className="text-sm line-through text-muted-foreground block">
                                  {formatPrice(item.originalPrice)}
                                </span>
                                <span className="font-medium text-green-600">
                                  {formatPrice(item.price)}
                                </span>
                                {item.discountPercent && (
                                  <span className="text-sm text-green-600 ml-1">
                                    (-{item.discountPercent}%)
                                  </span>
                                )}
                              </div>
                            )}
                            {!item.hasDiscount && (
                              <span className="font-medium">
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4 mt-4">
                  {/* Voucher Section */}
                  <div className="space-y-2">
                    <AnimatePresence mode="wait">
                      {appliedVoucher ? (
                        <motion.div
                          key="applied-voucher"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="flex items-center justify-between p-3 border border-green-200 bg-[#EAEBF2] rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              path={mdiCheck}
                              size={0.8}
                              className="text-green-600"
                            />
                            <div>
                              <div className="font-medium text-sm text-green-800">
                                {appliedVoucher.code}
                              </div>
                              <div className="text-sm text-green-600">
                                Giảm {formatPrice(voucherDiscount)}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleRemoveVoucher}
                            className="h-9 w-9 p-0 rounded-full text-green-600 hover:bg-green-100"
                          >
                            <Icon path={mdiClose} size={0.8} />
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="voucher-input"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Mã giảm giá"
                              className="flex-1"
                              value={voucher}
                              onChange={(e) => setVoucher(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleApplyVoucher();
                                }
                              }}
                            />
                            <Button
                              variant="default"
                              onClick={handleApplyVoucher}
                              disabled={isProcessing || !voucher.trim()}
                              className="px-4"
                            >
                              {isProcessing ? "Đang kiểm tra..." : "Áp dụng"}
                            </Button>
                          </div>
                          <Button
                            variant="link"
                            className="text-sm text-primary p-0 h-auto"
                            onClick={() => setShowVouchersDialog(true)}
                          >
                            Xem danh sách mã giảm giá
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm font-semibold">
                        Tạm tính
                      </span>
                      <span>{formatPrice(finalSubtotal)}</span>
                    </div>

                    {/* Hiển thị tổng tiết kiệm từ khuyến mãi sản phẩm */}
                    {(() => {
                      const totalSavings = items.reduce((total, item) => {
                        if (item.hasDiscount && item.originalPrice) {
                          return (
                            total +
                            (item.originalPrice - item.price) * item.quantity
                          );
                        }
                        return total;
                      }, 0);

                      if (totalSavings > 0) {
                        return (
                          <div className="flex justify-between text-green-600">
                            <span className="text-sm font-semibold">
                              Tiết kiệm từ khuyến mãi
                            </span>
                            <span>-{formatPrice(totalSavings)}</span>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Hiển thị giảm giá từ voucher */}
                    {voucherDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="text-sm font-semibold">
                          Giảm giá voucher
                        </span>
                        <span>-{formatPrice(voucherDiscount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm font-semibold">
                        Thuế VAT (5%)
                      </span>
                      <span>{formatPrice(finalTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm font-semibold">
                        Phí vận chuyển
                        {finalShipping === 0 && (
                          <span className="text-green-600 ml-1">
                            (Miễn phí)
                          </span>
                        )}
                      </span>
                      <span>{formatPrice(finalShipping)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span className="text-sm font-semibold">Tổng</span>
                      <span className="text-base font-semibold">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>

                  <SheetFooter className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        onOpenChange(false);
                        if (!pathname.includes("products")) {
                          navigate("/products");
                        }
                      }}
                    >
                      Tiếp tục mua hàng
                    </Button>
                    <Button
                      className="w-full"
                      onClick={handleCheckout}
                      disabled={isProcessing || items.length === 0}
                    >
                      {isProcessing ? "Đang xử lý..." : "Thanh toán"}
                    </Button>
                  </SheetFooter>
                </div>
              </>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      {/* Vouchers List Dialog */}
      <VouchersListDialog
        open={showVouchersDialog}
        onOpenChange={setShowVouchersDialog}
        onSelectVoucher={handleSelectVoucher}
      />
    </>
  );
};

export default CartSheet;
