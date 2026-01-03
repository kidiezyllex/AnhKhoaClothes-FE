'use client';

import React, { useState, useMemo } from 'react';
import { useSizes, useDeleteSize, useCreateSize } from '@/hooks/attributes';
import type { ISizeFilter, ISizeCreate } from '@/interface/request/attributes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icon } from '@mdi/react';
import { mdiPlus, mdiDeleteCircle } from '@mdi/js';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getSizeLabel, getSizeValue, SIZE_MAPPINGS } from '@/utils/sizeMapping';

export default function SizesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<ISizeFilter>({});
    const { data, isLoading, isError } = useSizes(filters);
    const deleteSizeMutation = useDeleteSize();
    const queryClient = useQueryClient();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const filteredSizes = useMemo(() => {
        if (!data?.data || !searchQuery.trim()) return data?.data;

        const query = searchQuery.toLowerCase().trim();
        const numericQuery = Number(query);
        return data.data.filter(size => {
            const sizeLabel = getSizeLabel(size.value);
            // Search by both numeric value and size label
            return (
                !isNaN(numericQuery) ? size.value === numericQuery : String(size.value).includes(query)
            ) || sizeLabel.toLowerCase().includes(query);
        });
    }, [data?.data, searchQuery]);

    const handleDeleteSize = async (sizeId: string) => {
        
        if (!sizeId) {
            console.error('sizeId is undefined, null or empty:', sizeId);
            toast.error('Lỗi: Không tìm thấy ID kích cỡ');
            return;
        }
        
        try {
            await deleteSizeMutation.mutateAsync(sizeId, {
                onSuccess: () => {
                    toast.success('Đã xóa kích cỡ thành công');
                    queryClient.invalidateQueries({ queryKey: ['sizes'] });
                },
                onError: (error) => {
                    console.error('Delete error:', error);
                    toast.error('Xóa kích cỡ thất bại');
                }
            });
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Xóa kích cỡ thất bại');
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
                            <BreadcrumbPage>Kích cỡ</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Icon path={mdiPlus} size={0.7} />
                        Thêm kích cỡ mới
                    </Button>
                </DialogTrigger>
                <CreateSizeDialog
                    isOpen={isCreateDialogOpen}
                    onClose={() => setIsCreateDialogOpen(false)}
                />
            </Dialog>

            {isLoading ? (
                <div className="bg-white rounded-[6px] shadow-sm overflow-visible">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">ID</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Kích cỡ</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Giá trị số</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Trạng thái</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Ngày cập nhật</TableHead>
                                    <TableHead className="px-4 py-4 text-right text-sm font-medium text-maintext">Thao tác</TableHead>
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
                                            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
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
                                    placeholder="Tìm kiếm theo kích cỡ (XS, S, M, L, XL, XXL) hoặc giá trị số..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">ID</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Kích cỡ</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Giá trị số</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Trạng thái</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Ngày cập nhật</TableHead>
                                    <TableHead className="px-4 py-4 text-right text-sm font-medium text-maintext">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSizes?.length ? (
                                    filteredSizes.map((size, index) => (
                                        <TableRow key={(size as any)?.id || `size-${index}`} className="hover:bg-gray-50">
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                                                {(size as any)?.id}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-12 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                                        <span className="text-sm font-bold">{getSizeLabel(size.value)}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                                                {size.value}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${size.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {size.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                                                {formatDate(size.updatedAt)}
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
                                        <TableCell colSpan={6} className="text-center py-8 text-maintext">
                                            Không có kích cỡ nào được tìm thấy.
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

interface DeleteSizeDialogProps {
    size: any;
    onDelete: () => void;
    isDeleting: boolean;
}

function DeleteSizeDialog({ size, onDelete, isDeleting }: DeleteSizeDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        onDelete();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    disabled={isDeleting}
                    title="Xóa"
                >
                    <Icon path={mdiDeleteCircle} size={0.7} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa kích cỡ</DialogTitle>
                </DialogHeader>
                <p>Bạn có chắc chắn muốn xóa kích cỡ <strong>{getSizeLabel(size.value)}</strong> không?</p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isDeleting}>Hủy</Button>
                    </DialogClose>
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Đang xóa...' : 'Xóa'}
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
        value: 0,
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
    });

    const [errors, setErrors] = useState({
        value: ''
    });

    const handleSizeChange = (sizeLabel: string) => {
        const sizeValue = getSizeValue(sizeLabel);
        if (sizeValue !== null) {
            setFormData((prev) => ({ ...prev, value: sizeValue }));
            if (errors.value) {
                setErrors((prev) => ({ ...prev, value: '' }));
            }
        }
    };

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({ ...prev, status: value as 'ACTIVE' | 'INACTIVE' }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (formData.value <= 0) {
            newErrors.value = 'Vui lòng chọn kích cỡ';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await createSize.mutateAsync(
                formData,
                {
                    onSuccess: () => {
                        toast.success('Thêm kích cỡ thành công');
                        queryClient.invalidateQueries({ queryKey: ['sizes'] });
                        setFormData({
                            value: 0,
                            status: 'ACTIVE'
                        });
                        onClose();
                    },
                    onError: (error) => {
                        if (error.message === "Duplicate entry. This record already exists.") {
                            toast.error('Thêm kích cỡ thất bại: Kích cỡ này đã tồn tại.');
                        } else {
                            toast.error('Thêm kích cỡ thất bại');
                        }
                    }
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    // Get the currently selected size label
    const getCurrentSizeLabel = () => {
        if (formData.value > 0) {
            return getSizeLabel(formData.value);
        }
        return '';
    };

    return (
        <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>Thêm kích cỡ mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="create-size">Kích cỡ</Label>
                    <Select value={getCurrentSizeLabel()} onValueChange={handleSizeChange}>
                        <SelectTrigger id="create-size" className={errors.value ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Chọn kích cỡ" />
                        </SelectTrigger>
                        <SelectContent>
                            {SIZE_MAPPINGS.map(size => (
                                <SelectItem key={size.value} value={size.label}>
                                    {size.label} (Giá trị: {size.value})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.value && <p className="text-red-500 text-sm">{errors.value}</p>}
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
                    <Button type="submit" disabled={createSize.isPending}>
                        {createSize.isPending ? 'Đang xử lý...' : 'Thêm kích cỡ'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
} 