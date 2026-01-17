"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeletePromotion, usePromotions } from "@/hooks/promotion";
import { IPromotionFilter } from "@/interface/request/promotion";
import {
  mdiDeleteCircle,
  mdiFilterMultiple,
  mdiFilterRemove,
  mdiLoading,
  mdiMagnify,
  mdiPencilCircle,
  mdiPlus,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<IPromotionFilter>({
    page: 1,
    limit: 5,
  });
  const [showFilters, setShowFilters] = useState(false);
  const { data, isLoading, isError } = usePromotions(filters);
  const deletePromotion = useDeletePromotion();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
      } else {
        const { search, ...rest } = filters;
        setFilters({ ...rest, page: 1 });
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleFilterChange = (
    key: keyof IPromotionFilter,
    value: string | number | undefined,
  ) => {
    if (value === "") {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters({ ...newFilters, page: 1 });
    } else {
      setFilters({ ...filters, [key]: value, page: 1 });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({ page: 1, limit: 5 });
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      await deletePromotion.mutateAsync(id, {
        onSuccess: () => {
          toast.success("Đã xóa chiến dịch khuyến mãi thành công");
          queryClient.invalidateQueries({ queryKey: ["promotions"] });
          setIsDeleteDialogOpen(false);
        },
      });
    } catch (error) {
      toast.error("Xóa chiến dịch khuyến mãi thất bại");
    }
  };

  const handleChangePage = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const getPromotionStatusBadge = (promotion: any) => {
    const now = new Date();
    const nowUTC = Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
    );

    const startUTC = new Date(promotion.startDate).getTime();
    const endUTC = new Date(promotion.endDate).getTime();

    if (promotion.status === "UNACTIVE") {
      return <Badge variant="destructive">Không hoạt động</Badge>;
    }

    if (promotion.status === "ACTIVE") {
      if (nowUTC < startUTC) {
        return <Badge variant="secondary">Chưa bắt đầu</Badge>;
      }

      if (nowUTC > endUTC) {
        return <Badge variant="outline">Đã kết thúc</Badge>;
      }

      return <Badge variant="default">Đang hoạt động</Badge>;
    }

    return <Badge variant="secondary">Không xác định</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/discounts">
                Quản lý khuyến mãii
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chiến dịch khuyến mãi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center gap-2">
            <div className="relative flex-1 max-w-4xl">
              <Icon
                path={mdiMagnify}
                size={0.8}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700"
              />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên chiến dịch..."
                className="pl-10 pr-4 py-2 w-full border rounded-[6px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              {(showFilters ||
                searchQuery ||
                Object.keys(filters).filter(
                  (k) => k !== "page" && k !== "limit",
                ).length > 0) && (
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={handleClearFilters}
                >
                  <Icon path={mdiFilterRemove} size={0.8} className="mr-2" />
                  Clear bộ lọc
                </Button>
              )}
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Icon path={mdiFilterMultiple} size={0.8} className="mr-2" />
                {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
              </Button>
            </div>
            <a
              href="/admin/discounts/promotions/create"
              className="flex items-center gap-2"
            >
              <Button className="flex items-center gap-2">
                <Icon path={mdiPlus} size={0.8} />
                Thêm chiến dịch khuyến mãi
              </Button>
            </a>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Trạng thái
                    </label>
                    <Select
                      value={filters.status || ""}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "status",
                          value === "all" ? undefined : value,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                        <SelectItem value="INACTIVE">
                          Không hoạt động
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Thời gian bắt đầu
                    </label>
                    <Input
                      type="date"
                      value={filters.startDate || ""}
                      onChange={(e) =>
                        handleFilterChange("startDate", e.target.value)
                      }
                      className="w-full"
                      placeholder="Từ ngày"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Thời gian kết thúc
                    </label>
                    <Input
                      type="date"
                      value={filters.endDate || ""}
                      onChange={(e) =>
                        handleFilterChange("endDate", e.target.value)
                      }
                      className="w-full"
                      placeholder="Đến ngày"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="bg-white rounded-[6px] shadow-sm p-4 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-[6px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-[6px] shadow-sm p-4 text-center">
          <p className="text-red-500">
            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["promotions"] })
            }
          >
            Thử lại
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-[6px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên chiến dịch</TableHead>
                  <TableHead>Giảm giá</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.promotions?.length ? (
                  data.data.promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="px-4 py-4 text-sm">
                        <div>
                          <div className="font-semibold">{promotion.name}</div>
                          {promotion.description && (
                            <div className="text-sm text-gray-700 mt-1 line-clamp-2">
                              {promotion.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-primary">
                            {promotion.discountType === "PERCENTAGE"
                              ? `${promotion.discountValue}%`
                              : new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(Number(promotion.discountValue))}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm">
                        <span className="text-gray-700">
                          {promotion.applyTo === "ALL_PRODUCTS"
                            ? "Tất cả sản phẩm"
                            : `${promotion.productIds?.length || 0} sản phẩm`}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm">
                        <div className="text-sm">
                          <div>{formatDate(promotion.startDate)}</div>
                          <div className="text-gray-700">
                            đến {formatDate(promotion.endDate)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm">
                        {getPromotionStatusBadge(promotion)}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={`/admin/discounts/promotions/edit/${promotion.id}`}
                          >
                            <Button variant="outline" size="icon" title="Sửa">
                              <Icon path={mdiPencilCircle} size={0.8} />
                            </Button>
                          </a>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setPromotionToDelete(promotion.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            title="Xóa"
                          >
                            <Icon path={mdiDeleteCircle} size={0.8} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-700"
                    >
                      Không tìm thấy chiến dịch khuyến mãi nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {data?.data && (data.data.pagination || data.data.page) && (
            <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
              {(() => {
                const currentPage =
                  data.data.pagination?.currentPage || data.data.page || 1;
                const totalPages =
                  data.data.pagination?.totalPages || data.data.pages || 1;
                const totalItems =
                  data.data.pagination?.totalItems || data.data.count || 0;

                return (
                  <>
                    <div className="text-sm text-gray-700 order-2 sm:order-1">
                      Hiển thị{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * filters.limit! + 1}
                      </span>{" "}
                      đến{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * filters.limit!, totalItems)}
                      </span>{" "}
                      trong tổng số{" "}
                      <span className="font-medium">{totalItems}</span> chiến
                      dịch khuyến mãi
                    </div>

                    <div className="flex justify-center order-1 sm:order-2">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              disabled={currentPage === 1}
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1)
                                  handleChangePage(currentPage - 1);
                              }}
                            />
                          </PaginationItem>

                          {(() => {
                            const pages = [];
                            if (totalPages > 0) {
                              pages.push(
                                <PaginationItem key={1}>
                                  <PaginationLink
                                    href="#"
                                    isActive={currentPage === 1}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleChangePage(1);
                                    }}
                                  >
                                    1
                                  </PaginationLink>
                                </PaginationItem>,
                              );
                            }

                            if (currentPage > 3) {
                              pages.push(
                                <PaginationItem key="start-ellipsis">
                                  <PaginationEllipsis />
                                </PaginationItem>,
                              );
                            }

                            for (
                              let i = Math.max(2, currentPage - 1);
                              i <= Math.min(totalPages - 1, currentPage + 1);
                              i++
                            ) {
                              if (i !== 1 && i !== totalPages) {
                                pages.push(
                                  <PaginationItem key={i}>
                                    <PaginationLink
                                      href="#"
                                      isActive={currentPage === i}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleChangePage(i);
                                      }}
                                    >
                                      {i}
                                    </PaginationLink>
                                  </PaginationItem>,
                                );
                              }
                            }

                            if (currentPage < totalPages - 2) {
                              pages.push(
                                <PaginationItem key="end-ellipsis">
                                  <PaginationEllipsis />
                                </PaginationItem>,
                              );
                            }

                            if (totalPages > 1) {
                              pages.push(
                                <PaginationItem key={totalPages}>
                                  <PaginationLink
                                    href="#"
                                    isActive={currentPage === totalPages}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleChangePage(totalPages);
                                    }}
                                  >
                                    {totalPages}
                                  </PaginationLink>
                                </PaginationItem>,
                              );
                            }
                            return pages;
                          })()}

                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              disabled={currentPage === totalPages}
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages)
                                  handleChangePage(currentPage + 1);
                              }}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Xác nhận xóa dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa chiến dịch khuyến mãi</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Bạn có chắc chắn muốn xóa chiến dịch khuyến mãi này không? Hành động
            này không thể hoàn tác.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() =>
                promotionToDelete && handleDeletePromotion(promotionToDelete)
              }
              disabled={deletePromotion.isPending}
            >
              {deletePromotion.isPending ? (
                <>
                  <Icon
                    path={mdiLoading}
                    size={0.8}
                    className="mr-2 animate-spin"
                  />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
