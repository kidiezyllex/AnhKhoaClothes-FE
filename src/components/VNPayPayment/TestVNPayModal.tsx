'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import VNPayModal from './VNPayModal';

export default function TestVNPayModal() {
  const [showModal, setShowModal] = useState(false);

  const testOrderData = {
    orderId: 'TEST_123',
    amount: 1000000,
    orderInfo: 'Test payment',
    orderCode: 'TEST_CODE'
  };

  const handleSuccess = (paymentData: any) => {
    setShowModal(false);
  };

  const handleError = (error: string) => {
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <Button onClick={() => setShowModal(true)}>
        Test VNPay Modal
      </Button>
      
      <VNPayModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        orderData={testOrderData}
        onPaymentSuccess={handleSuccess}
        onPaymentError={handleError}
      />
    </div>
  );
} 