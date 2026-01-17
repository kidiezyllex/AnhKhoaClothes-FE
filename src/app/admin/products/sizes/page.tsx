"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreateSize, useDeleteSize, useSizes } from "@/hooks/attributes";
import type { ISizeFilter } from "@/interface/request/attributes";
import { mdiDeleteCircle, mdiPlus } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function SizesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ISizeFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const { data, isLoading, isError } = useSizes(filters);
  const deleteSizeMutation = useDeleteSize();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredSizes = useMemo(() => {
    let sizes = data?.data?.sizes || [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      sizes = sizes.filter(
        (size) =>
          size.name.toLowerCase().includes(query) ||
          size.code.toLowerCase().includes(query),
      );
    }

    return sizes;
  }, [data?.data?.sizes, searchQuery]);

  const handleDeleteSize = async (sizeId: string) => {
    if (!sizeId) {
      console.error("sizeId is undefined, null or empty:", sizeId);
      toast.error("Lỗi: Không tìm thấy ID kích cỡ");
      return;
    }

    try {
      await deleteSizeMutation.mutateAsync(sizeId, {
        onSuccess: () => {
          toast.success("Đã xóa kích cỡ thành công");
          queryClient.invalidateQueries({ queryKey: ["sizes"] });
        },
        onError: (error) => {
          console.error("Delete error:", error);
          toast.error("Xóa kích cỡ thất bại");
        },
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Xóa kích cỡ thất bại");
    }
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
              <BreadcrumbLink href="/admin/products">
                Quản lý sản phẩm
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Kích cỡ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-[6px] shadow-sm overflow-visible">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Tên kích cỡ</TableHead>
                  <TableHead>Mã kích cỡ</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[6px] shadow-sm overflow-visible">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm theo tên hoặc mã kích cỡ..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Icon path={mdiPlus} size={0.8} />
                    Thêm kích cỡ mới
                  </Button>
                </DialogTrigger>
                <CreateSizeDialog
                  isOpen={isCreateDialogOpen}
                  onClose={() => setIsCreateDialogOpen(false)}
                />
              </Dialog>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Tên kích cỡ</TableHead>
                  <TableHead>Mã kích cỡ</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSizes?.length ? (
                  filteredSizes
                    .slice((currentPage - 1) * perPage, currentPage * perPage)
                    .map((size, index) => (
                      <TableRow
                        key={(size as any)?.id || `size-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {(currentPage - 1) * perPage + index + 1}
                        </TableCell>
                        <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {size.name}
                        </TableCell>
                        <TableCell className="px-4 py-4 whitespace-nowrap">
                          <div className="h-8 w-12 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                            <span className="text-sm font-bold">
                              {size.code}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <DeleteSizeDialog
                              size={size}
                              onDelete={() => {
                                handleDeleteSize((size as any)?.id);
                              }}
                              isDeleting={deleteSizeMutation.isPending}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-700"
                    >
                      Không có kích cỡ nào được tìm thấy.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredSizes?.length > perPage && (
            <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
              <div className="text-sm text-gray-700 order-2 sm:order-1">
                Hiển thị{" "}
                <span className="font-medium">
                  {(currentPage - 1) * perPage + 1}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(currentPage * perPage, filteredSizes.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{filteredSizes.length}</span> kích
                cỡ
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
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                      />
                    </PaginationItem>

                    {(() => {
                      const totalPages = Math.ceil(
                        filteredSizes.length / perPage,
                      );
                      const pages = [];
                      if (totalPages > 0) {
                        pages.push(
                          <PaginationItem key={1}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === 1}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(1);
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
                                  setCurrentPage(i);
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
                                setCurrentPage(totalPages);
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
                        disabled={
                          currentPage ===
                          Math.ceil(filteredSizes.length / perPage)
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            currentPage <
                            Math.ceil(filteredSizes.length / perPage)
                          )
                            setCurrentPage(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface DeleteSizeDialogProps {
  size: any;
  onDelete: () => void;
  isDeleting: boolean;
}

function DeleteSizeDialog({
  size,
  onDelete,
  isDeleting,
}: DeleteSizeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" disabled={isDeleting} title="Xóa">
          <Icon path={mdiDeleteCircle} size={0.8} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa kích cỡ</DialogTitle>
        </DialogHeader>
        <p>
          Bạn có chắc chắn muốn xóa kích cỡ{" "}
          <strong>
            {size.name} ({size.code})
          </strong>{" "}
          không?
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Hủy
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CreateSizeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateSizeDialog({ isOpen, onClose }: CreateSizeDialogProps) {
  const queryClient = useQueryClient();
  const createSize = useCreateSize();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [errors, setErrors] = useState({
    name: "",
    code: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as "ACTIVE" | "INACTIVE",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Tên kích cỡ không được để trống";
      isValid = false;
    }

    if (!formData.code.trim()) {
      newErrors.code = "Mã kích cỡ không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createSize.mutateAsync(formData, {
        onSuccess: () => {
          toast.success("Thêm kích cỡ thành công");
          queryClient.invalidateQueries({ queryKey: ["sizes"] });
          setFormData({
            name: "",
            code: "",
            status: "ACTIVE",
          });
          onClose();
        },
        onError: (error) => {
          if (
            error.message === "Duplicate entry. This record already exists."
          ) {
            toast.error("Thêm kích cỡ thất bại: Kích cỡ này đã tồn tại.");
          } else {
            toast.error("Thêm kích cỡ thất bại");
          }
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle>Thêm kích cỡ mới</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="create-name">Tên kích cỡ</Label>
          <Input
            id="create-name"
            name="name"
            placeholder="Nhập tên kích cỡ (ví dụ: Extra Large)"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="create-code">Mã kích cỡ</Label>
          <Input
            id="create-code"
            name="code"
            placeholder="Nhập mã kích cỡ (ví dụ: XL)"
            value={formData.code}
            onChange={handleInputChange}
            className={errors.code ? "border-red-500" : ""}
          />
          {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="create-status">Trạng thái</Label>
          <Select value={formData.status} onValueChange={handleStatusChange}>
            <SelectTrigger id="create-status">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={createSize.isPending}>
            {createSize.isPending ? "Đang xử lý..." : "Thêm kích cỡ"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
