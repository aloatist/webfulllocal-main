'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Users, Bed, Bath, Wifi, Car, Waves } from 'lucide-react';

interface HomestayCardProps {
  homestay: {
    slug: string;
    title: string;
    subtitle?: string | null;
    summary?: string | null;
    heroImageUrl?: string | null;
    basePrice?: any;
    currency: string;
    type: string;
    category: string;
    city?: string | null;
    country?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    maxGuests?: number | null;
    ratingAverage?: any;
    reviewCount: number;
    isFeatured: boolean;
    isVerified: boolean;
    isInstantBook: boolean;
    hasWifi: boolean;
    hasPool: boolean;
    hasParking: boolean;
    hasKitchen: boolean;
  };
}

export function HomestayCard({ homestay }: HomestayCardProps) {
  const typeLabels: Record<string, string> = {
    ENTIRE_PLACE: 'Toàn bộ nhà',
    PRIVATE_ROOM: 'Phòng riêng',
    SHARED_ROOM: 'Phòng chung',
  };

  const categoryLabels: Record<string, string> = {
    VILLA: 'Villa',
    APARTMENT: 'Căn hộ',
    HOUSE: 'Nhà',
    STUDIO: 'Studio',
    BUNGALOW: 'Bungalow',
    CABIN: 'Cabin',
    OTHER: 'Khác',
  };

  return (
    <Link href={`/homestays/${homestay.slug}`} className="group block no-underline">
      <div className="overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all hover:shadow-2xl hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {homestay.heroImageUrl ? (
            <Image
              src={homestay.heroImageUrl}
              alt={homestay.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {homestay.isFeatured && (
              <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white">
                Nổi bật
              </span>
            )}
            {homestay.isVerified && (
              <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                Đã xác minh
              </span>
            )}
            {homestay.isInstantBook && (
              <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                Đặt ngay
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Type & Category */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
            <span>{typeLabels[homestay.type] || homestay.type}</span>
            <span>•</span>
            <span>{categoryLabels[homestay.category] || homestay.category}</span>
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {homestay.title}
          </h3>

          {/* Subtitle */}
          {homestay.subtitle && (
            <p className="line-clamp-1 text-base text-gray-700 dark:text-gray-200">
              {homestay.subtitle}
            </p>
          )}

          {/* Location */}
          {homestay.city && (
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium">
                {homestay.city}
                {homestay.country && `, ${homestay.country}`}
              </span>
            </div>
          )}

          {/* Specs */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            {homestay.maxGuests && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{homestay.maxGuests} khách</span>
              </div>
            )}
            {homestay.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{homestay.bedrooms} phòng ngủ</span>
              </div>
            )}
            {homestay.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{homestay.bathrooms} phòng tắm</span>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {homestay.hasWifi && (
              <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                <Wifi className="h-3 w-3" />
                <span>WiFi</span>
              </div>
            )}
            {homestay.hasParking && (
              <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                <Car className="h-3 w-3" />
                <span>Đỗ xe</span>
              </div>
            )}
            {homestay.hasPool && (
              <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                <Waves className="h-3 w-3" />
                <span>Hồ bơi</span>
              </div>
            )}
          </div>

          {/* Rating & Price */}
          <div className="flex items-center justify-between border-t-2 border-gray-200 dark:border-gray-700 pt-4">
            {/* Rating */}
            {homestay.ratingAverage && homestay.reviewCount > 0 ? (
              <div className="flex items-center gap-1.5">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  {Number(homestay.ratingAverage).toFixed(1)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  ({homestay.reviewCount})
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Chưa có đánh giá</span>
            )}

            {/* Price */}
            {homestay.basePrice && (
              <div className="text-right">
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Number(homestay.basePrice).toLocaleString('vi-VN')} {homestay.currency}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">/ đêm</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
