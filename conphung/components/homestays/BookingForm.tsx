'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Loader2, AlertCircle } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BookingFormProps {
  homestay: {
    id: string;
    slug: string;
    title: string;
    basePrice: any;
    currency: string;
    cleaningFee?: any;
    minNights?: number | null;
    maxGuests?: number | null;
  };
  rooms: Array<{
    id: string;
    name: string;
    slug: string;
    basePrice: any;
    maxGuests: number | null;
  }>;
}

export function BookingForm({ homestay, rooms }: BookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    infants: 0,
    roomId: rooms.length > 0 ? rooms[0].id : '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: '',
  });

  const minDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const minCheckOut = formData.checkIn 
    ? format(addDays(new Date(formData.checkIn), homestay.minNights || 1), 'yyyy-MM-dd')
    : minDate;

  // Calculate nights
  const nights = formData.checkIn && formData.checkOut
    ? differenceInDays(new Date(formData.checkOut), new Date(formData.checkIn))
    : 0;

  // Calculate total guests
  const totalGuests = formData.adults + formData.children;

  // Calculate price
  const selectedRoom = rooms.find(r => r.id === formData.roomId);
  const nightlyRate = selectedRoom?.basePrice || homestay.basePrice || 0;
  const subtotal = Number(nightlyRate) * nights;
  const cleaningFee = Number(homestay.cleaningFee || 0);
  const total = subtotal + cleaningFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.checkIn || !formData.checkOut) {
      setError('Vui lòng chọn ngày check-in và check-out');
      return;
    }

    if (nights < (homestay.minNights || 1)) {
      setError(`Số đêm tối thiểu là ${homestay.minNights || 1}`);
      return;
    }

    if (homestay.maxGuests && totalGuests > homestay.maxGuests) {
      setError(`Số khách tối đa là ${homestay.maxGuests}`);
      return;
    }

    if (!formData.customerName.trim()) {
      setError('Vui lòng nhập họ tên');
      return;
    }

    if (!formData.customerEmail.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    if (!formData.customerPhone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/public/homestays/${homestay.slug}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: formData.roomId || null,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          totalAmount: total,
          customerName: formData.customerName.trim(),
          customerEmail: formData.customerEmail.trim(),
          customerPhone: formData.customerPhone.trim(),
          specialRequests: formData.specialRequests.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đặt phòng thất bại');
      }

      // Redirect to confirmation page
      router.push(`/homestays/booking-confirmation?reference=${data.reference}`);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-lg">
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {Number(nightlyRate).toLocaleString('vi-VN')}
          </span>
          <span className="text-muted-foreground">
            {homestay.currency} / đêm
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Selection (if multiple rooms) */}
        {rooms.length > 1 && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Chọn phòng
            </label>
            <select
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              className="w-full rounded-lg border bg-background px-3 py-2"
              required
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} - {Number(room.basePrice).toLocaleString('vi-VN')} {homestay.currency}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Check-in Date */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4" />
            Check-in
          </label>
          <input
            type="date"
            min={minDate}
            value={formData.checkIn}
            onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
            className="w-full rounded-lg border bg-background px-3 py-2"
            required
          />
        </div>

        {/* Check-out Date */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4" />
            Check-out
          </label>
          <input
            type="date"
            min={minCheckOut}
            value={formData.checkOut}
            onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
            className="w-full rounded-lg border bg-background px-3 py-2"
            required
          />
          {nights > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {nights} đêm
            </p>
          )}
        </div>

        {/* Customer Information */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold text-sm">Thông tin liên hệ</h3>
          
          {/* Customer Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="w-full rounded-lg border bg-background px-3 py-2"
              required
            />
          </div>

          {/* Customer Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              placeholder="email@example.com"
              className="w-full rounded-lg border bg-background px-3 py-2"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Chúng tôi sẽ gửi xác nhận đặt phòng qua email này
            </p>
          </div>

          {/* Customer Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              placeholder="0123456789"
              className="w-full rounded-lg border bg-background px-3 py-2"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Để chúng tôi liên hệ xác nhận đặt phòng
            </p>
          </div>

          {/* Special Requests */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Yêu cầu đặc biệt (tùy chọn)
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder="Ví dụ: Cần giường phụ, đến muộn, dị ứng thực phẩm..."
              rows={3}
              className="w-full rounded-lg border bg-background px-3 py-2 resize-none"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="border-t pt-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Users className="h-4 w-4" />
            Số lượng khách
          </label>
          
          <div className="space-y-3 rounded-lg border p-3">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Người lớn</div>
                <div className="text-xs text-muted-foreground">Từ 13 tuổi trở lên</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, adults: Math.max(1, formData.adults - 1) })}
                  className="h-8 w-8 rounded-full border hover:bg-muted"
                  disabled={formData.adults <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center">{formData.adults}</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, adults: formData.adults + 1 })}
                  className="h-8 w-8 rounded-full border hover:bg-muted"
                  disabled={homestay.maxGuests ? totalGuests >= homestay.maxGuests : false}
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Trẻ em</div>
                <div className="text-xs text-muted-foreground">2-12 tuổi</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, children: Math.max(0, formData.children - 1) })}
                  className="h-8 w-8 rounded-full border hover:bg-muted"
                  disabled={formData.children <= 0}
                >
                  -
                </button>
                <span className="w-8 text-center">{formData.children}</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, children: formData.children + 1 })}
                  className="h-8 w-8 rounded-full border hover:bg-muted"
                  disabled={homestay.maxGuests ? totalGuests >= homestay.maxGuests : false}
                >
                  +
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Em bé</div>
                <div className="text-xs text-muted-foreground">Dưới 2 tuổi</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, infants: Math.max(0, formData.infants - 1) })}
                  className="h-8 w-8 rounded-full border hover:bg-muted"
                  disabled={formData.infants <= 0}
                >
                  -
                </button>
                <span className="w-8 text-center">{formData.infants}</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, infants: formData.infants + 1 })}
                  className="h-8 w-8 rounded-full border hover:bg-muted"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        {nights > 0 && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>
                {Number(nightlyRate).toLocaleString('vi-VN')} {homestay.currency} x {nights} đêm
              </span>
              <span>{subtotal.toLocaleString('vi-VN')} {homestay.currency}</span>
            </div>
            {cleaningFee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Phí dọn dẹp</span>
                <span>{cleaningFee.toLocaleString('vi-VN')} {homestay.currency}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 font-bold">
              <span>Tổng cộng</span>
              <span>{total.toLocaleString('vi-VN')} {homestay.currency}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || nights === 0}
          className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Đặt ngay'
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Bạn sẽ không bị tính phí ngay lúc này
        </p>
      </form>
    </div>
  );
}
