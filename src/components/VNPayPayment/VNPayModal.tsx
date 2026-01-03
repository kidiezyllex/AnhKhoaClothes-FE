'use client';

import { useState, useEffect, useMemo } from 'react';
 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@mdi/react';
import { 
  mdiBank, 
  mdiShield, 
  mdiLoading, 
  mdiCheckCircle, 
  mdiClose,
  mdiMagnify,
  mdiArrowLeft,
  mdiLock,
  mdiCellphone
} from '@mdi/js';
import { toast } from 'react-toastify';
import { formatPrice } from '@/utils/formatters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string;
}

interface VNPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    orderId: string;
    amount: number;
    orderInfo: string;
    orderCode?: string;
  };
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

type PaymentStep = 'bank-selection' | 'account-input' | 'otp-verification' | 'processing' | 'success' | 'error';

export default function VNPayModal({ 
  isOpen, 
  onClose, 
  orderData, 
  onPaymentSuccess, 
  onPaymentError 
}: VNPayModalProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<PaymentStep>('bank-selection');
  const [paymentResult, setPaymentResult] = useState<any>(null);
  
  // Account input fields
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  
  // OTP fields
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // Filter banks based on search term
  const filteredBanks = useMemo(() => {
    if (!searchTerm) return banks;
    
    const term = searchTerm.toLowerCase();
    return banks.filter(bank => 
      bank.name.toLowerCase().includes(term) ||
      bank.shortName.toLowerCase().includes(term) ||
      bank.code.toLowerCase().includes(term)
    );
  }, [banks, searchTerm]);

  // Fetch banks from VietQR API
  useEffect(() => {
    if (isOpen) {
      fetchBanks();
    }
  }, [isOpen]);

  // OTP timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentStep === 'otp-verification' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [currentStep, otpTimer]);

  const fetchBanks = async () => {
    try {
      setIsLoadingBanks(true);
      const response = await fetch('https://api.vietqr.io/v2/banks');
      const result = await response.json();
      
      if (result.code === '00' && result.data) {
        // Filter banks that support transfer
        const supportedBanks = result.data.filter((bank: Bank) => bank.transferSupported === 1);
        setBanks(supportedBanks);
      } else {
        throw new Error('Không thể tải danh sách ngân hàng');
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      toast.error('Không thể tải danh sách ngân hàng');
      // Fallback to some popular banks
      setBanks([
        {
          id: 1,
          name: 'Ngân hàng TMCP Công thương Việt Nam',
          code: 'ICB',
          bin: '970415',
          shortName: 'VietinBank',
          logo: 'https://api.vietqr.io/img/ICB.png',
          transferSupported: 1,
          lookupSupported: 1,
          short_name: 'VietinBank',
          support: 3,
          isTransfer: 1,
          swift_code: 'ICBVVNVX'
        },
        {
          id: 2,
          name: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
          code: 'VCB',
          bin: '970436',
          shortName: 'Vietcombank',
          logo: 'https://api.vietqr.io/img/VCB.png',
          transferSupported: 1,
          lookupSupported: 1,
          short_name: 'Vietcombank',
          support: 3,
          isTransfer: 1,
          swift_code: 'BFTVVNVX'
        },
        {
          id: 3,
          name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
          code: 'BIDV',
          bin: '970418',
          shortName: 'BIDV',
          logo: 'https://api.vietqr.io/img/BIDV.png',
          transferSupported: 1,
          lookupSupported: 1,
          short_name: 'BIDV',
          support: 3,
          isTransfer: 1,
          swift_code: 'BIDVVNVX'
        }
      ]);
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setCurrentStep('account-input');
  };

  const handleAccountSubmit = () => {
    if (!accountNumber || accountNumber.length < 8) {
      toast.error('Vui lòng nhập số tài khoản hợp lệ (ít nhất 8 số)');
      return;
    }

    // Simulate account verification
    setIsProcessing(true);
    setTimeout(() => {
      setAccountHolder('NGUYEN VAN A'); // Simulated account holder name
      setCurrentStep('otp-verification');
      setOtpTimer(60);
      setCanResendOtp(false);
      setIsProcessing(false);
      toast.success('Mã OTP đã được gửi đến số điện thoại của bạn');
    }, 2000);
  };

  const handleOtpSubmit = () => {
    if (!otpCode || otpCode.length !== 4) {
      toast.error('Vui lòng nhập mã OTP 4 số');
      return;
    }

    if (otpCode !== '1234') {
      toast.error('Mã OTP không chính xác');
      return;
    }

    processPayment();
  };

  const processPayment = async () => {
    try {
      setIsProcessing(true);
      setCurrentStep('processing');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate random success/failure (95% success rate)
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        const paymentData = {
          orderId: orderData.orderId,
          amount: orderData.amount,
          bankCode: selectedBank?.code,
          bankName: selectedBank?.shortName,
          accountNumber: accountNumber,
          transactionId: `VNP${Date.now()}`,
          paymentTime: new Date().toISOString(),
          status: 'SUCCESS'
        };
        
        setPaymentResult(paymentData);
        setCurrentStep('success');
        
        // Call success callback after a short delay
        setTimeout(() => {
          onPaymentSuccess(paymentData);
        }, 2000);
      } else {
        setCurrentStep('error');
        setTimeout(() => {
          onPaymentError('Giao dịch không thành công. Vui lòng thử lại.');
        }, 2000);
      }
    } catch (error) {
      setCurrentStep('error');
      onPaymentError('Đã xảy ra lỗi trong quá trình thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResendOtp = () => {
    setOtpTimer(60);
    setCanResendOtp(false);
    setOtpCode('');
    toast.success('Mã OTP mới đã được gửi');
  };

  const handleClose = () => {
    if (currentStep !== 'processing') {
      resetModal();
      onClose();
    }
  };

  const resetModal = () => {
    setCurrentStep('bank-selection');
    setSelectedBank(null);
    setSearchTerm('');
    setAccountNumber('');
    setAccountHolder('');
    setOtpCode('');
    setOtpTimer(60);
    setCanResendOtp(false);
    setPaymentResult(null);
  };

  const goBack = () => {
    switch (currentStep) {
      case 'account-input':
        setCurrentStep('bank-selection');
        setSelectedBank(null);
        break;
      case 'otp-verification':
        setCurrentStep('account-input');
        setOtpCode('');
        break;
      case 'error':
        setCurrentStep('bank-selection');
        resetModal();
        break;
    }
  };

  const renderOrderInfo = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">Thông tin đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-maintext">Mã đơn hàng:</span>
          <span className="font-medium text-maintext">{orderData.orderCode || orderData.orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-maintext">Số tiền:</span>
          <span className="font-bold text-lg text-red-600">{formatPrice(orderData.amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-maintext">Nội dung:</span>
          <span className="font-medium text-right max-w-[200px] truncate text-maintext">{orderData.orderInfo}</span>
        </div>
      </CardContent>
    </Card>
  );

  const renderBankSelection = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
         <img
         draggable="false"
         src="/images/vnpay-logo.png" alt="bank" width={500} height={500} className='h-16 object-contain w-auto' />
        </div>
        <h3 className="text-lg font-semibold mb-2">Thanh toán qua VNPay</h3>
        <p className="text-maintext">Chọn ngân hàng để thực hiện thanh toán</p>
      </div>

      {renderOrderInfo()}

      <div>
        <Label htmlFor="bank-search" className="text-sm font-medium mb-3 block">
          Tìm kiếm ngân hàng
        </Label>
        <div className="relative mb-4">
          <Icon path={mdiMagnify} size={0.7} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext" />
          <Input
            id="bank-search"
            placeholder="Tìm theo tên ngân hàng, mã ngân hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">
          Chọn ngân hàng ({filteredBanks.length} ngân hàng)
        </Label>
        {isLoadingBanks ? (
          <div className="flex items-center justify-center py-8">
            <Icon path={mdiLoading} size={1} className="animate-spin text-blue-600" />
            <span className="ml-2">Đang tải danh sách ngân hàng...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto border rounded-lg p-2">
            {filteredBanks.length === 0 ? (
              <div className="text-center py-8 text-maintext">
                Không tìm thấy ngân hàng nào
              </div>
            ) : (
              filteredBanks.map((bank) => (
                <div
                  key={bank.code}
                  className="border rounded-lg p-3 cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50"
                  onClick={() => handleBankSelect(bank)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <img
                        src={bank.logo}
                        alt={bank.shortName}
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{bank.shortName}</div>
                      <div className="text-xs text-maintext truncate">{bank.name}</div>
                      <div className="text-xs text-blue-600">Mã: {bank.code}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-2 text-sm text-maintext">
        <Icon path={mdiShield} size={0.7} />
        <span>Giao dịch được bảo mật bởi VNPay</span>
      </div>
    </div>
  );

  const renderAccountInput = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <img src="/images/vnpay-logo.png" alt="bank" width={500} height={500} className='h-10 object-contain w-auto' />
        </div>
        <h3 className="text-lg font-semibold mb-2">Thông tin tài khoản</h3>
        <p className="text-maintext">Nhập thông tin tài khoản ngân hàng</p>
      </div>

      {renderOrderInfo()}

      {selectedBank && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 relative">
                <img
                  src={selectedBank.logo}
                  alt={selectedBank.shortName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-medium">{selectedBank.shortName}</div>
                <div className="text-sm text-maintext">{selectedBank.name}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="account-number" className="text-sm font-medium mb-2 block">
            Số tài khoản <span className="text-red-500">*</span>
          </Label>
          <Input
            id="account-number"
            placeholder="Nhập số tài khoản (ví dụ: 1234567890)"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
            maxLength={20}
          />
        </div>
        {accountHolder && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Chủ tài khoản</Label>
            <Input value={accountHolder} disabled />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-2 text-xs text-maintext">
        <Icon path={mdiLock} size={0.7} />
        <span>Thông tin được mã hóa và bảo mật</span>
      </div>
    </div>
  );

  const renderOtpVerification = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Icon path={mdiCellphone} size={1.5} className="text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Xác thực OTP</h3>
        <p className="text-maintext">Nhập mã OTP được gửi đến số điện thoại của bạn</p>
      </div>

      {renderOrderInfo()}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <Icon path={mdiCellphone} size={1} className="text-blue-600" />
          <div>
            <p className="text-sm font-medium">Mã OTP đã được gửi đến</p>
            <p className="text-sm text-maintext">*******890</p>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="otp-code" className="text-sm font-medium mb-2 block">
          Mã OTP <span className="text-red-500">*</span>
        </Label>
        <Input
          id="otp-code"
          placeholder="Nhập mã OTP 4 số"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
          maxLength={4}
          className="text-center text-lg tracking-widest"
        />
      </div>

      <div className="text-center">
        {otpTimer > 0 ? (
          <p className="text-sm text-maintext">
            Gửi lại mã sau {otpTimer}s
          </p>
        ) : (
          <Button
            variant="link"
            onClick={handleResendOtp}
            disabled={!canResendOtp}
            className="text-blue-600 p-0 h-auto"
          >
            Gửi lại mã OTP
          </Button>
        )}
      </div>

      <div className="flex items-center justify-center space-x-2 text-xs text-maintext">
        <Icon path={mdiShield} size={0.7} />
        <span>Mã OTP có hiệu lực trong 5 phút</span>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center py-8">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-blue-100 p-4 rounded-full">
          <Icon path={mdiLoading} size={2} className="text-blue-600 animate-spin" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">Đang xử lý thanh toán</h3>
      <p className="text-maintext mb-4">Vui lòng không đóng cửa sổ này</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          Đang kết nối với ngân hàng {selectedBank?.shortName}...
        </p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-green-100 p-4 rounded-full">
          <Icon path={mdiCheckCircle} size={2} className="text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-primary">Thanh toán thành công!</h3>
      <p className="text-maintext mb-4">Đơn hàng của bạn đã được thanh toán thành công</p>
      {paymentResult && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Mã giao dịch:</span>
                <span className="font-medium">{paymentResult.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span>Ngân hàng:</span>
                <span className="font-medium">{paymentResult.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span>Số tài khoản:</span>
                <span className="font-medium">***{paymentResult.accountNumber.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Số tiền:</span>
                <span className="font-medium">{formatPrice(paymentResult.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian:</span>
                <span className="font-medium">
                  {new Date(paymentResult.paymentTime).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderError = () => (
    <div className="text-center py-8">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-red-100 p-4 rounded-full">
          <Icon path={mdiClose} size={2} className="text-red-600" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-red-600">Thanh toán thất bại</h3>
      <p className="text-maintext mb-4">Giao dịch không thể hoàn tất. Vui lòng thử lại.</p>
      <Button onClick={goBack} variant="outline">
        Thử lại
      </Button>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'bank-selection':
        return renderBankSelection();
      case 'account-input':
        return renderAccountInput();
      case 'otp-verification':
        return renderOtpVerification();
      case 'processing':
        return renderProcessing();
      case 'success':
        return renderSuccess();
      case 'error':
        return renderError();
      default:
        return renderBankSelection();
    }
  };

  const renderActionButtons = () => {
    if (currentStep === 'processing' || currentStep === 'success') {
      return null;
    }

    if (currentStep === 'error') {
      return (
        <div className="flex space-x-4 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Đóng
          </Button>
        </div>
      );
    }

    return (
      <div className="flex space-x-4 pt-4">
        {(currentStep === 'account-input' || currentStep === 'otp-verification') && (
          <Button variant="outline" onClick={goBack} className="w-32">
            <Icon path={mdiArrowLeft} size={0.7} className="mr-2" />
            Quay lại
          </Button>
        )}
        
       <div className='w-full flex justify-end'>
       {currentStep === 'bank-selection' && (
          <Button variant="default" onClick={handleClose} className='w-32'>
            Hủy
          </Button>
        )}
       </div>

        {currentStep === 'account-input' && (
          <Button 
            onClick={handleAccountSubmit} 
            disabled={!accountNumber || accountNumber.length < 8 || isProcessing}
            className="w-32"
          >
            {isProcessing ? 'Đang xử lý...' : 'Tiếp tục'}
          </Button>
        )}

        {currentStep === 'otp-verification' && (
          <Button 
            onClick={handleOtpSubmit} 
            disabled={!otpCode || otpCode.length !== 4 || isProcessing}
            className="flex-1"
          >
            {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Icon path={mdiBank} size={1} className="text-blue-600" />
            <span>VNPay - Cổng thanh toán</span>
          </DialogTitle>
        </DialogHeader>

        {renderStepContent()}
        {renderActionButtons()}
      </DialogContent>
    </Dialog>
  );
} 