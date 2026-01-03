'use client';

import { useState, useEffect, useMemo } from 'react';
 
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiPencilCircle, mdiDeleteCircle, mdiRefresh } from '@mdi/js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useColors, useDeleteColor, useColorDetail, useUpdateColor, useCreateColor } from '@/hooks/attributes';
import { IColorFilter} from '@/interface/request/attributes';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import namer from 'color-namer';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ColorsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<IColorFilter>({});
    const { data, isLoading, isError } = useColors(filters);
    const deleteColor = useDeleteColor();
    const queryClient = useQueryClient();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [colorToDelete, setColorToDelete] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [colorToEdit, setColorToEdit] = useState<string | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const filteredColors = useMemo(() => {
        if (!data?.data || !searchQuery.trim()) return data?.data;

        const query = searchQuery.toLowerCase().trim();
        return data.data.filter(color =>
            color.name.toLowerCase().includes(query) ||
            color.code.toLowerCase().includes(query)
        );
    }, [data?.data, searchQuery]);

    const handleFilterChange = (key: keyof IColorFilter, value: any) => {
        if (value === 'all' || value === '') {
            const newFilters = { ...filters };
            delete newFilters[key];
            setFilters(newFilters);
        } else {
            setFilters({ ...filters, [key]: value });
        }
    };

    const handleDeleteColor = async (id: string) => {
        if (!id) {
            toast.error('Lỗi: ID màu sắc không hợp lệ');
            return;
        }
        
        try {
            await deleteColor.mutateAsync(id, {
                onSuccess: () => {
                    toast.success('Đã xóa màu sắc thành công');
                    queryClient.invalidateQueries({ queryKey: ['colors'] });
                },
            });
        } catch (error) {
            toast.error('Xóa màu sắc thất bại');
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
                            <BreadcrumbPage>Màu sắc</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

            </div>

            <Card className="mb-4">
                <CardContent className="py-4">
                    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center gap-2 gap-2">
                        <div className="relative flex-1 max-w-4xl">
                            <Icon
                                path={mdiMagnify}
                                size={0.7}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext"
                            />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm theo tên hoặc mã màu sắc..."
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
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">ID</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Màu sắc</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Mã màu</TableHead>
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
                                            <div className="flex items-center">
                                                <Skeleton className="h-6 w-6 rounded-full mr-2" />
                                                <Skeleton className="h-4 w-[100px]" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-4 whitespace-nowrap">
                                            <Skeleton className="h-4 w-[80px]" />
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
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['colors'] })}
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
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Màu sắc</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Mã màu</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Trạng thái</TableHead>
                                    <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Ngày cập nhật</TableHead>
                                    <TableHead className="px-4 py-4 text-right text-sm font-medium text-maintext">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredColors?.length ? (
                                    filteredColors.map((color, index) => {
                                        return (
                                        <TableRow key={(color as any)?.id || `color-${index}`} className="hover:bg-gray-50">
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                                                {(color as any)?.id}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-6 h-6 rounded-full mr-2 border border-gray-200"
                                                        style={{ backgroundColor: color.code }}
                                                    />
                                                    <div className="text-sm font-medium text-maintext">{color.name}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                                                {color.code}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${color.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {color.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-maintext">
                                                {formatDate(color.updatedAt)}
                                            </TableCell>
                                            <TableCell className="px-4 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Dialog open={isEditDialogOpen && colorToEdit === (color as any)?.id} onOpenChange={(open) => {
                                                        setIsEditDialogOpen(open);
                                                        if (!open) setColorToEdit(null);
                                                    }}>
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
                                                                <Icon path={mdiPencilCircle} size={0.7} />
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
                                                    <Dialog open={isDeleteDialogOpen && colorToDelete === (color as any)?.id} onOpenChange={(open) => {
                                                        setIsDeleteDialogOpen(open);
                                                        if (!open) setColorToDelete(null);
                                                    }}>
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
                                                                <Icon path={mdiDeleteCircle} size={0.7} />
                                                            </Button>
                                                        </DialogTrigger>
                                                        {colorToDelete === (color as any)?.id && (
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Xác nhận xóa màu sắc</DialogTitle>
                                                                </DialogHeader>
                                                                <p>Bạn có chắc chắn muốn xóa màu sắc này không?</p>
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline" onClick={() => {
                                                                            setIsDeleteDialogOpen(false);
                                                                            setColorToDelete(null);
                                                                        }}>Hủy</Button>
                                                                    </DialogClose>
                                                                    <Button variant="destructive" onClick={() => {
                                                                        handleDeleteColor((color as any)?.id);
                                                                        setIsDeleteDialogOpen(false);
                                                                        setColorToDelete(null);
                                                                    }}>Xóa</Button>
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
                                        <TableCell colSpan={6} className="px-4 py-8 text-center text-maintext">
                                            Không tìm thấy màu sắc nào
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
        name: '',
        code: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
    });

    const [errors, setErrors] = useState({
        name: '',
        code: ''
    });

    useEffect(() => {
        if (colorData?.data) {
            setFormData({
                name: colorData.data.name,
                code: colorData.data.code,
                status: colorData.data.status
            });
        }
    }, [colorData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

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
            newErrors.name = 'Tên màu sắc không được để trống';
            isValid = false;
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Mã màu không được để trống';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const generateRandomColor = () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const colorName = namer(randomColor).pantone[0].name;

        setFormData(prev => ({
            ...prev,
            name: colorName,
            code: randomColor
        }));

        setErrors({
            name: '',
            code: ''
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await updateColor.mutateAsync(
                {
                    colorId: colorId,
                    payload: formData
                },
                {
                    onSuccess: () => {
                        toast.success('Cập nhật màu sắc thành công');
                        queryClient.invalidateQueries({ queryKey: ['color', colorId] });
                        queryClient.invalidateQueries({ queryKey: ['colors'] });
                        onClose();
                    },
                    onError: (error) => {
                        toast.error('Cập nhật màu sắc thất bại: ' + error.message);
                    }
                }
            );
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi cập nhật màu sắc');
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
                    <p className="text-red-500 mb-4">Đã xảy ra lỗi khi tải dữ liệu màu sắc.</p>
                    <div className="flex justify-center space-x-4">
                        <Button variant="outline" onClick={onClose}>
                            Đóng
                        </Button>
                        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['color', colorId] })}>
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
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="code">Mã màu</Label>
                    <div className="flex gap-2 items-center">
                        <Input
                            id="code"
                            name="code"
                            type="text"
                            placeholder="#000000"
                            value={formData.code}
                            onChange={handleInputChange}
                            className={errors.code ? 'border-red-500' : ''}
                        />
                        <div
                            className="w-10 h-10 rounded-[6px] border border-gray-200"
                            style={{ backgroundColor: formData.code }}
                        />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={generateRandomColor}
                    >
                        <Icon path={mdiRefresh} size={0.7} className="mr-2" />
                        Random Color
                    </Button>
                    {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
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
                    <Button type="submit" disabled={updateColor.isPending}>
                        {updateColor.isPending ? 'Đang xử lý...' : 'Cập nhật màu sắc'}
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
        name: '',
        code: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
    });

    const [errors, setErrors] = useState({
        name: '',
        code: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

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
            newErrors.name = 'Tên màu sắc không được để trống';
            isValid = false;
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Mã màu không được để trống';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const generateRandomColor = () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const colorName = namer(randomColor).pantone[0].name;

        setFormData(prev => ({
            ...prev,
            name: colorName,
            code: randomColor
        }));

        // Clear any errors
        setErrors({
            name: '',
            code: ''
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await createColor.mutateAsync(
                formData,
                {
                    onSuccess: () => {
                        toast.success('Thêm màu sắc thành công');
                        queryClient.invalidateQueries({ queryKey: ['colors'] });
                        // Reset form
                        setFormData({
                            name: '',
                            code: '',
                            status: 'ACTIVE'
                        });
                        onClose();
                    },
                    onError: (error) => {
                        if (error.message === "Duplicate entry. This record already exists.") {
                        } else {
                            toast.error('Thêm màu sắc thất bại: Màu sắc đã tồn tại');
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
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="create-code">Mã màu</Label>
                    <div className="flex gap-2 items-center">
                        <Input
                            id="create-code"
                            name="code"
                            type="text"
                            placeholder="#000000"
                            value={formData.code}
                            onChange={handleInputChange}
                            className={errors.code ? 'border-red-500' : ''}
                        />
                        <div
                            className="w-10 h-10 rounded-[6px] border border-gray-200"
                            style={{ backgroundColor: formData.code }}
                        />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={generateRandomColor}
                    >
                        <Icon path={mdiRefresh} size={0.7} className="mr-2" />
                        Random Color
                    </Button>
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
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Hủy
                    </Button>
                    <Button type="submit" disabled={createColor.isPending}>
                        {createColor.isPending ? 'Đang xử lý...' : 'Thêm màu sắc'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
} 