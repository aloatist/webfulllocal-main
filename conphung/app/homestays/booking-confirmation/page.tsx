import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Section, Container } from '@/components/craft';
import Loader from '@/components/Loader';
import { CheckCircle, Calendar, Users, MapPin, Phone, Mail, Home } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PageProps {
  searchParams: {
    reference?: string;
  };
}

export const metadata = {
  title: 'Xác Nhận Đặt Phòng | Khu Du Lịch Cồn Phụng',
  description: 'Đặt phòng homestay thành công',
};

export default async function BookingConfirmationPage({ searchParams }: PageProps) {
  if (!searchParams.reference) {
    notFound();
  }

  const booking = await prisma.homestayBooking.findUnique({
    where: { reference: searchParams.reference },
    include: {
      Homestay: {
        select: {
          title: true,
          slug: true,
          heroImageUrl: true,
          city: true,
          country: true,
          contactPhone: true,
          contactEmail: true,
        },
      },
      HomestayRoom: {
        select: {
          name: true,
        },
      },
      Customer: {
        select: {
          fullName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!booking || !booking.Customer) {
    notFound();
  }

  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  return (
    <Section className="py-12">
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Success Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Đặt Phòng Thành Công!</h1>
            <p className="text-lg text-muted-foreground">
              Cảm ơn bạn đã đặt phòng tại Cồn Phụng
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="rounded-xl border bg-card p-6 shadow-lg space-y-6">
            {/* Reference Number */}
            <div className="border-b pb-4">
              <p className="text-sm text-muted-foreground">Mã đặt phòng</p>
              <p className="text-2xl font-bold">{booking.reference}</p>
            </div>

            {/* Homestay Info */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Home className="h-5 w-5" />
                Thông tin homestay
              </h2>
              <div className="space-y-2">
                <p className="font-medium">{booking.Homestay.title}</p>
                {booking.HomestayRoom && (
                  <p className="text-sm text-muted-foreground">
                    Phòng: {booking.HomestayRoom.name}
                  </p>
                )}
                {booking.Homestay.city && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {booking.Homestay.city}
                      {booking.Homestay.country && `, ${booking.Homestay.country}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Dates */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Calendar className="h-5 w-5" />
                Thời gian lưu trú
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-medium">
                    {format(new Date(booking.checkIn), 'EEEE, dd MMMM yyyy', { locale: vi })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-medium">
                    {format(new Date(booking.checkOut), 'EEEE, dd MMMM yyyy', { locale: vi })}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Tổng số đêm: {nights}
              </p>
            </div>

            {/* Guest Info */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Users className="h-5 w-5" />
                Thông tin khách
              </h2>
              <div className="space-y-2">
                <p className="font-medium">{booking.Customer.fullName}</p>
                {booking.Customer.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{booking.Customer.email}</span>
                  </div>
                )}
                {booking.Customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{booking.Customer.phone}</span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Người lớn: {booking.adults} | Trẻ em: {booking.children} | Em bé: {booking.infants}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t pt-4">
              <h2 className="mb-3 text-lg font-semibold">Thanh toán</h2>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tổng tiền</span>
                <span className="text-2xl font-bold">
                  {Number(booking.totalAmount).toLocaleString('vi-VN')} {booking.currency}
                </span>
              </div>
              <div className="mt-3 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                <p className="font-medium">Trạng thái: Chờ xác nhận</p>
                <p className="mt-1">
                  Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận và hướng dẫn thanh toán.
                </p>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="border-t pt-4">
                <h2 className="mb-2 text-lg font-semibold">Yêu cầu đặc biệt</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {booking.specialRequests}
                </p>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="mt-8 rounded-xl bg-muted p-6">
            <h2 className="mb-4 text-lg font-semibold">Các bước tiếp theo</h2>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  1
                </span>
                <div>
                  <p className="font-medium">Kiểm tra email</p>
                  <p className="text-sm text-muted-foreground">
                    Chúng tôi đã gửi email xác nhận đến {booking.Customer.email}
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  2
                </span>
                <div>
                  <p className="font-medium">Chờ xác nhận</p>
                  <p className="text-sm text-muted-foreground">
                    Đội ngũ của chúng tôi sẽ liên hệ với bạn trong vòng 24h
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  3
                </span>
                <div>
                  <p className="font-medium">Thanh toán</p>
                  <p className="text-sm text-muted-foreground">
                    Làm theo hướng dẫn thanh toán từ nhân viên
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  4
                </span>
                <div>
                  <p className="font-medium">Chuẩn bị cho chuyến đi</p>
                  <p className="text-sm text-muted-foreground">
                    Chúng tôi sẽ gửi thông tin chi tiết trước ngày check-in
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Contact Info */}
          <div className="mt-6 text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              Có thắc mắc? Liên hệ với chúng tôi:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {booking.Homestay.contactPhone && (
                <a
                  href={`tel:${booking.Homestay.contactPhone}`}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {booking.Homestay.contactPhone}
                </a>
              )}
              {booking.Homestay.contactEmail && (
                <a
                  href={`mailto:${booking.Homestay.contactEmail}`}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {booking.Homestay.contactEmail}
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href={`/homestays/${booking.Homestay.slug}`}
              className="rounded-lg border px-6 py-2 font-medium hover:bg-muted"
            >
              Xem lại homestay
            </Link>
            <Link
              href="/homestays"
              className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Khám phá thêm homestay
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
