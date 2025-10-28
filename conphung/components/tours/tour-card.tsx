'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { PublicTour } from '@/lib/tours/public';
import { Badge } from '@/components/ui/badge';

interface TourCardProps {
  tour: PublicTour;
}

function formatDepartureDate(tour: PublicTour) {
  if (!tour.TourDeparture || tour.TourDeparture.length === 0) return null;
  const upcoming = tour.TourDeparture.find((departure) => {
    if (!departure.startDate) return false;
    return new Date(departure.startDate) >= new Date();
  });
  return upcoming
    ? format(new Date(upcoming.startDate), 'dd/MM/yyyy')
    : null;
}

export function TourCard({ tour }: TourCardProps) {
  const heroSrc = tour.heroImageUrl ?? tour.TourMedia?.[0]?.Media?.url ?? undefined;
  const upcomingDate = formatDepartureDate(tour);

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-background/80 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-56 w-full overflow-hidden bg-muted">
        {heroSrc ? (
          <Image
          src={heroSrc}
          alt={tour.title}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-primary/30 text-primary">
            <span className="text-sm font-medium uppercase tracking-[0.3em]">
              Con Phụng Tours
            </span>
          </div>
        )}
        {tour.isFeatured && (
          <Badge className="absolute left-4 top-4 bg-purple-600 text-white shadow">
            Featured
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{tour.title}</h3>
          {tour.summary && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {tour.summary}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
            {tour.durationDays} ngày
            {tour.durationNights
              ? ` • ${tour.durationNights} đêm`
              : ''}
          </span>
          {tour.difficulty && (
            <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
              Độ khó: {tour.difficulty.toLowerCase()}
            </span>
          )}
          {tour.departureCity && (
            <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
              Khởi hành: {tour.departureCity}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Giá từ</p>
            <p className="text-lg font-semibold">
              {tour.basePrice
                ? Number(tour.basePrice).toLocaleString('vi-VN')
                : 'Liên hệ'}{' '}
              {tour.currency ?? 'VND'}
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>{tour.TourDeparture.length} lịch trình</p>
            <p>
              {upcomingDate
                ? `Gần nhất: ${upcomingDate}`
                : 'Đang cập nhật'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
