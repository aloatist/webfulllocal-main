import { Suspense } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, Building2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const metadata = {
  title: 'Thông tin thanh toán | Cồn Phụng',
  description: 'Hướng dẫn thanh toán cho đơn hàng',
};

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-16 text-center">Đang tải...</div>}>
      <PaymentInfoContent />
    </Suspense>
  );
}

function PaymentInfoContent() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Info Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
            <Building2 className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Thông tin thanh toán
          </h1>
          <p className="text-lg text-muted-foreground">
            Hướng dẫn thanh toán cho đơn hàng của bạn
          </p>
        </div>

        {/* Alert */}
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lưu ý quan trọng</AlertTitle>
          <AlertDescription>
            Chúng tôi <strong>không hỗ trợ thanh toán trực tuyến</strong> qua website. 
            Vui lòng thanh toán qua chuyển khoản ngân hàng hoặc tiền mặt tại quầy.
          </AlertDescription>
        </Alert>

        {/* Bank Transfer Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin chuyển khoản ngân hàng</CardTitle>
            <CardDescription>
              Vui lòng chuyển khoản theo thông tin sau
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-sm">
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
            </div>
            <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Hướng dẫn thanh toán:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Vui lòng chuyển khoản đúng số tiền theo đơn hàng</li>
                <li>Ghi rõ mã đơn hàng (Booking ID) trong nội dung chuyển khoản</li>
                <li>Sau khi chuyển khoản, vui lòng liên hệ hotline <strong>0918.267.715</strong> hoặc gửi ảnh chụp biên lai chuyển khoản đến email <strong>conphungtourist87@gmail.com</strong></li>
                <li>Đơn hàng sẽ được xác nhận trong vòng 24 giờ sau khi nhận được thanh toán</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cần hỗ trợ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                <p className="text-sm font-medium">Hotline</p>
                  <a href="tel:+84918267715" className="text-sm text-primary hover:underline">
                    0918 267 715
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                <a href="mailto:conphungtourist87@gmail.com" className="text-sm text-primary hover:underline">
                  conphungtourist87@gmail.com
                  </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/phuong-thuc-thanh-toan">
              Xem thông tin thanh toán
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-muted rounded-lg text-center text-sm text-muted-foreground">
          <p>
            Nếu bạn có bất kỳ thắc mắc nào về thanh toán, vui lòng liên hệ với chúng tôi qua hotline hoặc email.
            Chúng tôi luôn sẵn sàng hỗ trợ bạn!
          </p>
        </div>
      </div>
    </div>
  );
}
