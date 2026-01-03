'use client';

import { useState } from 'react';
 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSearchReturn } from '@/hooks/return';
import { Icon } from '@mdi/react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { mdiMagnify, mdiClose, mdiEye } from '@mdi/js';
interface SearchReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchReturnModal({ isOpen, onClose }: SearchReturnModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const { data: searchResults, isLoading, refetch } = useSearchReturn(
    { query: searchQuery }
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setHasSearched(true);
      refetch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CHO_XU_LY':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Chờ xử lý</Badge>;
      case 'DA_HOAN_TIEN':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Đã hoàn tiền</Badge>;
      case 'DA_HUY':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setHasSearched(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Tìm kiếm nâng cao</span>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <Icon path={mdiClose} size={0.7} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Tìm theo mã yêu cầu trả hàng hoặc mã đơn hàng gốc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full"
                  />
                </div>
                <Button onClick={handleSearch} disabled={!searchQuery.trim() || isLoading}>
                  <Icon path={mdiMagnify} size={0.7} className="mr-2" />
                  {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
                </Button>
              </div>
              
              <div className="mt-3 text-sm text-maintext">
                <p><strong>Gợi ý tìm kiếm:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Nhập mã yêu cầu trả hàng (ví dụ: RT001)</li>
                  <li>Nhập mã đơn hàng gốc (ví dụ: ORD001)</li>
                  <li>Nhập một phần của mã để tìm kiếm gần đúng</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {hasSearched && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Kết quả tìm kiếm</h3>
                
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : searchResults?.data.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon path={mdiMagnify} size={2} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-maintext">Không tìm thấy yêu cầu trả hàng nào phù hợp</p>
                    <p className="text-sm text-maintext mt-1">
                      Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại mã yêu cầu
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-maintext">
                      Tìm thấy <strong>{searchResults?.data.length}</strong> kết quả cho "{searchQuery}"
                    </p>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mã yêu cầu</TableHead>
                            <TableHead>Khách hàng</TableHead>
                            <TableHead>Đơn hàng gốc</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead>Số tiền hoàn trả</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {searchResults?.data.map((returnItem) => (
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
                              <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                              <TableCell className="text-right">
                                <a href={`/admin/returns/edit/${(returnItem as any)?.id}`}>
                                  <Button size="icon" variant="ghost" onClick={handleClose}>
                                    <Icon path={mdiEye} size={0.7} />
                                  </Button>
                                </a>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 