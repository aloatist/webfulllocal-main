import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { Section, Container } from '@/components/craft';
import { generateListingMetadata } from '@/lib/seo/metadata';
import { HomestayCard } from '@/components/homestays/HomestayCard';
import { HomestayFilters } from '@/components/homestays/HomestayFilters';
import Loader from '@/components/Loader';

export const metadata = generateListingMetadata('homestays');

interface SearchParams {
  type?: string;
  category?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  hasWifi?: string;
  hasPool?: string;
  hasParking?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
}

interface PageProps {
  searchParams: SearchParams;
}

export default async function HomestaysPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  // Build where clause from filters
  const where: any = {
    status: 'PUBLISHED',
  };

  if (searchParams.type) {
    where.type = searchParams.type;
  }

  if (searchParams.category) {
    where.category = searchParams.category;
  }

  if (searchParams.city) {
    where.city = {
      contains: searchParams.city,
      mode: 'insensitive',
    };
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.basePrice = {};
    if (searchParams.minPrice) {
      where.basePrice.gte = parseFloat(searchParams.minPrice);
    }
    if (searchParams.maxPrice) {
      where.basePrice.lte = parseFloat(searchParams.maxPrice);
    }
  }

  if (searchParams.bedrooms) {
    where.bedrooms = {
      gte: parseInt(searchParams.bedrooms),
    };
  }

  if (searchParams.bathrooms) {
    where.bathrooms = {
      gte: parseInt(searchParams.bathrooms),
    };
  }

  if (searchParams.hasWifi === 'true') {
    where.hasWifi = true;
  }

  if (searchParams.hasPool === 'true') {
    where.hasPool = true;
  }

  if (searchParams.hasParking === 'true') {
    where.hasParking = true;
  }

  // Build orderBy
  const sortBy = searchParams.sortBy || 'createdAt';
  const sortOrder = searchParams.sortOrder || 'desc';
  const orderBy: any = { [sortBy]: sortOrder };

  // Fetch homestays
  const [rawHomestays, total] = await Promise.all([
    prisma.homestay.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        summary: true,
        heroImageUrl: true,
        basePrice: true,
        currency: true,
        type: true,
        category: true,
        city: true,
        country: true,
        bedrooms: true,
        bathrooms: true,
        maxGuests: true,
        ratingAverage: true,
        reviewCount: true,
        isFeatured: true,
        isVerified: true,
        isInstantBook: true,
        hasWifi: true,
        hasPool: true,
        hasParking: true,
        hasKitchen: true,
      },
    }),
    prisma.homestay.count({ where }),
  ]);

  // Serialize Decimal fields
  const homestays = rawHomestays.map(h => ({
    ...h,
    basePrice: h.basePrice ? h.basePrice.toString() : '0',
    ratingAverage: h.ratingAverage ? h.ratingAverage.toString() : null,
  }));

  const totalPages = Math.ceil(total / limit);

  return (
    <Section>
      <Container>
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Homestay & Lưu Trú
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Khám phá {total} homestay độc đáo tại Cồn Phụng
            </p>
          </div>

          {/* Filters */}
          <Suspense fallback={<Loader />}>
            <HomestayFilters currentFilters={searchParams} />
          </Suspense>

          {/* Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Hiển thị {skip + 1}-{Math.min(skip + limit, total)} trong tổng số {total} kết quả
              </p>
            </div>

            {homestays.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-lg text-muted-foreground">
                  Không tìm thấy homestay phù hợp. Vui lòng thử lại với bộ lọc khác.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {homestays.map((homestay) => (
                  <HomestayCard key={homestay.id} homestay={homestay} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <a
                    key={pageNum}
                    href={`/homestays?${new URLSearchParams({
                      ...searchParams,
                      page: pageNum.toString(),
                    })}`}
                    className={`rounded-lg px-4 py-2 ${
                      pageNum === page
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {pageNum}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
