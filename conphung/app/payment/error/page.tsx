import { Suspense } from 'react';
import Link from 'next/link';
import { XCircle, Home, RefreshCw, Phone, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const metadata = {
  title: 'Thanh toán thất bại | Cồn Phụng',
  description: 'Giao dịch không thành công',
};

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-16 text-center">Đang tải...</div>}>
      <PaymentErrorContent />
    </Suspense>
  );
}

function PaymentErrorContent() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Thanh toán thất bại
          </h1>
          <p className="text-lg text-muted-foreground">
            Giao dịch không thành công. Vui lòng thử lại.
          </p>
        </div>

        {/* Error Alert */}
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi thanh toán</AlertTitle>
          <AlertDescription>
            Giao dịch của bạn không được xử lý thành công. Vui lòng kiểm tra thông tin thanh toán và thử lại.
          </AlertDescription>
        </Alert>

        {/* Common Reasons Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nguyên nhân thường gặp</CardTitle>
            <CardDescription>
              Một số lý do có thể khiến giao dịch thất bại
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Số dư tài khoản không đủ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Thông tin thẻ không chính xác</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Thẻ đã hết hạn hoặc bị khóa</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Vượt quá hạn mức giao dịch trong ngày</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Hủy giao dịch trong quá trình thanh toán</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Lỗi kết nối mạng</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* What to do Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bạn có thể làm gì?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Thử lại thanh toán</p>
                <p className="text-sm text-muted-foreground">
                  Kiểm tra thông tin và thử thanh toán lại
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Liên hệ ngân hàng</p>
                <p className="text-sm text-muted-foreground">
                  Kiểm tra tài khoản và hạn mức giao dịch
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Chọn phương thức khác</p>
                <p className="text-sm text-muted-foreground">
                  Thử thanh toán bằng phương thức khác (QR, chuyển khoản...)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cần hỗ trợ?</CardTitle>
            <CardDescription>
              Chúng tôi luôn sẵn sàng giúp đỡ bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Hotline hỗ trợ</p>
                  <a href="tel:+84918267715" className="text-sm text-primary hover:underline">
                    0918 267 715
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a href="mailto:info@conphungtourist.com" className="text-sm text-primary hover:underline">
                    info@conphungtourist.com
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/tours">
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/lien-he">
              <Phone className="w-4 h-4 mr-2" />
              Liên hệ hỗ trợ
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
        <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
          <p className="text-center">
            <strong>Lưu ý:</strong> Nếu số tiền đã bị trừ khỏi tài khoản nhưng giao dịch thất bại, 
            số tiền sẽ được hoàn lại trong vòng 1-3 ngày làm việc. 
            Vui lòng liên hệ với chúng tôi nếu cần hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  );
}
