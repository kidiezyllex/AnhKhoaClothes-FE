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
  useColorDetail,
  useColors,
  useCreateColor,
  useDeleteColor,
  useUpdateColor,
} from "@/hooks/attributes";
import { IColorFilter } from "@/interface/request/attributes";
import {
  mdiDeleteCircle,
  mdiMagnify,
  mdiPencilCircle,
  mdiPlus,
  mdiRefresh,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { useQueryClient } from "@tanstack/react-query";
import namer from "color-namer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ColorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<IColorFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const { data, isLoading, isError } = useColors(filters);
  const deleteColor = useDeleteColor();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [colorToEdit, setColorToEdit] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredColors = useMemo(() => {
    let colors = data?.data?.colors || [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      colors = colors.filter(
        (color) =>
          color.name.toLowerCase().includes(query) ||
          color.hex_code.toLowerCase().includes(query),
      );
    }

    // Status filtering removed - API doesn't return status field

    return colors;
  }, [data?.data?.colors, searchQuery]);

  const handleFilterChange = (key: keyof IColorFilter, value: any) => {
    if (value === "all" || value === "") {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  const handleDeleteColor = async (id: string) => {
    if (!id) {
      toast.error("Lỗi: ID màu sắc không hợp lệ");
      return;
    }

    try {
      await deleteColor.mutateAsync(id, {
        onSuccess: () => {
          toast.success("Đã xóa màu sắc thành công");
          queryClient.invalidateQueries({ queryKey: ["colors"] });
        },
      });
    } catch (error) {
      toast.error("Xóa màu sắc thất bại");
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
              <BreadcrumbPage>Màu sắc</BreadcrumbPage>
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
                placeholder="Tìm kiếm theo tên hoặc mã màu sắc..."
                className="pl-10 pr-4 py-2 w-full border rounded-[6px]"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Icon path={mdiPlus} size={0.8} />
                    Thêm màu sắc mới
                  </Button>
                </DialogTrigger>
                <CreateColorDialog
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
                  <TableHead>Màu sắc</TableHead>
                  <TableHead>Mã màu</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Skeleton className="h-6 w-6 rounded-full mr-2" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-[80px]" />
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
              queryClient.invalidateQueries({ queryKey: ["colors"] })
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
                  <TableHead>Màu sắc</TableHead>
                  <TableHead>Mã màu</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredColors?.length ? (
                  filteredColors
                    .slice((currentPage - 1) * perPage, currentPage * perPage)
                    .map((color, index) => {
                      return (
                        <TableRow
                          key={(color as any)?.id || `color-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {(currentPage - 1) * perPage + index + 1}
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className="w-6 h-6 rounded-full mr-2 border border-gray-200"
                                style={{ backgroundColor: color.hex_code }}
                              />
                              <div className="text-sm font-medium text-gray-700">
                                {color.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {color.hex_code}
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {/* Edit and Delete dialogs remain the same */}
                              <Dialog
                                open={
                                  isEditDialogOpen &&
                                  colorToEdit === (color as any)?.id
                                }
                                onOpenChange={(open) => {
                                  setIsEditDialogOpen(open);
                                  if (!open) setColorToEdit(null);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    title="Sửa"
                                    onClick={() => {
                                      setColorToEdit((color as any)?.id);
                                      setIsEditDialogOpen(true);
                                    }}
                                  >
                                    <Icon path={mdiPencilCircle} size={0.8} />
                                  </Button>
                                </DialogTrigger>
                                {colorToEdit === (color as any)?.id && (
                                  <EditColorDialog
                                    colorId={(color as any)?.id}
                                    isOpen={isEditDialogOpen}
                                    onClose={() => {
                                      setIsEditDialogOpen(false);
                                      setColorToEdit(null);
                                    }}
                                  />
                                )}
                              </Dialog>
                              <Dialog
                                open={
                                  isDeleteDialogOpen &&
                                  colorToDelete === (color as any)?.id
                                }
                                onOpenChange={(open) => {
                                  setIsDeleteDialogOpen(open);
                                  if (!open) setColorToDelete(null);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                      setColorToDelete((color as any)?.id);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                    title="Xóa"
                                  >
                                    <Icon path={mdiDeleteCircle} size={0.8} />
                                  </Button>
                                </DialogTrigger>
                                {colorToDelete === (color as any)?.id && (
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Xác nhận xóa màu sắc
                                      </DialogTitle>
                                    </DialogHeader>
                                    <p>
                                      Bạn có chắc chắn muốn xóa màu sắc này
                                      không?
                                    </p>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setIsDeleteDialogOpen(false);
                                            setColorToDelete(null);
                                          }}
                                        >
                                          Hủy
                                        </Button>
                                      </DialogClose>
                                      <Button
                                        variant="destructive"
                                        onClick={() => {
                                          handleDeleteColor((color as any)?.id);
                                          setIsDeleteDialogOpen(false);
                                          setColorToDelete(null);
                                        }}
                                      >
                                        Xóa
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                )}
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-700"
                    >
                      Không tìm thấy màu sắc nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredColors?.length > perPage && (
            <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
              <div className="text-sm text-gray-700 order-2 sm:order-1">
                Hiển thị{" "}
                <span className="font-medium">
                  {(currentPage - 1) * perPage + 1}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(currentPage * perPage, filteredColors.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{filteredColors.length}</span> màu
                sắc
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
                        filteredColors.length / perPage,
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
                          Math.ceil(filteredColors.length / perPage)
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            currentPage <
                            Math.ceil(filteredColors.length / perPage)
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

interface EditColorDialogProps {
  colorId: string;
  isOpen: boolean;
  onClose: () => void;
}

function EditColorDialog({ colorId, isOpen, onClose }: EditColorDialogProps) {
  const queryClient = useQueryClient();
  const { data: colorData, isLoading, isError } = useColorDetail(colorId);
  const updateColor = useUpdateColor();

  const [formData, setFormData] = useState({
    name: "",
    hex_code: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [errors, setErrors] = useState({
    name: "",
    hex_code: "",
  });

  useEffect(() => {
    if (colorData?.data) {
      setFormData({
        name: colorData.data.name,
        hex_code: colorData.data.hex_code,
        status: colorData.data.status || "ACTIVE",
      });
    }
  }, [colorData]);

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
      newErrors.name = "Tên màu sắc không được để trống";
      isValid = false;
    }

    if (!formData.hex_code.trim()) {
      newErrors.hex_code = "Mã màu không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const generateRandomColor = () => {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    const colorName = namer(randomColor).pantone[0].name;

    setFormData((prev) => ({
      ...prev,
      name: colorName,
      hex_code: randomColor,
    }));

    setErrors({
      name: "",
      hex_code: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await updateColor.mutateAsync(
        {
          colorId: colorId,
          payload: formData,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật màu sắc thành công");
            queryClient.invalidateQueries({ queryKey: ["color", colorId] });
            queryClient.invalidateQueries({ queryKey: ["colors"] });
            onClose();
          },
          onError: (error) => {
            toast.error("Cập nhật màu sắc thất bại: " + error.message);
          },
        },
      );
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật màu sắc");
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

  if (isError || !colorData) {
    return (
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Lỗi</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-red-500 mb-4">
            Đã xảy ra lỗi khi tải dữ liệu màu sắc.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["color", colorId] })
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
        <DialogTitle>Chỉnh sửa màu sắc: {colorData.data.name}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên màu sắc</Label>
          <Input
            id="name"
            name="name"
            placeholder="Nhập tên màu sắc"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="hex_code">Mã màu</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="hex_code"
              name="hex_code"
              type="text"
              placeholder="#000000"
              value={formData.hex_code}
              onChange={handleInputChange}
              className={errors.hex_code ? "border-red-500" : ""}
            />
            <div
              className="w-10 h-10 rounded-[6px] border border-gray-200"
              style={{ backgroundColor: formData.hex_code }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={generateRandomColor}
          >
            <Icon path={mdiRefresh} size={0.8} className="mr-2" />
            Random Color
          </Button>
          {errors.hex_code && (
            <p className="text-red-500 text-sm">{errors.hex_code}</p>
          )}
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
          <Button type="submit" disabled={updateColor.isPending}>
            {updateColor.isPending ? "Đang xử lý..." : "Cập nhật màu sắc"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

interface CreateColorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateColorDialog({ isOpen, onClose }: CreateColorDialogProps) {
  const queryClient = useQueryClient();
  const createColor = useCreateColor();

  const [formData, setFormData] = useState({
    name: "",
    hex_code: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [errors, setErrors] = useState({
    name: "",
    hex_code: "",
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
      newErrors.name = "Tên màu sắc không được để trống";
      isValid = false;
    }

    if (!formData.hex_code.trim()) {
      newErrors.hex_code = "Mã màu không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const generateRandomColor = () => {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    const colorName = namer(randomColor).pantone[0].name;

    setFormData((prev) => ({
      ...prev,
      name: colorName,
      hex_code: randomColor,
    }));

    // Clear any errors
    setErrors({
      name: "",
      hex_code: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createColor.mutateAsync(formData, {
        onSuccess: () => {
          toast.success("Thêm màu sắc thành công");
          queryClient.invalidateQueries({ queryKey: ["colors"] });
          // Reset form
          setFormData({
            name: "",
            hex_code: "",
            status: "ACTIVE",
          });
          onClose();
        },
        onError: (error) => {
          if (
            error.message === "Duplicate entry. This record already exists."
          ) {
          } else {
            toast.error("Thêm màu sắc thất bại: Màu sắc đã tồn tại");
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
        <DialogTitle>Thêm màu sắc mới</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="create-name">Tên màu sắc</Label>
          <Input
            id="create-name"
            name="name"
            placeholder="Nhập tên màu sắc"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="create-hex_code">Mã màu</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="create-hex_code"
              name="hex_code"
              type="text"
              placeholder="#000000"
              value={formData.hex_code}
              onChange={handleInputChange}
              className={errors.hex_code ? "border-red-500" : ""}
            />
            <div
              className="w-10 h-10 rounded-[6px] border border-gray-200"
              style={{ backgroundColor: formData.hex_code }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={generateRandomColor}
          >
            <Icon path={mdiRefresh} size={0.8} className="mr-2" />
            Random Color
          </Button>
          {errors.hex_code && (
            <p className="text-red-500 text-sm">{errors.hex_code}</p>
          )}
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
          <Button type="submit" disabled={createColor.isPending}>
            {createColor.isPending ? "Đang xử lý..." : "Thêm màu sắc"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
