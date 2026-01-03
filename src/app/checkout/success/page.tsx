'use client';

import { useEffect, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <div className="container max-w-lg py-16 mx-auto">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Đặt hàng thành công!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Cảm ơn bạn đã đặt hàng tại Clothes Shop</p>
          <p className="text-muted-foreground">
            Mã đơn hàng của bạn là: <span className="font-medium text-foreground">{orderId}</span>
          </p>
          <p className="text-muted-foreground">
            Chúng tôi sẽ sớm liên hệ với bạn để xác nhận đơn hàng
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/account#account-tabs?tab=orders')}>
            Xem đơn hàng
          </Button>
          <Button onClick={() => navigate('/products')}>
            Tiếp tục mua sắm
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <div className='h-screen w-full flex items-center justify-center'>
      <SuccessContent />
      </div>
    </Suspense>
  );
} 