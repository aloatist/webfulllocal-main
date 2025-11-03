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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tour.title}</h3>
          {tour.summary && (
            <p className="text-base text-gray-700 dark:text-gray-200 line-clamp-3 leading-relaxed">
              {tour.summary}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800">
            {tour.durationDays} ngày
            {tour.durationNights
              ? ` • ${tour.durationNights} đêm`
              : ''}
          </span>
          {tour.difficulty && (
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-gray-700 dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-700">
              Độ khó: {tour.difficulty.toLowerCase()}
            </span>
          )}
          {tour.departureCity && (
            <span className="rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800">
              {tour.departureCity}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t-2 border-gray-200 dark:border-gray-700 pt-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Giá từ</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {tour.basePrice
                ? Number(tour.basePrice).toLocaleString('vi-VN')
                : 'Liên hệ'}{' '}
              {tour.currency ?? 'VND'}
            </p>
          </div>
          <div className="text-right text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium">{tour.TourDeparture.length} lịch trình</p>
            <p className="text-xs">
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
