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
    <Link href={`/homestays/${homestay.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg">
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
        <div className="p-4 space-y-3">
          {/* Type & Category */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{typeLabels[homestay.type] || homestay.type}</span>
            <span>•</span>
            <span>{categoryLabels[homestay.category] || homestay.category}</span>
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-lg font-semibold group-hover:text-primary">
            {homestay.title}
          </h3>

          {/* Subtitle */}
          {homestay.subtitle && (
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {homestay.subtitle}
            </p>
          )}

          {/* Location */}
          {homestay.city && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {homestay.city}
                {homestay.country && `, ${homestay.country}`}
              </span>
            </div>
          )}

          {/* Specs */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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
          <div className="flex items-center justify-between border-t pt-3">
            {/* Rating */}
            {homestay.ratingAverage && homestay.reviewCount > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {Number(homestay.ratingAverage).toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({homestay.reviewCount})
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Chưa có đánh giá</span>
            )}

            {/* Price */}
            {homestay.basePrice && (
              <div className="text-right">
                <div className="text-lg font-bold">
                  {Number(homestay.basePrice).toLocaleString('vi-VN')} {homestay.currency}
                </div>
                <div className="text-xs text-muted-foreground">/ đêm</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
