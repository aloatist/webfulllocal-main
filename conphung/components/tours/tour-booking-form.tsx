'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TourDepartureOption {
  id: string;
  startDate: string | null;
  endDate: string | null;
  seatsAvailable: number | null;
  seatsTotal: number;
  priceAdult: number | null;
  priceChild: number | null;
  priceInfant: number | null;
}

interface TourAddonOption {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  perPerson: boolean;
}

export interface TourBookingFormProps {
  tour: {
    slug: string;
    currency: string;
    basePrice: number;
    departures: TourDepartureOption[];
    addons: TourAddonOption[];
  };
}

function formatCurrency(amount: number, currency: string) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Liên hệ';
  }

  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${Math.round(amount).toLocaleString('vi-VN')} ${currency}`;
  }
}

export function TourBookingForm({ tour }: TourBookingFormProps) {
  const router = useRouter();
  const [departureId, setDepartureId] = useState(
    tour.departures[0]?.id ?? ''
  );
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    reference: string;
    message: string;
  } | null>(null);

  const totalGuests = adults + children + infants;

  const departure = useMemo(
    () => tour.departures.find((item) => item.id === departureId),
    [tour.departures, departureId]
  );

  const pricing = useMemo(() => {
    const currency = tour.currency;
    const adultPrice =
      departure?.priceAdult ?? (tour.basePrice > 0 ? tour.basePrice : 0);
    const childPrice =
      departure?.priceChild ?? Math.max(adultPrice * 0.7, 0);
    const infantPrice =
      departure?.priceInfant ?? Math.max(childPrice * 0.5, 0);

    const baseTotal =
      adultPrice * adults + childPrice * children + infantPrice * infants;

    const addonsTotal = selectedAddons.reduce((sum, addonId) => {
      const addon = tour.addons.find((item) => item.id === addonId);
      if (!addon) return sum;
      const multiplier = addon.perPerson ? totalGuests : 1;
      return sum + addon.price * multiplier;
    }, 0);

    return {
      currency,
      adultPrice,
      childPrice,
      infantPrice,
      addonsTotal,
      total: baseTotal + addonsTotal,
    };
  }, [
    adults,
    children,
    departure,
    infants,
    selectedAddons,
    totalGuests,
    tour.addons,
    tour.basePrice,
    tour.currency,
  ]);

  const seatsAvailable =
    departure?.seatsAvailable ?? departure?.seatsTotal ?? 0;
  const seatsWarning =
    departure && seatsAvailable > 0 && totalGuests > seatsAvailable;

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!departureId) {
      setError('Vui lòng chọn lịch khởi hành.');
      return;
    }
    if (!fullName.trim() || !email.trim()) {
      setError('Vui lòng nhập đầy đủ họ tên và email liên hệ.');
      return;
    }
    if (totalGuests <= 0) {
      setError('Vui lòng chọn số lượng khách hợp lệ.');
      return;
    }

    setError(null);
    setSubmitting(true);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/public/tours/${tour.slug}/book`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer: {
              fullName: fullName.trim(),
              email: email.trim(),
              phone: phone.trim() || undefined,
              notes: notes.trim() || undefined,
            },
            departureId,
            adults,
            children,
            infants,
            addonIds: selectedAddons,
            specialRequests: specialRequests.trim() || undefined,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? 'Đặt tour thất bại');
      }

      setSuccess({
        reference: data.reference,
        message:
          'Đặt tour thành công! Bộ phận tư vấn sẽ liên hệ để xác nhận trong thời gian sớm nhất.',
      });
      setSelectedAddons([]);
      setSpecialRequests('');

      router.push(`/tours/booking-confirmation?ref=${encodeURIComponent(data.reference)}`);
    } catch (bookingError) {
      setError(
        bookingError instanceof Error
          ? bookingError.message
          : 'Không thể đặt tour. Vui lòng thử lại.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-primary/40 bg-background/80 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-primary">
        Đặt Tour Ngay
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Hoàn tất biểu mẫu để giữ chỗ. Chúng tôi sẽ liên hệ xác nhận & hướng dẫn thanh toán.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="departure">Chọn lịch khởi hành</Label>
          <select
            id="departure"
            value={departureId}
            onChange={(event) => setDepartureId(event.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
          >
            {tour.departures.length === 0 && (
              <option value="">Đang cập nhật</option>
            )}
            {tour.departures.map((item) => (
              <option key={item.id} value={item.id}>
                {item.startDate
                  ? format(new Date(item.startDate), 'dd/MM/yyyy')
                  : 'Chưa cập nhật'}{' '}
                {item.seatsAvailable
                  ? `• Còn ${item.seatsAvailable} chỗ`
                  : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Người lớn</Label>
            <Input
              type="number"
              min={1}
              value={adults}
              onChange={(event) => setAdults(Number(event.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              {formatCurrency(pricing.adultPrice, pricing.currency)} / người
            </p>
          </div>
          <div className="space-y-2">
            <Label>Trẻ em</Label>
            <Input
              type="number"
              min={0}
              value={children}
              onChange={(event) => setChildren(Number(event.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              {formatCurrency(pricing.childPrice, pricing.currency)} / bé
            </p>
          </div>
          <div className="space-y-2">
            <Label>Em bé</Label>
            <Input
              type="number"
              min={0}
              value={infants}
              onChange={(event) => setInfants(Number(event.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              {formatCurrency(pricing.infantPrice, pricing.currency)} / bé
            </p>
          </div>
        </div>

        {seatsWarning && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            Lịch khởi hành chỉ còn {seatsAvailable} chỗ. Vui lòng giảm số lượng khách hoặc chọn
            lịch khác.
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">Họ tên liên hệ</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Điện thoại</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="0937 xxx xxx"
            />
          </div>
        </div>

        {tour.addons.length > 0 && (
          <div className="space-y-3">
            <Label>Dịch vụ đi kèm</Label>
            <div className="space-y-2">
              {tour.addons.map((addon) => {
                const checked = selectedAddons.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    className="flex cursor-pointer items-start gap-3 rounded-md border border-border/60 bg-background/70 p-3 text-sm transition hover:border-primary/60"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleAddonToggle(addon.id)}
                      className="mt-1 h-4 w-4 border border-border accent-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{addon.name}</p>
                      {addon.description && (
                        <p className="text-xs text-muted-foreground">
                          {addon.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-primary">
                        {formatCurrency(addon.price, tour.currency)}{' '}
                        {addon.perPerson ? '/ khách' : '/ dịch vụ'}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Ghi chú khách hàng</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ghi chú thêm (nếu có)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requests">Yêu cầu đặc biệt</Label>
          <Textarea
            id="requests"
            value={specialRequests}
            onChange={(event) => setSpecialRequests(event.target.value)}
            placeholder="Chúng tôi có thể hỗ trợ gì thêm cho chuyến đi của bạn?"
          />
        </div>

        <div className="rounded-md border border-border/60 bg-background/70 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span>Tổng chi phí dự kiến</span>
            <span className="text-lg font-semibold text-primary">
              {formatCurrency(pricing.total, pricing.currency)}
            </span>
          </div>
          {selectedAddons.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Bao gồm {selectedAddons.length} dịch vụ bổ sung.
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-md border border-destructive/60 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md border border-emerald-400/60 bg-emerald-50 p-3 text-sm text-emerald-900">
            <p className="font-semibold">
              Mã đặt tour: <span className="underline">{success.reference}</span>
            </p>
            <p className="mt-1">{success.message}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={submitting || seatsWarning || totalGuests <= 0}
        >
          {submitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu đặt tour'}
        </Button>
      </form>
    </div>
  );
}
