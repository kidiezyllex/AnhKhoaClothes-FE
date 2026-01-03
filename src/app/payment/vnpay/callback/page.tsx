'use client';

import { useEffect, useState, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { updateOrderPayment } from '@/services/order';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function VNPayCallbackContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        const orderId = localStorage.getItem('pendingOrderId');
        if (!orderId) {
          throw new Error('Không tìm thấy thông tin đơn hàng');
        }

        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus');

        const response = await updateOrderPayment(orderId, {
          vnp_ResponseCode,
          vnp_TransactionStatus,
          ...Object.fromEntries(searchParams.entries())
        });

        if (!response.success) {
          throw new Error(response.message || 'Không thể cập nhật trạng thái thanh toán');
        }

        // Xóa orderId khỏi localStorage
        localStorage.removeItem('pendingOrderId');

        // Kiểm tra kết quả thanh toán
        if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
          showToast({
            title: "Thành công",
            message: "Thanh toán thành công",
            type: "success"
          });
          navigate(`/checkout/success?orderId=${orderId}`);
        } else {
          throw new Error('Thanh toán không thành công');
        }
      } catch (error: any) {
        console.error('Payment processing error:', error);
        showToast({
          title: "Lỗi",
          message: error.message || "Đã có lỗi xảy ra khi xử lý thanh toán",
          type: "error"
        });
        navigate('/orders');
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentResult();
  }, [navigate, searchParams, showToast]);

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Xử lý thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {isProcessing ? (
              <p className="text-muted-foreground">Đang xử lý kết quả thanh toán...</p>
            ) : (
              <p className="text-muted-foreground">
                Vui lòng đợi trong giây lát...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VNPayCallbackPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <VNPayCallbackContent />
    </Suspense>
  );
} 