'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, Building2, Smartphone, QrCode } from 'lucide-react';
import { VNPayBankCodes } from '@/lib/payment/vnpay';

interface PaymentMethodsProps {
  bookingId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentMethods({ bookingId, amount, onSuccess, onError }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('vnpay-qr');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Determine bank code based on selected method
      let bankCode = '';
      if (selectedMethod === 'vnpay-qr') {
        bankCode = VNPayBankCodes.VNPAYQR;
      } else if (selectedMethod === 'vnpay-atm') {
        bankCode = selectedBank || VNPayBankCodes.VNBANK;
      } else if (selectedMethod === 'vnpay-card') {
        bankCode = VNPayBankCodes.INTCARD;
      }

      // Create payment
      const response = await fetch('/api/payment/vnpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          amount,
          orderInfo: `Thanh toán đặt tour - ${bookingId}`,
          bankCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Redirect to payment URL
      window.location.href = data.paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error instanceof Error ? error.message : 'Có lỗi xảy ra');
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chọn phương thức thanh toán</CardTitle>
        <CardDescription>
          Số tiền cần thanh toán: <span className="font-bold text-lg">{amount.toLocaleString('vi-VN')} VNĐ</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          {/* VNPay QR Code */}
          <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer">
            <RadioGroupItem value="vnpay-qr" id="vnpay-qr" />
            <Label htmlFor="vnpay-qr" className="flex items-center gap-3 cursor-pointer flex-1">
              <QrCode className="h-6 w-6" />
              <div>
                <div className="font-medium">Quét mã QR</div>
                <div className="text-sm text-muted-foreground">Thanh toán nhanh bằng ứng dụng ngân hàng</div>
              </div>
            </Label>
          </div>

          {/* ATM Card */}
          <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer">
            <RadioGroupItem value="vnpay-atm" id="vnpay-atm" />
            <Label htmlFor="vnpay-atm" className="flex items-center gap-3 cursor-pointer flex-1">
              <CreditCard className="h-6 w-6" />
              <div>
                <div className="font-medium">Thẻ ATM nội địa</div>
                <div className="text-sm text-muted-foreground">Thanh toán bằng thẻ ATM/Internet Banking</div>
              </div>
            </Label>
          </div>

          {/* International Card */}
          <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer">
            <RadioGroupItem value="vnpay-card" id="vnpay-card" />
            <Label htmlFor="vnpay-card" className="flex items-center gap-3 cursor-pointer flex-1">
              <CreditCard className="h-6 w-6" />
              <div>
                <div className="font-medium">Thẻ quốc tế</div>
                <div className="text-sm text-muted-foreground">Visa, Mastercard, JCB, UnionPay</div>
              </div>
            </Label>
          </div>

          {/* Bank Transfer */}
          <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer">
            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
            <Label htmlFor="bank-transfer" className="flex items-center gap-3 cursor-pointer flex-1">
              <Building2 className="h-6 w-6" />
              <div>
                <div className="font-medium">Chuyển khoản ngân hàng</div>
                <div className="text-sm text-muted-foreground">Chuyển khoản thủ công qua ngân hàng</div>
              </div>
            </Label>
          </div>

          {/* MoMo */}
          <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer">
            <RadioGroupItem value="momo" id="momo" />
            <Label htmlFor="momo" className="flex items-center gap-3 cursor-pointer flex-1">
              <Smartphone className="h-6 w-6" />
              <div>
                <div className="font-medium">Ví MoMo</div>
                <div className="text-sm text-muted-foreground">Thanh toán qua ví điện tử MoMo</div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Bank selection for ATM */}
        {selectedMethod === 'vnpay-atm' && (
          <div className="space-y-2">
            <Label>Chọn ngân hàng</Label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">Tất cả ngân hàng</option>
              <option value={VNPayBankCodes.VIETCOMBANK}>Vietcombank</option>
              <option value={VNPayBankCodes.VIETINBANK}>VietinBank</option>
              <option value={VNPayBankCodes.BIDV}>BIDV</option>
              <option value={VNPayBankCodes.AGRIBANK}>Agribank</option>
              <option value={VNPayBankCodes.TECHCOMBANK}>Techcombank</option>
              <option value={VNPayBankCodes.ACB}>ACB</option>
              <option value={VNPayBankCodes.MB}>MB Bank</option>
              <option value={VNPayBankCodes.VPBANK}>VPBank</option>
              <option value={VNPayBankCodes.TPBank}>TPBank</option>
              <option value={VNPayBankCodes.SACOMBANK}>Sacombank</option>
            </select>
          </div>
        )}

        {/* Bank transfer info */}
        {selectedMethod === 'bank-transfer' && (
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p className="font-medium">Thông tin chuyển khoản:</p>
            <div className="space-y-1">
              <p><strong>Ngân hàng:</strong> Vietcombank</p>
              <p><strong>Số tài khoản:</strong> 1234567890</p>
              <p><strong>Chủ tài khoản:</strong> CÔNG TY DU LỊCH CỒN PHỤNG</p>
              <p><strong>Nội dung:</strong> {bookingId}</p>
              <p><strong>Số tiền:</strong> {amount.toLocaleString('vi-VN')} VNĐ</p>
            </div>
            <p className="text-muted-foreground mt-2">
              * Vui lòng chuyển khoản đúng số tiền và ghi đúng nội dung để được xác nhận nhanh chóng
            </p>
          </div>
        )}

        {/* MoMo info */}
        {selectedMethod === 'momo' && (
          <div className="bg-muted p-4 rounded-lg text-sm text-center">
            <p className="text-muted-foreground">Tính năng thanh toán MoMo đang được phát triển</p>
          </div>
        )}

        <Button
          onClick={handlePayment}
          disabled={isProcessing || selectedMethod === 'momo'}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Thanh toán ngay'
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Bằng việc nhấn &quot;Thanh toán ngay&quot;, bạn đồng ý với{' '}
          <a href="/chinh-sach-thanh-toan" className="underline">
            Chính sách thanh toán
          </a>{' '}
          của chúng tôi
        </p>
      </CardContent>
    </Card>
  );
}
