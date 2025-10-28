import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Home, Calendar, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Thanh toán thành công | Cồn Phụng',
  description: 'Đặt tour thành công',
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-16 text-center">Đang tải...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-lg text-muted-foreground">
            Cảm ơn bạn đã đặt tour tại Cồn Phụng
          </p>
        </div>

        {/* Booking Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin đặt tour</CardTitle>
            <CardDescription>
              Chúng tôi đã gửi email xác nhận đến địa chỉ của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Ngày khởi hành</p>
                  <p className="text-sm text-muted-foreground">
                    Vui lòng kiểm tra email để biết chi tiết
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email xác nhận</p>
                  <p className="text-sm text-muted-foreground">
                    Đã gửi đến email của bạn
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Bước tiếp theo:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">1.</span>
                  <span>Kiểm tra email xác nhận (bao gồm cả thư mục spam)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">2.</span>
                  <span>Lưu lại mã đặt tour để tra cứu</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  <span>Chúng tôi sẽ liên hệ với bạn trước ngày khởi hành 1-2 ngày</span>
                </li>
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
                <a href="mailto:info@conphungtourist.com" className="text-sm text-primary hover:underline">
                  info@conphungtourist.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/tours">
              <Calendar className="w-4 h-4 mr-2" />
              Xem thêm tour
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-muted rounded-lg text-center text-sm text-muted-foreground">
          <p>
            Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua hotline hoặc email.
            Chúng tôi luôn sẵn sàng hỗ trợ bạn!
          </p>
        </div>
      </div>
    </div>
  );
}
