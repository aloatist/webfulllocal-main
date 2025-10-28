'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Shield, Check, MessageCircle, Calendar, Users, Loader2, AlertCircle, X } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ModernBookingCardProps {
  homestay: {
    id: string;
    slug: string;
    title: string;
    basePrice: any;
    currency: string;
    cleaningFee?: any;
    serviceFee?: any;
    minNights?: number | null;
    maxGuests?: number | null;
    ratingAverage?: any;
    reviewCount?: number;
    isInstantBook?: boolean;
  };
  rooms?: Array<{
    id: string;
    name: string;
    basePrice: any;
    maxGuests: number | null;
  }>;
}

export function ModernBookingCard({ homestay, rooms = [] }: ModernBookingCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    infants: 0,
    roomId: rooms.length > 0 ? rooms[0].id : '',
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
  const nightlyRate = Number(selectedRoom?.basePrice || homestay.basePrice || 0);
  const subtotal = nightlyRate * nights;
  const cleaningFee = Number(homestay.cleaningFee || 0);
  const serviceFee = Number(homestay.serviceFee || Math.round(subtotal * 0.1)); // 10% service fee
  const total = subtotal + cleaningFee + serviceFee;

  const handleReserve = () => {
    if (!formData.checkIn || !formData.checkOut) {
      setError('Vui lòng chọn ngày check-in và check-out');
      return;
    }
    
    if (nights < (homestay.minNights || 1)) {
      setError(`Số đêm tối thiểu là ${homestay.minNights || 1}`);
      return;
    }

    // Redirect to booking page with params
    const params = new URLSearchParams({
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      adults: formData.adults.toString(),
      children: formData.children.toString(),
      infants: formData.infants.toString(),
      ...(formData.roomId && { roomId: formData.roomId }),
    });
    
    router.push(`/homestays/${homestay.slug}/book?${params.toString()}`);
  };

  return (
    <div className="sticky top-24 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xl">
      {/* Price & Rating */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {nightlyRate.toLocaleString('vi-VN')}
          </span>
          <span className="text-muted-foreground">{homestay.currency}</span>
          <span className="text-sm text-muted-foreground">/ đêm</span>
        </div>
        
        {homestay.ratingAverage && homestay.reviewCount && homestay.reviewCount > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">
              {Number(homestay.ratingAverage).toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({homestay.reviewCount} đánh giá)
            </span>
          </div>
        )}
      </div>

      {/* Date Picker */}
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-lg p-3 hover:border-foreground transition-colors cursor-pointer">
          <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
            Nhận phòng
          </label>
          <input 
            type="date" 
            value={formData.checkIn}
            min={minDate}
            onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
            className="w-full text-sm font-medium bg-transparent border-none p-0 focus:outline-none cursor-pointer"
          />
        </div>
        <div className="border rounded-lg p-3 hover:border-foreground transition-colors cursor-pointer">
          <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
            Trả phòng
          </label>
          <input 
            type="date" 
            value={formData.checkOut}
            min={minCheckOut}
            onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
            className="w-full text-sm font-medium bg-transparent border-none p-0 focus:outline-none cursor-pointer"
            disabled={!formData.checkIn}
          />
        </div>
      </div>

      {/* Guests Picker */}
      <div className="relative">
        <div 
          className="border rounded-lg p-3 hover:border-foreground transition-colors cursor-pointer"
          onClick={() => setShowGuestPicker(!showGuestPicker)}
        >
          <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
            Khách
          </label>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {totalGuests} khách{formData.infants > 0 && `, ${formData.infants} em bé`}
            </span>
          </div>
        </div>

        {/* Guest Picker Dropdown */}
        {showGuestPicker && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-xl p-4 space-y-4 z-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Số lượng khách</h3>
              <button onClick={() => setShowGuestPicker(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Adults */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Người lớn</div>
                <div className="text-sm text-muted-foreground">Từ 13 tuổi trở lên</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFormData({ ...formData, adults: Math.max(1, formData.adults - 1) })}
                  className="w-8 h-8 rounded-full border hover:border-foreground transition-colors flex items-center justify-center"
                  disabled={formData.adults <= 1}
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">{formData.adults}</span>
                <button
                  onClick={() => setFormData({ ...formData, adults: formData.adults + 1 })}
                  className="w-8 h-8 rounded-full border hover:border-foreground transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Trẻ em</div>
                <div className="text-sm text-muted-foreground">Từ 2-12 tuổi</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFormData({ ...formData, children: Math.max(0, formData.children - 1) })}
                  className="w-8 h-8 rounded-full border hover:border-foreground transition-colors flex items-center justify-center"
                  disabled={formData.children <= 0}
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">{formData.children}</span>
                <button
                  onClick={() => setFormData({ ...formData, children: formData.children + 1 })}
                  className="w-8 h-8 rounded-full border hover:border-foreground transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Em bé</div>
                <div className="text-sm text-muted-foreground">Dưới 2 tuổi</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFormData({ ...formData, infants: Math.max(0, formData.infants - 1) })}
                  className="w-8 h-8 rounded-full border hover:border-foreground transition-colors flex items-center justify-center"
                  disabled={formData.infants <= 0}
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">{formData.infants}</span>
                <button
                  onClick={() => setFormData({ ...formData, infants: formData.infants + 1 })}
                  className="w-8 h-8 rounded-full border hover:border-foreground transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {homestay.maxGuests && totalGuests > homestay.maxGuests && (
              <div className="text-sm text-destructive">
                Số khách tối đa: {homestay.maxGuests}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Room Selection (if multiple rooms) */}
      {rooms.length > 1 && (
        <div className="border rounded-lg p-3">
          <label className="text-xs font-semibold uppercase text-muted-foreground block mb-2">
            Chọn phòng
          </label>
          <select
            value={formData.roomId}
            onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
            className="w-full text-sm font-medium bg-transparent border-none p-0 focus:outline-none"
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} - {Number(room.basePrice).toLocaleString('vi-VN')} {homestay.currency}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="underline">
              {nightlyRate.toLocaleString('vi-VN')} {homestay.currency} x {nights} đêm
            </span>
            <span>{subtotal.toLocaleString('vi-VN')} {homestay.currency}</span>
          </div>
          
          {cleaningFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="underline">Phí vệ sinh</span>
              <span>{cleaningFee.toLocaleString('vi-VN')} {homestay.currency}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="underline">Phí dịch vụ</span>
            <span>{serviceFee.toLocaleString('vi-VN')} {homestay.currency}</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg pt-3 border-t">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString('vi-VN')} {homestay.currency}</span>
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="space-y-2">
        <Button 
          size="lg" 
          className="w-full text-base font-semibold"
          onClick={handleReserve}
          disabled={isLoading || !formData.checkIn || !formData.checkOut}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              {homestay.isInstantBook ? 'Đặt ngay' : 'Yêu cầu đặt phòng'}
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full text-base font-semibold"
          onClick={() => router.push(`/contact?subject=Homestay: ${homestay.title}`)}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Liên hệ chủ nhà
        </Button>
      </div>

      {/* Trust Message */}
      <div className="text-center text-sm text-muted-foreground">
        <p className="mb-3">Bạn sẽ chưa bị trừ tiền</p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>Thanh toán an toàn</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Hủy miễn phí 48h</span>
          </div>
        </div>
      </div>

      {/* Instant Book Badge */}
      {homestay.isInstantBook && (
        <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 text-primary rounded-lg text-sm font-medium">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Đặt ngay - Xác nhận tức thì
        </div>
      )}
    </div>
  );
}
