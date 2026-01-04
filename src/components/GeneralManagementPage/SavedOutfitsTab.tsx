import React, { useState } from "react";
import { Icon } from "@mdi/react";
import { mdiHanger, mdiEye, mdiDelete, mdiAlertOctagon } from "@mdi/js";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOutfits, useDeleteOutfit, IOutfit } from "@/hooks/outfit";
import { formatPriceVND } from "@/lib/utils";

interface OutfitDetailDialogProps {
  outfit: IOutfit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
}

const OutfitDetailDialog: React.FC<OutfitDetailDialogProps> = ({
  outfit,
  open,
  onOpenChange,
  onDelete,
}) => {
  const deleteOutfitMutation = useDeleteOutfit();

  const handleDelete = () => {
    if (!outfit) return;

    deleteOutfitMutation.mutate(
      { userId: outfit._id.split("-")[0], outfitId: outfit._id },
      {
        onSuccess: () => {
          toast.success("Đã xóa bộ phối đồ thành công");
          onDelete?.();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Đã xảy ra lỗi khi xóa bộ phối đồ");
        },
      }
    );
  };

  if (!open || !outfit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon path={mdiHanger} size={0.8} className="text-primary" />
            {outfit.name}
          </DialogTitle>
          <DialogDescription>
            Ngày lưu:{" "}
            {format(new Date(outfit.timestamp), "dd/MM/yyyy HH:mm", {
              locale: vi,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Thông tin chung */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Thông tin bộ phối đồ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Điểm tương thích:</span>
                <Badge
                  variant="outline"
                  className={
                    outfit.compatibilityScore >= 0.8
                      ? "bg-green-100 text-green-700 border-green-200"
                      : outfit.compatibilityScore >= 0.5
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }
                >
                  {(outfit.compatibilityScore * 100).toFixed(0)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Giới tính:</span>
                <span className="font-medium capitalize">{outfit.gender}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-3">
                <span>Tổng giá trị:</span>
                <span className="text-primary">
                  {formatPriceVND(outfit.totalPrice)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Danh sách sản phẩm */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Sản phẩm trong bộ phối đồ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {outfit.products.map((product, index) => {
                  const salePrice =
                    product.price * (1 - (product.sale || 0) / 100);
                  return (
                    <Card key={index} className="overflow-hidden">
                      <div className="relative aspect-square bg-gray-50">
                        <img
                          src={product.images[0] || "/images/placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {product.sale > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            -{product.sale}%
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <Badge
                          variant="secondary"
                          className="mb-2 text-xs bg-primary/10 text-primary"
                        >
                          {product.category}
                        </Badge>
                        <h4 className="text-sm font-medium line-clamp-2 mb-2">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-primary">
                            {formatPriceVND(salePrice)}
                          </span>
                          {product.sale > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPriceVND(product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteOutfitMutation.isPending}
            className="gap-2"
          >
            {deleteOutfitMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
            ) : (
              <Icon path={mdiDelete} size={0.8} />
            )}
            Xóa bộ phối đồ
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface SavedOutfitsTabProps {
  userId: string;
}

export const SavedOutfitsTab: React.FC<SavedOutfitsTabProps> = ({ userId }) => {
  const {
    data: outfitsData,
    isLoading,
    isError,
    refetch,
  } = useGetOutfits(userId, !!userId);
  const [selectedOutfit, setSelectedOutfit] = useState<IOutfit | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleViewDetails = (outfit: IOutfit) => {
    setSelectedOutfit(outfit);
    setDetailOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon path={mdiHanger} size={0.8} className="text-primary" />
            <span>Bộ phối đồ đã lưu</span>
          </CardTitle>
          <CardDescription>
            Danh sách các bộ phối đồ bạn đã lưu từ hệ thống gợi ý
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="py-8 text-center">
              <Icon
                path={mdiAlertOctagon}
                size={2}
                className="mx-auto text-red-500 mb-4"
              />
              <p className="text-red-500 mb-4">
                Đã xảy ra lỗi khi tải danh sách bộ phối đồ.
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Thử lại
              </Button>
            </div>
          ) : !outfitsData ||
            !outfitsData.data ||
            !outfitsData.data.outfits ||
            outfitsData.data.outfits.length === 0 ? (
            <div className="py-8 text-center">
              <Icon
                path={mdiHanger}
                size={2}
                className="mx-auto text-muted-foreground mb-4"
              />
              <p className="text-muted-foreground mb-4">
                Bạn chưa lưu bộ phối đồ nào.
              </p>
              <Button variant="outline" asChild>
                <a href="/products">Khám phá sản phẩm</a>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Tên bộ phối đồ</TableHead>
                    <TableHead>Ngày lưu</TableHead>
                    <TableHead>Số sản phẩm</TableHead>
                    <TableHead className="text-right">Tổng giá trị</TableHead>
                    <TableHead>Điểm tương thích</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outfitsData.data.outfits.map((outfit: IOutfit) => (
                    <TableRow key={outfit._id}>
                      <TableCell className="font-medium">
                        {outfit.name}
                      </TableCell>
                      <TableCell>{formatDate(outfit.timestamp)}</TableCell>
                      <TableCell>{outfit.products.length} sản phẩm</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPriceVND(outfit.totalPrice)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            outfit.compatibilityScore >= 0.8
                              ? "bg-green-100 text-green-700 border-green-200"
                              : outfit.compatibilityScore >= 0.5
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }
                        >
                          {(outfit.compatibilityScore * 100).toFixed(0)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewDetails(outfit)}
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

      {/* Dialog chi tiết bộ phối đồ */}
      <OutfitDetailDialog
        outfit={selectedOutfit}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDelete={() => refetch()}
      />
    </>
  );
};
