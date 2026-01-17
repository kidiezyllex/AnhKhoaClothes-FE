"use client";

import { useEffect, useMemo, useState } from "react";

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
import {
  useCategories,
  useCategoryDetail,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/attributes";
import { ICategoryFilter } from "@/interface/request/attributes";
import { mdiDeleteCircle, mdiMagnify, mdiPencilCircle, mdiPlus } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ICategoryFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const [showFilters, setShowFilters] = useState(false);
  const { data, isLoading, isError } = useCategories(filters);
  const deleteCategory = useDeleteCategory();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    const categories = Array.isArray(data?.data)
      ? data?.data
      : (data?.data as any)?.categories || [];

    // Chuẩn hóa dữ liệu: nếu là string[] thì chuyển thành object[]
    let normalizedCategories = categories.map((cat: any) =>
      typeof cat === "string"
        ? {
            id: cat,
            name: cat,
            status: "ACTIVE",
            updatedAt: new Date().toISOString(),
          }
        : cat,
    );

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      normalizedCategories = normalizedCategories.filter((category: any) =>
        category.name.toLowerCase().includes(query),
      );
    }

    if (filters.status && (filters.status as string) !== "all") {
      normalizedCategories = normalizedCategories.filter(
        (category: any) => category.status === filters.status,
      );
    }

    return normalizedCategories;
  }, [data?.data, searchQuery, filters.status]);

  const handleFilterChange = (key: keyof ICategoryFilter, value: any) => {
    if (value === "all" || value === "") {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id, {
        onSuccess: () => {
          toast.success("Đã xóa danh mục thành công");
          queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
      });
    } catch (error) {
      toast.error("Xóa danh mục thất bại");
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
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
              <BreadcrumbPage>Danh mục</BreadcrumbPage>
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
                placeholder="Tìm kiếm theo tên danh mục..."
                className="pl-10 pr-4 py-2 w-full border rounded-[6px]"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => {
                  handleFilterChange("status", value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Icon path={mdiPlus} size={0.8} />
                    Thêm danh mục mới
                  </Button>
                </DialogTrigger>
                <CreateCategoryDialog
                  isOpen={isCreateDialogOpen}
                  onClose={() => setIsCreateDialogOpen(false)}
                />
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="bg-white rounded-[6px] shadow-sm overflow-visible">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-[250px]" />
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Skeleton className="h-8 w-8 rounded-[6px]" />
                        <Skeleton className="h-8 w-8 rounded-[6px]" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
              queryClient.invalidateQueries({ queryKey: ["categories"] })
            }
          >
            Thử lại
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-[6px] shadow-sm overflow-visible">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories?.length ? (
                  filteredCategories
                    .slice((currentPage - 1) * perPage, currentPage * perPage)
                    .map((category: any, index: number) => (
                      <TableRow
                        key={category.id || index}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {(currentPage - 1) * perPage + index + 1}
                        </TableCell>
                        <TableCell className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700">
                            {category.name}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Dialog
                              open={
                                isEditDialogOpen &&
                                categoryToEdit === (category as any)?.id
                              }
                              onOpenChange={(open) => {
                                setIsEditDialogOpen(open);
                                if (!open) setCategoryToEdit(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    setCategoryToEdit((category as any)?.id);
                                    setIsEditDialogOpen(true);
                                  }}
                                  title="Sửa"
                                >
                                  <Icon path={mdiPencilCircle} size={0.8} />
                                </Button>
                              </DialogTrigger>
                              {categoryToEdit === (category as any)?.id && (
                                <EditCategoryDialog
                                  categoryId={(category as any)?.id}
                                  isOpen={isEditDialogOpen}
                                  onClose={() => {
                                    setIsEditDialogOpen(false);
                                    setCategoryToEdit(null);
                                  }}
                                />
                              )}
                            </Dialog>

                            <Dialog
                              open={
                                isDeleteDialogOpen &&
                                categoryToDelete === (category as any)?.id
                              }
                              onOpenChange={(open) => {
                                setIsDeleteDialogOpen(open);
                                if (!open) setCategoryToDelete(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    setCategoryToDelete((category as any)?.id);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  title="Xóa"
                                >
                                  <Icon path={mdiDeleteCircle} size={0.8} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Xác nhận xóa danh mục
                                  </DialogTitle>
                                </DialogHeader>
                                <p>
                                  Bạn có chắc chắn muốn xóa danh mục này không?
                                </p>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setIsDeleteDialogOpen(false);
                                        setCategoryToDelete(null);
                                      }}
                                    >
                                      Hủy
                                    </Button>
                                  </DialogClose>
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      if (categoryToDelete) {
                                        handleDeleteCategory(categoryToDelete);
                                        setIsDeleteDialogOpen(false);
                                        setCategoryToDelete(null);
                                      }
                                    }}
                                  >
                                    Xóa
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="px-4 py-8 text-center text-gray-700"
                    >
                      Không tìm thấy danh mục nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredCategories.length > perPage && (
            <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
              <div className="text-sm text-gray-700 order-2 sm:order-1">
                Hiển thị{" "}
                <span className="font-medium">
                  {(currentPage - 1) * perPage + 1}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(currentPage * perPage, filteredCategories.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{filteredCategories.length}</span>{" "}
                danh mục
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
                        filteredCategories.length / perPage,
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
                          Math.ceil(filteredCategories.length / perPage)
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            currentPage <
                            Math.ceil(filteredCategories.length / perPage)
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

// Edit Category Dialog Component
interface EditCategoryDialogProps {
  categoryId: string;
  isOpen: boolean;
  onClose: () => void;
}

function EditCategoryDialog({
  categoryId,
  isOpen,
  onClose,
}: EditCategoryDialogProps) {
  const queryClient = useQueryClient();
  const {
    data: categoryData,
    isLoading,
    isError,
  } = useCategoryDetail(categoryId);
  const updateCategory = useUpdateCategory();

  const [formData, setFormData] = useState({
    name: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  useEffect(() => {
    if (categoryData?.data) {
      setFormData({
        name: categoryData.data.name,
        status: categoryData.data.status,
      });
    }
  }, [categoryData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
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
      newErrors.name = "Tên danh mục không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await updateCategory.mutateAsync(
        {
          categoryId: categoryId,
          payload: formData,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật danh mục thành công");
            queryClient.invalidateQueries({
              queryKey: ["category", categoryId],
            });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            onClose();
          },
          onError: (error) => {
            toast.error("Cập nhật danh mục thất bại: " + error.message);
          },
        },
      );
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật danh mục");
    }
  };

  if (isLoading) {
    return (
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            <Skeleton className="h-8 w-[200px]" />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex justify-end space-x-4">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[150px]" />
          </div>
        </div>
      </DialogContent>
    );
  }

  if (isError || !categoryData) {
    return (
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Lỗi</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-red-500 mb-4">
            Đã xảy ra lỗi khi tải dữ liệu danh mục.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["category", categoryId],
                })
              }
            >
              Thử lại
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle>Chỉnh sửa danh mục: {categoryData.data.name}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên danh mục</Label>
          <Input
            id="name"
            name="name"
            placeholder="Nhập tên danh mục"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái</Label>
          <Select value={formData.status} onValueChange={handleStatusChange}>
            <SelectTrigger id="status">
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
          <Button type="submit" disabled={updateCategory.isPending}>
            {updateCategory.isPending ? "Đang xử lý..." : "Cập nhật danh mục"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// Create Category Dialog Component
interface CreateCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateCategoryDialog({ isOpen, onClose }: CreateCategoryDialogProps) {
  const queryClient = useQueryClient();
  const createCategory = useCreateCategory();

  const [formData, setFormData] = useState({
    name: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
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
      newErrors.name = "Tên danh mục không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createCategory.mutateAsync(formData, {
        onSuccess: () => {
          toast.success("Thêm danh mục thành công");
          queryClient.invalidateQueries({ queryKey: ["categories"] });
          setFormData({
            name: "",
            status: "ACTIVE",
          });
          onClose();
        },
        onError: (error) => {
          if (
            error.message === "Duplicate entry. This record already exists."
          ) {
            toast.error("Thêm danh mục thất bại: Danh mục đã tồn tại");
          } else {
            toast.error("Thêm danh mục thất bại: " + error.message);
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
        <DialogTitle>Thêm danh mục mới</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="create-name">Tên danh mục</Label>
          <Input
            id="create-name"
            name="name"
            placeholder="Nhập tên danh mục"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
          <Button type="submit" disabled={createCategory.isPending}>
            {createCategory.isPending ? "Đang xử lý..." : "Thêm danh mục"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
