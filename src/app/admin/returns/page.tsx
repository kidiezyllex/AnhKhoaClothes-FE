'use client';

import { useState, useEffect } from 'react';
 
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@mdi/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReturns, useDeleteReturn, useUpdateReturnStatus, useReturnStats, useSearchReturn } from '@/hooks/return';
import { IReturnFilter } from '@/interface/request/return';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import StatusUpdateModal from '@/components/admin/returns/StatusUpdateModal';
import SearchReturnModal from '@/components/admin/returns/SearchReturnModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { mdiMagnify, mdiDownload, mdiPlus, mdiFilterOutline, mdiCalendar, mdiDotsVertical, mdiEye, mdiPencilCircle, mdiCheckCircle, mdiDeleteCircle, mdiCancel, mdiCheck } from '@mdi/js';

export default function ReturnsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IReturnFilter>({
    page: 1,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const { data, isLoading, isError } = useReturns(filters);
  const deleteReturn = useDeleteReturn();
  const updateStatus = useUpdateReturnStatus();
  const { data: statsData } = useReturnStats();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [returnToDelete, setReturnToDelete] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<string | null>(null);
  const [statusUpdateModal, setStatusUpdateModal] = useState<{
    isOpen: boolean;
    returnId: string;
    currentStatus: string;
  }>({ isOpen: false, returnId: '', currentStatus: '' });
  const [searchModal, setSearchModal] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        setFilters((prev) => ({ ...prev, page: 1 }));
      } else {
        setFilters({ ...filters, page: 1 });
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    const newStatus = mapTabToStatus(selectedTab);
    if (newStatus) {
      setFilters({ ...filters, status: newStatus, page: 1 });
    } else {
      const { status, ...rest } = filters;
      setFilters({ ...rest, page: 1 });
    }
  }, [selectedTab]);

  const mapTabToStatus = (tab: string) => {
    switch (tab) {
      case 'pending': return 'CHO_XU_LY';
      case 'refunded': return 'DA_HOAN_TIEN';
      case 'cancelled': return 'DA_HUY';
      default: return undefined;
    }
  };

  const handleFilterChange = (key: keyof IReturnFilter, value: string | number | undefined) => {
    if (value === '') {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters({ ...newFilters, page: 1 });
    } else {
      setFilters({ ...filters, [key]: value, page: 1 });
    }
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    const newFilters = { ...filters };
    
    if (range.from) {
      newFilters.startDate = format(range.from, 'yyyy-MM-dd');
    } else {
      delete newFilters.startDate;
    }
    
    if (range.to) {
      newFilters.endDate = format(range.to, 'yyyy-MM-dd');
    } else {
      delete newFilters.endDate;
    }
    
    setFilters({ ...newFilters, page: 1 });
  };

  const handleDeleteReturn = async (id: string) => {
    try {
      await deleteReturn.mutateAsync(id, {
        onSuccess: () => {
          toast.success('Đã xóa yêu cầu trả hàng thành công');
          queryClient.invalidateQueries({ queryKey: ['returns'] });
          queryClient.invalidateQueries({ queryKey: ['returnStats'] });
          setIsDeleteDialogOpen(false);
        },
      });
    } catch (error) {
      toast.error('Xóa yêu cầu trả hàng thất bại');
    }
  };

  const handleUpdateStatus = async (returnId: string, status: 'CHO_XU_LY' | 'DA_HOAN_TIEN' | 'DA_HUY') => {
    try {
      await updateStatus.mutateAsync({ 
        returnId, 
        payload: { status } 
      }, {
        onSuccess: () => {
          toast.success('Đã cập nhật trạng thái thành công');
          queryClient.invalidateQueries({ queryKey: ['returns'] });
          queryClient.invalidateQueries({ queryKey: ['returnStats'] });
          queryClient.invalidateQueries({ queryKey: ['return', returnId] });
          setStatusUpdateModal({ isOpen: false, returnId: '', currentStatus: '' });
        },
      });
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại');
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
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  const getReturnStatusBadge = (status: string) => {
    switch (status) {
      case 'CHO_XU_LY':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Chờ xử lý</Badge>;
      case 'DA_HOAN_TIEN':
        return <Badge variant="outline" className="bg-green-50 text-primary border-green-200">Đã hoàn tiền</Badge>;
      case 'DA_HUY':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const exportToCSV = () => {
    if (!data?.data.returns.length) {
      toast.error('Không có dữ liệu để xuất');
      return;
    }

    const headers = ['Mã yêu cầu', 'Khách hàng', 'Đơn hàng gốc', 'Ngày tạo', 'Số tiền hoàn trả', 'Trạng thái'];
    const csvContent = [
      headers.join(','),
      ...data.data.returns.map(returnItem => [
        returnItem.code,
        typeof returnItem.customer === 'string' ? returnItem.customer : returnItem.customer.fullName,
        typeof returnItem.originalOrder === 'string' ? returnItem.originalOrder : returnItem.originalOrder.code,
        formatDate(returnItem.createdAt),
        returnItem.totalRefund,
        returnItem.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `returns_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <BreadcrumbPage>Quản lý trả hàng</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSearchModal(true)}>
            <Icon path={mdiMagnify} size={0.7} className="mr-2" />
            Tìm kiếm nâng cao
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Icon path={mdiDownload} size={0.7} className="mr-2" />
            Xuất CSV
          </Button>
          <a href="/admin/returns/create" className="flex items-center gap-2">
            <Button className="flex items-center gap-2">
              <Icon path={mdiPlus} size={0.7} />
              Tạo yêu cầu trả hàng mới
            </Button>
          </a>
        </div>
      </div>

      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-maintext">Tổng số đơn trả</p>
                <h3 className="text-2xl font-bold">{statsData.data.totalReturns}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-maintext">Đang chờ xử lý</p>
                <h3 className="text-2xl font-bold">{statsData.data.pendingReturns}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-maintext">Đã hoàn tiền</p>
                <h3 className="text-2xl font-bold">{statsData.data.refundedReturns}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-maintext">Tổng tiền hoàn trả</p>
                <h3 className="text-2xl font-bold">{formatCurrency(statsData.data.totalRefundAmount)}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="mb-4">
        <CardContent className="py-4">
          <Tabs defaultValue="all" onValueChange={setSelectedTab}>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="px-4 text-maintext">
                  Tất cả
                </TabsTrigger>
                <TabsTrigger value="pending" className="px-4 text-maintext">
                  Chờ xử lý
                </TabsTrigger>
                <TabsTrigger value="refunded" className="px-4 text-maintext">
                  Đã hoàn tiền
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="px-4 text-maintext">
                  Đã hủy
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
                <div className="relative w-full sm:w-80">
                  <Input
                    placeholder="Tìm theo mã, tên KH, SĐT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                  <div className="absolute left-3 top-2.5 text-maintext">
                    <Icon path={mdiMagnify} size={0.7} />
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center"
                >
                  <Icon path={mdiFilterOutline} size={0.7} className="mr-2" />
                  Bộ lọc
                  {(filters.customer || filters.startDate || filters.endDate) && (
                    <Badge className="ml-2 bg-primary h-5 w-5 p-0 flex items-center justify-center">
                      {[filters.customer, filters.startDate, filters.endDate].filter(Boolean).length}
                    </Badge>
                  )}
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
                  className="bg-slate-50 p-4 rounded-[6px] mb-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Khách hàng</label>
                      <Input
                        placeholder="Tìm theo tên khách hàng"
                        value={filters.customer || ''}
                        onChange={(e) => handleFilterChange('customer', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Từ ngày</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Icon path={mdiCalendar} size={0.7} className="mr-2" />
                            {dateRange.from ? format(dateRange.from, 'dd/MM/yyyy') : 'Chọn ngày'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => handleDateRangeChange({ ...dateRange, from: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Đến ngày</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Icon path={mdiCalendar} size={0.7} className="mr-2" />
                            {dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : 'Chọn ngày'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => handleDateRangeChange({ ...dateRange, to: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setDateRange({});
                        setFilters({ page: 1, limit: 10 });
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading ? (
              <div className="space-y-4">
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
              <div className="text-center py-10">
                <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
              </div>
            ) : data?.data.returns.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-maintext">Không có yêu cầu trả hàng nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Mã yêu cầu</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Đơn hàng gốc</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Số tiền hoàn trả</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data.returns.map((returnItem) => (
                      <TableRow key={(returnItem as any)?.id}>
                        <TableCell className="font-medium">{returnItem.code}</TableCell>
                        <TableCell>
                          {typeof returnItem.customer === 'string' ? 
                            returnItem.customer : 
                            returnItem.customer.fullName}
                        </TableCell>
                        <TableCell>
                          {typeof returnItem.originalOrder === 'string' ? 
                            returnItem.originalOrder : 
                            returnItem.originalOrder.code}
                        </TableCell>
                        <TableCell>{formatDate(returnItem.createdAt)}</TableCell>
                        <TableCell>{formatCurrency(returnItem.totalRefund)}</TableCell>
                        <TableCell>{getReturnStatusBadge(returnItem.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                              >
                                <Icon path={mdiDotsVertical} size={0.7} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="cursor-pointer text-maintext"
                                onClick={() => {
                                  setSelectedReturn((returnItem as any)?.id);
                                  setIsDetailDialogOpen(true);
                                }}
                              >
                                <Icon path={mdiEye} size={0.7} className="mr-2" />
                                <span className="text-maintext text-sm">Xem chi tiết</span>
                              </DropdownMenuItem>
                              {returnItem.status === 'CHO_XU_LY' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <a href={`/admin/returns/edit/${(returnItem as any)?.id}`}>
                                    <DropdownMenuItem className="cursor-pointer text-maintext">
                                      <Icon path={mdiPencilCircle} size={0.7} className="mr-2 text-blue-400" />
                                      <span className="text-maintext text-sm">Chỉnh sửa</span>
                                    </DropdownMenuItem>
                                  </a>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer text-green-600"
                                    onClick={() => setStatusUpdateModal({
                                      isOpen: true,
                                      returnId: (returnItem as any)?.id,
                                      currentStatus: returnItem.status
                                    })}
                                  >
                                    <Icon path={mdiCheckCircle} size={0.7} className="mr-2 text-green-400 " />
                                    <span className="text-sm text-maintext">Cập nhật trạng thái</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-600"
                                    onClick={() => {
                                      setReturnToDelete((returnItem as any)?.id);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Icon path={mdiDeleteCircle} size={0.7} className="mr-2 text-red-400 " />
                                    <span className="text-sm text-maintext">Xóa yêu cầu</span>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {data && data.data.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleChangePage(Math.max(1, filters.page || 1 - 1))}
                    disabled={filters.page === 1}
                  >
                    Trước
                  </Button>
                  {[...Array(data.data.pagination.totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={filters.page === i + 1 ? "default" : "outline"}
                      onClick={() => handleChangePage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handleChangePage(Math.min(data.data.pagination.totalPages, (filters.page || 1) + 1))}
                    disabled={filters.page === data.data.pagination.totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa yêu cầu trả hàng</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn xóa yêu cầu trả hàng này? Hành động này không thể hoàn tác.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={() => returnToDelete && handleDeleteReturn(returnToDelete)}
              disabled={deleteReturn.isPending}
            >
              {deleteReturn.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[90%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu trả hàng</DialogTitle>
          </DialogHeader>
          <ReturnDetailContent 
            returnId={selectedReturn || ''} 
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onUpdateStatus={handleUpdateStatus}
          />
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={statusUpdateModal.isOpen}
        onClose={() => setStatusUpdateModal({ isOpen: false, returnId: '', currentStatus: '' })}
        onConfirm={handleUpdateStatus}
        returnId={statusUpdateModal.returnId}
        currentStatus={statusUpdateModal.currentStatus}
        isLoading={updateStatus.isPending}
      />

      {/* Search Modal */}
      <SearchReturnModal
        isOpen={searchModal}
        onClose={() => setSearchModal(false)}
      />
    </div>
  );
}

import { useReturnDetail } from '@/hooks/return';

function ReturnDetailContent({ 
  returnId, 
  formatCurrency, 
  formatDate,
  onUpdateStatus
}: { 
  returnId: string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  onUpdateStatus: (id: string, status: 'CHO_XU_LY' | 'DA_HOAN_TIEN' | 'DA_HUY') => Promise<void>;
}) {
  const { data, isLoading, isError } = useReturnDetail(returnId);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-red-500 p-4">Đã xảy ra lỗi khi tải thông tin chi tiết.</p>;
  }

  const returnData = data.data;
  const customer = typeof returnData.customer === 'string' 
    ? { fullName: 'Không có thông tin', email: '', phoneNumber: '' }
    : returnData.customer;

  const order = typeof returnData.originalOrder === 'string'
    ? { code: returnData.originalOrder }
    : returnData.originalOrder;

  const getReasonLabel = (reason: string) => {
    const reasonMap: Record<string, string> = {
      'wrong_size': 'Sai kích cỡ',
      'wrong_item': 'Sản phẩm không đúng',
      'damaged': 'Sản phẩm bị hỏng',
      'defective': 'Sản phẩm bị lỗi',
      'changed_mind': 'Đổi ý',
      'other': 'Lý do khác'
    };
    return reasonMap[reason] || reason;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Thông tin yêu cầu</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-maintext">Mã yêu cầu</p>
              <p className="font-medium">{returnData.code}</p>
            </div>
            <div>
              <p className="text-sm text-maintext">Ngày tạo</p>
              <p className="font-medium">{formatDate(returnData.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-maintext">Đơn hàng gốc</p>
              <p className="font-medium">{order.code}</p>
            </div>
            <div>
              <p className="text-sm text-maintext">Trạng thái</p>
              <div className="mt-1">
                {returnData.status === 'CHO_XU_LY' ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Chờ xử lý</Badge>
                ) : returnData.status === 'DA_HOAN_TIEN' ? (
                  <Badge variant="outline" className="bg-green-50 text-primary border-green-200">Đã hoàn tiền</Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Đã hủy</Badge>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-maintext">Tổng tiền hoàn trả</p>
              <p className="font-medium text-lg text-primary">{formatCurrency(returnData.totalRefund)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-sm text-maintext">Tên khách hàng</p>
              <p className="font-medium">{customer.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-maintext">Email</p>
              <p className="font-medium">{customer.email || 'Không có'}</p>
            </div>
            <div>
              <p className="text-sm text-maintext">Số điện thoại</p>
              <p className="font-medium">{customer.phoneNumber || 'Không có'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Sản phẩm trả lại</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Ảnh</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Biến thể</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Lý do trả hàng</TableHead>
                <TableHead>Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returnData.items.map((item: any, index: number) => {
                const product = typeof item.product === 'string' 
                  ? { name: 'Không có thông tin', code: item.product, images: [] }
                  : item.product;
                
                return (
                  <TableRow key={index}>
                    <TableCell>
                      {product.images && product.images.length > 0 ? (
                        <div className="w-16 h-16 relative">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="object-cover rounded-[6px]"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-[6px] flex items-center justify-center">
                          <Icon path={mdiMagnify} size={1} className="text-maintext" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                      <div className="text-xs text-maintext">SKU: {product.code}</div>
                    </TableCell>
                    <TableCell>
                      {item.variant ? (
                        <>
                          <div>Màu: {item.variant.colorId}</div>
                          <div>Size: {item.variant.sizeId}</div>
                        </>
                      ) : (
                        'Mặc định'
                      )}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell>
                      {item.reason ? (
                        <Badge variant="outline">{getReasonLabel(item.reason)}</Badge>
                      ) : (
                        'Không có'
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {returnData.status === 'CHO_XU_LY' && (
        <div className="border-t pt-4 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => onUpdateStatus(returnId, 'DA_HUY')}
          >
            <Icon path={mdiCancel} size={0.7} />
            Từ chối trả hàng
          </Button>
          <Button 
            className="gap-2"
            onClick={() => onUpdateStatus(returnId, 'DA_HOAN_TIEN')}
          >
            <Icon path={mdiCheck} size={0.7} />
            Hoàn tiền
          </Button>
        </div>
      )}
    </div>
  );
} 