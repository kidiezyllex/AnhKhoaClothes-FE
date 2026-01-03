'use client';

import { useState, useEffect } from 'react';
 
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import { mdiMagnify, mdiPlus, mdiPencilCircle, mdiDeleteCircle, mdiFilterOutline, mdiLoading, mdiEmailFast, mdiTagCheckOutline, mdiFilterRemoveOutline } from '@mdi/js';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useVouchers, useDeleteVoucher, useNotifyVoucher, useValidateVoucher } from '@/hooks/voucher';
import { IVoucherFilter } from '@/interface/request/voucher';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

export default function VouchersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IVoucherFilter>({
    page: 1,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  const { data, isLoading, isError } = useVouchers(filters);
  const deleteVoucher = useDeleteVoucher();
  const notifyVoucher = useNotifyVoucher();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<string | null>(null);
  const [voucherToNotify, setVoucherToNotify] = useState<string | null>(null);
  const [voucherCodeToValidate, setVoucherCodeToValidate] = useState('');
  const [orderValueToValidate, setOrderValueToValidate] = useState('');
  const validateVoucher = useValidateVoucher();
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        setFilters((prev) => ({ ...prev, name: searchQuery, page: 1 }));
      } else {
        const { name, ...rest } = filters;
        setFilters({ ...rest, page: 1 });
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleFilterChange = (key: keyof IVoucherFilter, value: string | number | undefined) => {
    if (value === '') {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters({ ...newFilters, page: 1 });
    } else {
      setFilters({ ...filters, [key]: value, page: 1 });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({ page: 1, limit: 10 });
  };

  const handleDeleteVoucher = async (id: string) => {
    try {
      await deleteVoucher.mutateAsync(id, {
        onSuccess: () => {
          toast.success('Đã xóa mã giảm giá thành công');
          queryClient.invalidateQueries({ queryKey: ['vouchers'] });
          setIsDeleteDialogOpen(false);
        },
      });
    } catch (error) {
      toast.error('Xóa mã giảm giá thất bại');
    }
  };

  const handleNotifyVoucher = async (id: string) => {
    try {
      await notifyVoucher.mutateAsync(id, {
        onSuccess: () => {
          toast.success('Đã gửi thông báo mã giảm giá thành công');
          setIsNotifyDialogOpen(false);
        },
      });
    } catch (error) {
      toast.error('Gửi thông báo thất bại');
    }
  };

  const handleChangePage = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const handleValidateVoucher = async () => {
    try {
      const result = await validateVoucher.mutateAsync({
        code: voucherCodeToValidate,
        orderValue: orderValueToValidate ? parseInt(orderValueToValidate) : undefined
      });
      setValidationResult(result);
    } catch (error) {
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
      setValidationResult(null);
    }
  };

  const resetValidateDialog = () => {
    setVoucherCodeToValidate('');
    setOrderValueToValidate('');
    setValidationResult(null);
    setIsValidateDialogOpen(false);
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
              <BreadcrumbLink href="/admin/discounts">Quản lý khuyến mãi</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Mã giảm giá</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex space-x-2">
          {/* <Button
            variant="outline"
            onClick={() => setIsValidateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Icon path={mdiTagCheckOutline} size={0.7} />
            Kiểm tra mã
          </Button> */}
          <a href="/admin/discounts/vouchers/create" className="flex items-center gap-2">
            <Button className="flex items-center gap-2">
              <Icon path={mdiPlus} size={0.7} />
              Thêm mã giảm giá mới
            </Button>
          </a>
        </div>
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
                placeholder="Tìm kiếm theo tên hoặc mã voucher..."
                className="pl-10 pr-4 py-2 w-full border rounded-[6px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              {(showFilters || searchQuery || Object.keys(filters).filter(k => k !== 'page' && k !== 'limit').length > 0) && (
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={handleClearFilters}
                >
                  <Icon path={mdiFilterRemoveOutline} size={0.7} className="mr-2" />
                  Clear bộ lọc
                </Button>
              )}
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Icon path={mdiFilterOutline} size={0.7} className="mr-2" />
                {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-maintext mb-2 font-semibold">
                      Mã voucher
                    </label>
                    <Input
                      type="text"
                      value={filters.code || ''}
                      onChange={(e) => handleFilterChange('code', e.target.value)}
                      placeholder="Nhập mã voucher"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-maintext mb-2 font-semibold">
                      Trạng thái
                    </label>
                    <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                        <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-maintext mb-2 font-semibold">
                      Thời gian
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="date"
                          value={filters.startDate || ''}
                          onChange={(e) => handleFilterChange('startDate', e.target.value)}
                          className="w-full"
                          placeholder="Từ ngày"
                        />
                      </div>
                      <div>
                        <Input
                          type="date"
                          value={filters.endDate || ''}
                          onChange={(e) => handleFilterChange('endDate', e.target.value)}
                          className="w-full"
                          placeholder="Đến ngày"
                        />
                      </div>
                    </div>
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
          <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['vouchers'] })}
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
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Mã</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Tên</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Loại</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Giá trị</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Sử dụng</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Thời gian</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm font-medium text-maintext">Trạng thái</TableHead>
                  <TableHead className="px-4 py-4 text-center text-sm font-medium text-maintext">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.vouchers?.map((voucher) => (
                  <TableRow key={(voucher as any).id}>
                    <TableCell className="px-4 py-4 text-sm">
                      <span className="font-mono font-medium">{voucher.code}</span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm font-medium">{voucher.name}</TableCell>
                    <TableCell className="px-4 py-4 text-sm">
                      {(voucher as any)?.type === 'PERCENTAGE' ? 'Phần trăm' : 'Số tiền cố định'}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm">
                      {(voucher as any)?.type === 'PERCENTAGE' ? `${(voucher as any)?.value}%` : formatCurrency((voucher as any)?.value)}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm">
                      {voucher.usedCount}/{voucher.quantity}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm">
                      {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm">
                      <Badge
                        variant={voucher.status === 'ACTIVE' ? 'default' : 'destructive'}
                      >
                        {voucher.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setVoucherToNotify((voucher as any).id);
                            setIsNotifyDialogOpen(true);
                          }}
                          title="Gửi thông báo"
                        >
                          <Icon path={mdiEmailFast} size={0.7} />
                        </Button>
                        <a href={`/admin/discounts/vouchers/edit/${(voucher as any).id}`}>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Sửa"
                          >
                            <Icon path={mdiPencilCircle} size={0.7} />
                          </Button>
                        </a>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setVoucherToDelete((voucher as any).id);
                            setIsDeleteDialogOpen(true);
                          }}
                          title="Xóa"
                        >
                          <Icon path={mdiDeleteCircle} size={0.7} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data && data.data && data.data.pagination && (
            <div className="flex justify-center items-center space-x-2 p-4 border-t">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChangePage(1)}
                disabled={data.data.pagination.currentPage === 1}
              >
                <span className="sr-only">Trang đầu</span>
                <span>«</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChangePage(data.data.pagination.currentPage - 1)}
                disabled={data.data.pagination.currentPage === 1}
              >
                <span className="sr-only">Trang trước</span>
                <span>‹</span>
              </Button>
              {[...Array(data.data.pagination.totalPages)].map((_, index) => {
                const page = index + 1;
                // Hiển thị trang hiện tại, 2 trang trước và 2 trang sau
                if (
                  page === 1 ||
                  page === data.data.pagination.totalPages ||
                  (page >= data.data.pagination.currentPage - 2 &&
                    page <= data.data.pagination.currentPage + 2)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={page === data.data.pagination.currentPage ? "default" : "outline"}
                      size="icon"
                      onClick={() => handleChangePage(page)}
                    >
                      {page}
                    </Button>
                  );
                } else if (
                  page === data.data.pagination.currentPage - 3 ||
                  page === data.data.pagination.currentPage + 3
                ) {
                  return <span key={page}>...</span>;
                }
                return null;
              })}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChangePage(data.data.pagination.currentPage + 1)}
                disabled={data.data.pagination.currentPage === data.data.pagination.totalPages}
              >
                <span className="sr-only">Trang sau</span>
                <span>›</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChangePage(data.data.pagination.totalPages)}
                disabled={data.data.pagination.currentPage === data.data.pagination.totalPages}
              >
                <span className="sr-only">Trang cuối</span>
                <span>»</span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Xác nhận xóa dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa mã giảm giá</DialogTitle>
          </DialogHeader>
          <p className="py-4">Bạn có chắc chắn muốn xóa mã giảm giá này không? Hành động này không thể hoàn tác.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => voucherToDelete && handleDeleteVoucher(voucherToDelete)}
              disabled={deleteVoucher.isPending}
            >
              {deleteVoucher.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.7} className="mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Xác nhận gửi thông báo dialog */}
      <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận gửi thông báo</DialogTitle>
          </DialogHeader>
          <p className="py-4">Bạn có chắc chắn muốn gửi thông báo về mã giảm giá này tới tất cả khách hàng không?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              onClick={() => voucherToNotify && handleNotifyVoucher(voucherToNotify)}
              disabled={notifyVoucher.isPending}
            >
              {notifyVoucher.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.7} className="mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi thông báo'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validate Voucher Dialog */}
      <Dialog open={isValidateDialogOpen} onOpenChange={resetValidateDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Kiểm tra mã giảm giá</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="voucher-code" className="text-right">
                Mã voucher
              </Label>
              <Input
                id="voucher-code"
                value={voucherCodeToValidate}
                onChange={(e) => setVoucherCodeToValidate(e.target.value)}
                className="col-span-3"
                placeholder="Nhập mã voucher cần kiểm tra"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order-value" className="text-right">
                Giá trị đơn hàng
              </Label>
              <Input
                id="order-value"
                type="number"
                value={orderValueToValidate}
                onChange={(e) => setOrderValueToValidate(e.target.value)}
                className="col-span-3"
                placeholder="Nhập giá trị đơn hàng"
              />
            </div>
            
            {validationResult && (
              <div className="border rounded-[6px] p-4 mt-2">
                <h4 className="text-md font-semibold mb-2">Kết quả kiểm tra:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-maintext">Mã giảm giá:</span>
                    <span className="font-medium">{validationResult.data.voucher.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-maintext">Tên:</span>
                    <span className="font-medium">{validationResult.data.voucher.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-maintext">Loại:</span>
                    <span className="font-medium">
                      {validationResult.data.discountType === 'PERCENTAGE' ? 'Phần trăm' : 'Số tiền cố định'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-maintext">Giá trị giảm:</span>
                    <span className="font-medium text-primary">
                      {formatCurrency(validationResult.data.discountValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-maintext">Thời hạn:</span>
                    <span className="font-medium">
                      {formatDate(validationResult.data.voucher.startDate)} - {formatDate(validationResult.data.voucher.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="justify-between">
            <Button type="button" variant="outline" onClick={resetValidateDialog}>
              Hủy
            </Button>
            <Button type="button" onClick={handleValidateVoucher} disabled={!voucherCodeToValidate}>
              Kiểm tra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 