'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { mdiCheckCircle } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderCode?: string;
}

export default function SuccessModal({ isOpen, onClose, orderId, orderCode }: SuccessModalProps) {
  const navigate = useNavigate();

  const handleViewOrder = () => {
    onClose();
    navigate('/account#account-tabs?tab=orders');
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/products');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Đặt hàng thành công</DialogTitle>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Đặt hàng thành công!</h2>
          </CardHeader>
          
          <CardContent className="space-y-4 text-center">
            <p className="text-maintext">Cảm ơn bạn đã đặt hàng tại Clothes Shop</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-maintext mb-1">Mã đơn hàng của bạn là:</p>
              <p className="font-bold text-lg text-maintext">{orderCode || orderId}</p>
            </div>
            <p className="text-sm text-maintext">
              Chúng tôi sẽ sớm liên hệ với bạn để xác nhận đơn hàng
            </p>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button 
              onClick={handleViewOrder} 
              className="w-full"
              variant="default"
            >
              Xem đơn hàng
            </Button>
            <Button 
              onClick={handleContinueShopping} 
              className="w-full"
              variant="outline"
            >
              Tiếp tục mua sắm
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
} 