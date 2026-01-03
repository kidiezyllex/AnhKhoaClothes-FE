import React, { useState, useRef } from 'react';
import { Icon } from '@mdi/react';
import { mdiPrinter } from '@mdi/js';
import { toast } from 'react-toastify';
import jsPDF from "jspdf";
import { toPng } from 'html-to-image';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomScrollArea } from '@/components/ui/custom-scroll-area';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';

interface InvoiceShopInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface InvoiceCustomerInfo {
  name: string;
  phone: string;
}

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  color: string;
  size: string;
}

interface InvoiceData {
  shopInfo: InvoiceShopInfo;
  customerInfo: InvoiceCustomerInfo;
  orderId: string;
  employee: string;
  createdAt: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  voucherCode?: string;
  total: number;
  cashReceived: number;
  changeGiven: number;
  paymentMethod: string;
}

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceData: InvoiceData | null;
  formatCurrency: (amount: number) => string;
  formatDateTimeForInvoice: (dateString: string) => string;
}

const InvoiceDialog: React.FC<InvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoiceData,
  formatCurrency,
  formatDateTimeForInvoice,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!invoiceData) return null;

  const handlePrintToPdf = async () => {
    try {
      setIsProcessing(true);

      const input = invoiceRef.current;
      if (!input) throw new Error("Invoice element not found");

      const canvas = await toPng(input, {
        quality: 0.95,
        pixelRatio: 2,
        skipAutoScale: true,
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(canvas);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(canvas, 'PNG', 0, 0, pageWidth, imgHeight);
      pdf.save(`HoaDon_${invoiceData.orderId.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      
      toast.success("Đã lưu hoá đơn PDF thành công!");
    } catch (error) {
      toast.error("Lỗi khi in hoá đơn PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col min-h-0">
        <DialogHeader>
          <DialogTitle className="text-maintext text-center text-2xl font-semibold">Hoá đơn bán hàng</DialogTitle>
        </DialogHeader>
        <CustomScrollArea className="flex-1 min-h-0 p-4 overflow-y-auto">
          <div ref={invoiceRef} className="p-4 bg-white" id="invoice-content">
            <div className='w-full justify-center mb-4'>
              <img
                draggable="false"
                src="/images/logo.svg" 
                alt="logo" 
                width={100} 
                height={100} 
                className="w-auto mx-auto h-20" 
              />
            </div>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">{invoiceData.shopInfo.name}</h2>
              <p className="text-sm">{invoiceData.shopInfo.address}</p>
              <p className="text-sm">ĐT: {invoiceData.shopInfo.phone} - Email: {invoiceData.shopInfo.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p><strong>Mã HĐ:</strong> {invoiceData.orderId}</p>
                <p><strong>Ngày:</strong> {formatDateTimeForInvoice(invoiceData.createdAt)}</p>
                <p><strong>Nhân viên:</strong> {invoiceData.employee}</p>
              </div>
              <div className="text-right">
                <p><strong>Khách hàng:</strong> {invoiceData.customerInfo.name}</p>
                <p><strong>Điện thoại:</strong> {invoiceData.customerInfo.phone}</p>
              </div>
            </div>

            <Table className="mb-4 text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px] text-center">STT</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="text-xs">Màu/Size</TableHead>
                  <TableHead className="text-right w-[50px]">SL</TableHead>
                  <TableHead className="text-right w-[100px]">Đơn giá</TableHead>
                  <TableHead className="text-right w-[100px]">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-xs">{item.color} / {item.size}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(item.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end mb-4">
              <div className="w-full max-w-sm space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng:</span>
                  <span>{formatCurrency(invoiceData.subTotal)}</span>
                </div>
                {invoiceData.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Giảm giá ({invoiceData.voucherCode || 'KM'}):</span>
                    <span>-{formatCurrency(invoiceData.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>TỔNG THANH TOÁN:</span>
                  <span className="text-primary">{formatCurrency(invoiceData.total)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Phương thức:</span>
                  <span>{invoiceData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiền khách đưa:</span>
                  <span>{formatCurrency(invoiceData.cashReceived)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiền thừa:</span>
                  <span>{formatCurrency(invoiceData.changeGiven)}</span>
                </div>
              </div>
            </div>

            <p className="text-center text-sm mt-8">Cảm ơn Quý khách và hẹn gặp lại!</p>
            <p className="text-center text-xs mt-1">Website: {invoiceData.shopInfo.name.toLowerCase().replace(/ /g, '')}.vn</p>
          </div>
        </CustomScrollArea>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Đóng</Button>
          <Button onClick={handlePrintToPdf} disabled={isProcessing}>
            <Icon path={mdiPrinter} size={0.7} className="mr-2" />
            {isProcessing ? 'Đang xử lý...' : 'Lưu PDF & In'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog; 