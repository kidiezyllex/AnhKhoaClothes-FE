'use client';

import { useState, useEffect } from 'react';
 
import { useNavigate, useParams } from 'react-router-dom';
import { useVoucherDetail, useUpdateVoucher } from '@/hooks/voucher';
import { IVoucherUpdate } from '@/interface/request/voucher';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@mdi/react';
import { mdiArrowLeft, mdiLoading } from '@mdi/js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditVoucherPage() {
  const navigate = useNavigate();
  const params = useParams();
  const voucherId = typeof params.id === 'string' ? params.id : '';
  const { data: voucherData, isLoading, isError } = useVoucherDetail(voucherId);
  const updateVoucher = useUpdateVoucher();

  const [voucher, setVoucher] = useState<IVoucherUpdate>({
    name: '',
    quantity: 0,
    startDate: '',
    endDate: '',
    minOrderValue: 0,
    maxDiscount: undefined,
    status: 'ACTIVE'
  });

  const [originalVoucher, setOriginalVoucher] = useState({
    code: '',
    discountType: '',
    discountValue: 0,
    usedCount: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (voucherData?.data) {
      setVoucher({
        name: voucherData.data.name,
        quantity: voucherData.data.quantity,
        startDate: voucherData.data.startDate.split('T')[0],
        endDate: voucherData.data.endDate.split('T')[0],
        minOrderValue: voucherData.data.minOrderValue,
        maxDiscount: voucherData.data.maxDiscount,
        status: voucherData.data.status
      });
      
      setOriginalVoucher({
        code: voucherData.data.code,
        discountType: voucherData.data.discountType,
        discountValue: voucherData.data.discountValue,
        usedCount: voucherData.data.usedCount,
      });
    }
  }, [voucherData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;
    
    // Handle numeric fields
    if (type === 'number') {
      parsedValue = value === '' ? 0 : parseFloat(value);
    }
    
    setVoucher({ ...voucher, [name]: parsedValue });
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setVoucher({ ...voucher, [name]: value });
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleDateChange = (name: string, value: string) => {
    setVoucher({ ...voucher, [name]: value });
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!voucher.name?.trim()) {
      newErrors.name = 'Tên voucher không được để trống';
    }
    
    if (voucher.quantity !== undefined && voucher.quantity < originalVoucher.usedCount) {
      newErrors.quantity = `Số lượng không được nhỏ hơn số lượng đã sử dụng (${originalVoucher.usedCount})`;
    }
    
    if (!voucher.startDate) {
      newErrors.startDate = 'Ngày bắt đầu không được để trống';
    }
    
    if (!voucher.endDate) {
      newErrors.endDate = 'Ngày kết thúc không được để trống';
    }
    
    if (voucher.startDate && voucher.endDate && new Date(voucher.startDate) > new Date(voucher.endDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }
    
    if (voucher.minOrderValue !== undefined && voucher.minOrderValue < 0) {
      newErrors.minOrderValue = 'Giá trị đơn hàng tối thiểu không được âm';
    }
    
    if (originalVoucher.discountType === 'PERCENTAGE' && voucher.maxDiscount !== undefined && voucher.maxDiscount <= 0) {
      newErrors.maxDiscount = 'Giảm giá tối đa phải lớn hơn 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    try {
      await updateVoucher.mutateAsync(
        { voucherId, payload: voucher },
        {
          onSuccess: () => {
            toast.success('Cập nhật mã giảm giá thành công');
            navigate('/admin/discounts/vouchers');
          },
          onError: (error) => {
            toast.error('Cập nhật mã giảm giá thất bại: ' + (error.message || 'Không xác định'));
          }
        }
      );
    } catch (error) {
      toast.error('Cập nhật mã giảm giá thất bại');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !voucherData) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/discounts">Quản lý khuyến mãi</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/discounts/vouchers">Mã giảm giá</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Chỉnh sửa mã giảm giá</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <Icon path={mdiArrowLeft} size={0.7} />
            Quay lại
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-red-500 mb-4">Đã xảy ra lỗi khi tải thông tin mã giảm giá. Vui lòng thử lại sau.</p>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <BreadcrumbLink href="/admin/discounts">Quản lý khuyến mãi</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/discounts/vouchers">Mã giảm giá</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chỉnh sửa mã giảm giá</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <Icon path={mdiArrowLeft} size={0.7} />
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa mã giảm giá - {originalVoucher.code}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-maintext">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code" className="text-maintext">Mã voucher</Label>
                <div className="px-2.5 border rounded-[6px] bg-gray-50 mt-1 h-9 flex items-center justify-between">
                  {originalVoucher.code}
                </div>
                <p className="text-xs text-maintext mt-1 italic">Mã voucher không thể thay đổi sau khi tạo</p>
              </div>

              <div>
                <Label htmlFor="discountType" className="text-maintext">Loại voucher</Label>
                <div className="px-2.5 border rounded-[6px] bg-gray-50 mt-1 h-9 flex items-center justify-between">
                  {originalVoucher.discountType === 'PERCENTAGE' ? 'Phần trăm (%)' : 'Số tiền cố định (VNĐ)'}
                </div>
                <p className="text-xs text-maintext mt-1 italic">Loại voucher không thể thay đổi sau khi tạo</p>
              </div>

              <div>
                <Label htmlFor="discountValue" className="text-maintext">Giá trị</Label>
                <div className="px-2.5 border rounded-[6px] bg-gray-50 mt-1 h-9 flex items-center justify-between flex">
                  <span>{originalVoucher.discountValue}</span>
                  <span className="ml-2">
                    {originalVoucher.discountType === 'PERCENTAGE' ? '%' : 'VNĐ'}
                  </span>
                </div>
                <p className="text-xs text-maintext mt-1 italic">Giá trị không thể thay đổi sau khi tạo</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Tên voucher <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={voucher.name || ''}
                  onChange={handleInputChange}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Số lượng <span className="text-red-500">*</span></Label>
                <div className="flex items-center">
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={originalVoucher.usedCount}
                    value={voucher.quantity || 0}
                    onChange={handleInputChange}
                    className={errors.quantity ? 'border-red-500' : ''}
                  />
                </div>
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                <p className="text-xs text-maintext italic">
                  Đã sử dụng: {originalVoucher.usedCount}/{voucher.quantity} voucher
                </p>
              </div>

              {originalVoucher.discountType === 'PERCENTAGE' && (
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Giảm giá tối đa</Label>
                  <div className="flex items-center">
                    <Input
                      id="maxDiscount"
                      name="maxDiscount"
                      type="number"
                      min={0}
                      value={voucher.maxDiscount === undefined ? '' : voucher.maxDiscount}
                      onChange={handleInputChange}
                      className={`${errors.maxDiscount ? 'border-red-500' : ''} rounded-r-none`}
                    />
                    <div className="bg-gray-100 border border-l-0 px-3 py-2 rounded-r-md">
                      VNĐ
                    </div>
                  </div>
                  {errors.maxDiscount && <p className="text-red-500 text-sm">{errors.maxDiscount}</p>}
                  <p className="text-xs text-maintext">
                    Giới hạn số tiền giảm tối đa (để trống nếu không giới hạn)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="minOrderValue">Giá trị đơn hàng tối thiểu</Label>
                <div className="flex items-center">
                  <Input
                    id="minOrderValue"
                    name="minOrderValue"
                    type="number"
                    min={0}
                    value={voucher.minOrderValue === undefined ? 0 : voucher.minOrderValue}
                    onChange={handleInputChange}
                    className={`${errors.minOrderValue ? 'border-red-500' : ''} rounded-r-none`}
                  />
                  <div className="bg-gray-100 border border-l-0 px-3 py-2 rounded-r-md">
                    VNĐ
                  </div>
                </div>
                {errors.minOrderValue && <p className="text-red-500 text-sm">{errors.minOrderValue}</p>}
                <p className="text-xs text-maintext italic">
                  Giá trị đơn hàng tối thiểu để áp dụng voucher (0 = không giới hạn)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu <span className="text-red-500">*</span></Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={voucher.startDate ? new Date(voucher.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className={errors.startDate ? 'border-red-500' : ''}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc <span className="text-red-500">*</span></Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={voucher.endDate ? new Date(voucher.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={voucher.status || ''}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status" className={errors.status ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                    <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                <p className="text-xs text-maintext">
                  Trạng thái của voucher (người dùng chỉ có thể sử dụng voucher đang hoạt động)
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-4 py-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={updateVoucher.isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={updateVoucher.isPending}
            >
              {updateVoucher.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.7} className="mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : 'Cập nhật'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
} 