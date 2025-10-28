import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Users } from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface SimilarHomestaysProps {
  currentHomestayId: string;
  city?: string | null;
  category?: string;
  limit?: number;
}

export async function SimilarHomestays({
  currentHomestayId,
  city,
  category,
  limit = 4,
}: SimilarHomestaysProps) {
  // Find similar homestays based on city and category
  const similarHomestays = await prisma.homestay.findMany({
    where: {
      id: { not: currentHomestayId },
      status: 'PUBLISHED',
      OR: [
        city ? { city } : {},
        category ? { category: category as any } : {},
      ],
    },
    take: limit,
    orderBy: [
      { isFeatured: 'desc' },
      { ratingAverage: 'desc' },
      { viewCount: 'desc' },
    ],
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      heroImageUrl: true,
      city: true,
      country: true,
      basePrice: true,
      currency: true,
      maxGuests: true,
      ratingAverage: true,
      reviewCount: true,
      type: true,
      category: true,
    },
  });

  if (similarHomestays.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Homestay tương tự</h2>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {similarHomestays.map((homestay) => {
          const heroSrc = homestay.heroImageUrl || '/placeholder-homestay.jpg';
          
          return (
            <Link
              key={homestay.id}
              href={`/homestays/${homestay.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-background/80 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <Image
                  src={heroSrc}
                  alt={homestay.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                {/* Title */}
                <h3 className="mb-2 line-clamp-2 font-semibold leading-tight">
                  {homestay.title}
                </h3>

                {/* Location */}
                {homestay.city && (
                  <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">
                      {homestay.city}
                      {homestay.country && `, ${homestay.country}`}
                    </span>
                  </div>
                )}

                {/* Rating & Guests */}
                <div className="mb-3 flex items-center gap-3 text-sm">
                  {homestay.ratingAverage && homestay.reviewCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {Number(homestay.ratingAverage).toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({homestay.reviewCount})
                      </span>
                    </div>
                  )}
                  
                  {homestay.maxGuests && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{homestay.maxGuests}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">
                      {Number(homestay.basePrice).toLocaleString('vi-VN')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {homestay.currency === 'VND' ? '₫' : homestay.currency}/đêm
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
