'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from "@/components/ui/button";
import { Icon } from '@mdi/react';
import { motion } from 'framer-motion';

interface QrCodeScannerProps {
  onQrCodeDetected: (qrCodeData: string) => void;
}

const QrCodeScanner = ({ onQrCodeDetected }: QrCodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null);

  const startScanner = () => {
    if (!hasStarted) {
      const qrScanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      qrScanner.render(
        (decodedText: string) => {
          onQrCodeDetected(decodedText);
          stopScanner();
          setIsOpen(false);
        },
        (errorMessage: string) => {
          console.error(errorMessage);
        }
      );

      qrScannerRef.current = qrScanner;
      setHasStarted(true);
    }
  };

  const stopScanner = () => {
    if (qrScannerRef.current && hasStarted) {
      qrScannerRef.current.clear();
      setHasStarted(false);
    }
  };

  useEffect(() => {
    // Khởi động scanner khi dialog mở
    if (isOpen) {
      // Đặt timeout để đảm bảo DOM đã render xong
      const timer = setTimeout(() => {
        startScanner();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Dừng scanner khi dialog đóng
      stopScanner();
    }
  }, [isOpen]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Icon path={mdiQrcodeScan} size={0.7} />
        <span>Quét mã QR</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Quét mã QR</DialogTitle>
            <DialogDescription>
              Quét mã QR trên sản phẩm để xem thông tin chi tiết hoặc thêm vào giỏ hàng nhanh.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div id="qr-reader" className="w-full max-w-sm mx-auto"></div>
                <div className="text-xs text-maintext mt-2 text-center">
                  Đặt mã QR vào ô quét và giữ yên thiết bị của bạn.
                </div>
              </motion.div>
            )}
          </div>
          <DialogFooter className="flex justify-between items-center">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              <Icon path={mdiClose} size={0.7} className="mr-2" />
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QrCodeScanner; 