'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, AlertCircle, Banknote, Wallet, CreditCard, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  bankName?: string | null;
  accountNumber?: string | null;
  accountHolder?: string | null;
  branch?: string | null;
  qrCode?: string | null;
  description?: string | null;
  instructions?: string | null;
}

interface PaymentMethodsProps {
  bookingId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'bank_transfer':
      return Building2;
    case 'cash':
      return Banknote;
    case 'e_wallet':
      return Wallet;
    case 'credit_card':
      return CreditCard;
    default:
      return Building2;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'bank_transfer':
      return 'Chuyển khoản ngân hàng';
    case 'cash':
      return 'Tiền mặt';
    case 'e_wallet':
      return 'Ví điện tử';
    case 'credit_card':
      return 'Thẻ tín dụng';
    default:
      return type;
  }
};

export function PaymentMethods({ bookingId, amount }: PaymentMethodsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/public/payment-methods');
      if (response.ok) {
      const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Fallback to default if no payment methods found
  const bankTransferMethods = paymentMethods.filter(m => m.type === 'bank_transfer');
  const otherMethods = paymentMethods.filter(m => m.type !== 'bank_transfer');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin thanh toán</CardTitle>
        <CardDescription>
          Số tiền cần thanh toán: <span className="font-bold text-lg">{amount.toLocaleString('vi-VN')} VNĐ</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lưu ý quan trọng</AlertTitle>
          <AlertDescription>
            Chúng tôi <strong>không hỗ trợ thanh toán trực tuyến</strong> qua website. 
            Vui lòng đặt hàng online và thanh toán qua chuyển khoản ngân hàng hoặc tiền mặt tại quầy.
          </AlertDescription>
        </Alert>

        {/* Bank Transfer Methods */}
        {bankTransferMethods.length > 0 ? (
          bankTransferMethods.map((method) => {
            const Icon = getTypeIcon(method.type);
            return (
              <div key={method.id} className="bg-muted p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{method.name}</h3>
                    {method.description && (
                      <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                    )}
                  </div>
                  <Badge variant="outline">{getTypeLabel(method.type)}</Badge>
                </div>
                <div className="space-y-3 text-sm">
                  {method.accountHolder && (
                    <div className="flex justify-between">
                      <span className="font-medium">Đơn vị thụ hưởng:</span>
                      <span className="text-right">{method.accountHolder}</span>
                    </div>
                  )}
                  {method.accountNumber && (
                    <div className="flex justify-between">
                      <span className="font-medium">Số tài khoản:</span>
                      <span className="font-bold text-primary font-mono">{method.accountNumber}</span>
                    </div>
                  )}
                  {method.bankName && (
                    <div className="flex justify-between">
                      <span className="font-medium">Ngân hàng:</span>
                      <span>{method.bankName}</span>
                    </div>
                  )}
                  {method.branch && (
                    <div className="flex justify-between">
                      <span className="font-medium">Chi nhánh:</span>
                      <span>{method.branch}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Số tiền:</span>
                    <span className="font-bold text-lg">{amount.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Nội dung chuyển khoản:</span>
                    <span className="font-mono text-xs break-all">{bookingId}</span>
                  </div>
                </div>
                {method.instructions && (
                  <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">Hướng dẫn thanh toán:</p>
                    <p className="whitespace-pre-line">{method.instructions}</p>
                  </div>
                )}
                {!method.instructions && (
                  <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">Hướng dẫn thanh toán:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Vui lòng chuyển khoản đúng số tiền: <strong>{amount.toLocaleString('vi-VN')} VNĐ</strong></li>
                      <li>Ghi rõ nội dung chuyển khoản: <strong>{bookingId}</strong></li>
                      <li>Sau khi chuyển khoản, vui lòng liên hệ hotline <strong>0918.267.715</strong> hoặc gửi ảnh chụp biên lai chuyển khoản đến email <strong>conphungtourist87@gmail.com</strong> để được xác nhận nhanh chóng.</li>
                      <li>Đơn hàng sẽ được xác nhận trong vòng 24 giờ sau khi nhận được thanh toán.</li>
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // Fallback to default if no payment methods
          <div className="bg-muted p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-lg">Thông tin chuyển khoản ngân hàng</h3>
          </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Đơn vị thụ hưởng:</span>
                <span className="text-right">CÔNG TY TNHH DU LỊCH DỊCH VỤ THƯƠNG MẠI CỒN PHỤNG</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Số tài khoản:</span>
                <span className="font-bold text-primary">7210783403</span>
          </div>
              <div className="flex justify-between">
                <span className="font-medium">Ngân hàng:</span>
                <span>BIDV chi nhánh Bến Tre</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Số tiền:</span>
                <span className="font-bold text-lg">{amount.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Nội dung chuyển khoản:</span>
                <span className="font-mono text-xs break-all">{bookingId}</span>
              </div>
            </div>
            <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Hướng dẫn thanh toán:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Vui lòng chuyển khoản đúng số tiền: <strong>{amount.toLocaleString('vi-VN')} VNĐ</strong></li>
                <li>Ghi rõ nội dung chuyển khoản: <strong>{bookingId}</strong></li>
                <li>Sau khi chuyển khoản, vui lòng liên hệ hotline <strong>0918.267.715</strong> hoặc gửi ảnh chụp biên lai chuyển khoản đến email <strong>conphungtourist87@gmail.com</strong> để được xác nhận nhanh chóng.</li>
                <li>Đơn hàng sẽ được xác nhận trong vòng 24 giờ sau khi nhận được thanh toán.</li>
              </ul>
          </div>
          </div>
        )}

        {/* Other Payment Methods */}
        {otherMethods.length > 0 && (
          <div className="space-y-4">
            {otherMethods.map((method) => {
              const Icon = getTypeIcon(method.type);
              return (
                <div key={method.id} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">{method.name}</h4>
                    <Badge variant="outline">{getTypeLabel(method.type)}</Badge>
                  </div>
                  {method.description && (
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  )}
                  {method.instructions && (
                    <div className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                      {method.instructions}
                    </div>
                  )}
            </div>
              );
            })}
          </div>
        )}

        {/* Cash Payment Option */}
        {otherMethods.filter(m => m.type === 'cash').length === 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">💡 Phương thức thanh toán khác:</p>
            <p className="text-muted-foreground">
              Bạn cũng có thể thanh toán trực tiếp bằng tiền mặt tại quầy vé hoặc văn phòng giao dịch của chúng tôi. 
              Vui lòng yêu cầu biên lai để đảm bảo quyền lợi.
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Bằng việc đặt hàng, bạn đồng ý với{' '}
          <a href="/chinh-sach-quy-dinh-chung" className="underline">
            Chính sách và quy định chung
          </a>{' '}
          của chúng tôi
        </p>
      </CardContent>
    </Card>
  );
}
