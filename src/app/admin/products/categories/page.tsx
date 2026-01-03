'use client';

import { useState, useEffect, useMemo } from 'react';
 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiPencilCircle, mdiDeleteCircle, mdiFilterOutline } from '@mdi/js';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCategories, useDeleteCategory, useCategoryDetail, useUpdateCategory, useCreateCategory } from '@/hooks/attributes';
import { ICategoryFilter, ICategoryCreate, ICategoryUpdate } from '@/interface/request/attributes';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ICategoryFilter>({});
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
    if (!data?.data || !searchQuery.trim()) return data?.data;

    const query = searchQuery.toLowerCase().trim();
    return data.data.filter(category =>
      category.name.toLowerCase().includes(query)
    );
  }, [data?.data, searchQuery]);

  const handleFilterChange = (key: keyof ICategoryFilter, value: any) => {
    if (value === 'all' || value === '') {
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
          toast.success('Đã xóa danh mục thành công');
          queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
      });
    } catch (error) {
      toast.error('Xóa danh mục thất bại');
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-4">
      <div className='flex justify-between items-start'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">Quản lý sản phẩm</BreadcrumbLink>
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
                size={0.7}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext"
              />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên danh mục..."
                className="pl-10 pr-4 py-2 w-full border rounded-[6px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='flex items-center gap-2'>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => handleFilterChange('status', value)}
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
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Icon path={mdiPlus} size={0.7} />
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
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">ID</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Tên danh mục</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Trạng thái</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Ngày cập nhật</TableHead>
                  <TableHead className="px-4 py-4 text-right text-sm font-medium text-maintext">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-[160px]" />
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-6 w-[100px] rounded-full" />
                    </TableCell>
                    <TableCell className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-[100px]" />
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
          <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['categories'] })}
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
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">ID</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Tên danh mục</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Trạng thái</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Ngày cập nhật</TableHead>
                  <TableHead className="px-4 py-4 text-right text-sm font-medium text-maintext">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories?.length ? (
                  filteredCategories.map((category) => (
                    <TableRow key={(category as any)?.id} className="hover:bg-gray-50">
                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                        {(category as any)?.id}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-maintext">{category.name}</div>
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${category.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {category.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                        {formatDate(category.updatedAt)}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Dialog open={isEditDialogOpen && categoryToEdit === (category as any)?.id} onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (!open) setCategoryToEdit(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                title="Sửa"
                                onClick={() => {
                                  setCategoryToEdit((category as any)?.id);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Icon path={mdiPencilCircle} size={0.7} />
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
                          <Dialog open={isDeleteDialogOpen && categoryToDelete === (category as any)?.id} onOpenChange={setIsDeleteDialogOpen}>
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
                                <Icon path={mdiDeleteCircle} size={0.7} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
                              </DialogHeader>
                              <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
                                </DialogClose>
                                <Button variant="destructive" onClick={() => {
                                  if (categoryToDelete) {
                                    handleDeleteCategory(categoryToDelete);
                                    setIsDeleteDialogOpen(false);
                                  }
                                }}>Xóa</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="px-4 py-8 text-center text-maintext">
                      Không tìm thấy danh mục nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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

function EditCategoryDialog({ categoryId, isOpen, onClose }: EditCategoryDialogProps) {
  const queryClient = useQueryClient();
  const { data: categoryData, isLoading, isError } = useCategoryDetail(categoryId);
  const updateCategory = useUpdateCategory();

  const [formData, setFormData] = useState({
    name: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const [errors, setErrors] = useState({
    name: ''
  });

  useEffect(() => {
    if (categoryData?.data) {
      setFormData({
        name: categoryData.data.name,
        status: categoryData.data.status
      });
    }
  }, [categoryData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as 'ACTIVE' | 'INACTIVE' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục không được để trống';
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
          payload: formData
        },
        {
          onSuccess: () => {
            toast.success('Cập nhật danh mục thành công');
            queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            onClose();
          },
          onError: (error) => {
            toast.error('Cập nhật danh mục thất bại: ' + error.message);
          }
        }
      );
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật danh mục');
    }
  };

  if (isLoading) {
    return (
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle><Skeleton className="h-8 w-[200px]" /></DialogTitle>
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
          <p className="text-red-500 mb-4">Đã xảy ra lỗi khi tải dữ liệu danh mục.</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['category', categoryId] })}>
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
            className={errors.name ? 'border-red-500' : ''}
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
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={updateCategory.isPending}>
            {updateCategory.isPending ? 'Đang xử lý...' : 'Cập nhật danh mục'}
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
    name: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const [errors, setErrors] = useState({
    name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as 'ACTIVE' | 'INACTIVE' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục không được để trống';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createCategory.mutateAsync(
        formData,
        {
          onSuccess: () => {
            toast.success('Thêm danh mục thành công');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setFormData({
              name: '',
              status: 'ACTIVE'
            });
            onClose();
          },
          onError: (error) => {
            if (error.message === "Duplicate entry. This record already exists.") {
            } else {
              toast.error('Thêm danh mục thất bại: Danh mục đã tồn tại');
            }
          }
        }
      );
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
            className={errors.name ? 'border-red-500' : ''}
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
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={createCategory.isPending}>
            {createCategory.isPending ? 'Đang xử lý...' : 'Thêm danh mục'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
} 