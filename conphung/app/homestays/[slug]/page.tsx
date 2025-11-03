import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { generateHomestayMetadata } from '@/lib/seo/metadata';
import { generateHomestayStructuredData, renderStructuredData } from '@/lib/seo/structured-data';
import { Section, Container } from '@/components/craft';
import { HomestayGallery } from '@/components/homestays/HomestayGallery';
import { BookingForm } from '@/components/homestays/BookingForm';
import { ReviewsSection } from '@/components/homestays/ReviewsSection';
import { LocationMap } from '@/components/homestays/LocationMap';
import { ShareButtons } from '@/components/homestays/ShareButtons';
import { SimilarHomestays } from '@/components/homestays/SimilarHomestays';
import { AvailabilityCalendar } from '@/components/homestays/AvailabilityCalendar';
import Loader from '@/components/Loader';
import { 
  MapPin, Users, Bed, Bath, Maximize, Star, Check, Wifi, Car, 
  Waves, Wind, Home, Coffee, Shield, Calendar, Clock, XCircle 
} from 'lucide-react';
import { Breadcrumb } from '@/components/schema/BreadcrumbSchema';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const homestay = await prisma.homestay.findUnique({
    where: { slug: params.slug },
  });

  if (!homestay) return {};
  return generateHomestayMetadata(homestay);
}

export default async function HomestayDetailPage({ params }: PageProps) {
  const homestay = await prisma.homestay.findUnique({
    where: { 
      slug: params.slug,
      status: 'PUBLISHED',
    },
    include: {
      HomestayRoom: {
        where: { status: 'ACTIVE' },
        orderBy: { basePrice: 'asc' },
      },
      HomestayReview: {
        where: { status: 'APPROVED' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          overallRating: true,
          cleanlinessRating: true,
          accuracyRating: true,
          communicationRating: true,
          locationRating: true,
          valueRating: true,
          content: true,
          hostResponse: true,
          hostResponseAt: true,
          createdAt: true,
          User: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      HomestayMedia: {
        orderBy: { position: 'asc' },
        include: {
          Media: true,
        },
      },
      HomestayAvailability: {
        where: {
          date: { gte: new Date() },
          status: 'BLOCKED',
        },
        orderBy: { date: 'asc' },
        take: 365, // Next year
      },
    },
  });

  if (!homestay) notFound();

  const breadcrumbs = [
    { name: 'Trang chủ', url: 'https://conphungtourist.com' },
    { name: 'Homestays', url: 'https://conphungtourist.com/homestays' },
    { name: homestay.title, url: `https://conphungtourist.com/homestays/${params.slug}` }
  ];

  // Prepare gallery images
  const galleryImages = [
    ...(homestay.heroImageUrl ? [{ url: homestay.heroImageUrl, alt: homestay.title }] : []),
    ...homestay.HomestayMedia.map(item => ({
      url: item.Media.url,
      alt: item.Media.alt || homestay.title,
    })),
    // Add gallery images from galleryImageUrls field
    ...(Array.isArray(homestay.galleryImageUrls) 
      ? homestay.galleryImageUrls
          .filter((url): url is string => typeof url === 'string' && url.length > 0)
          .map((url) => ({
            url,
            alt: homestay.title,
          }))
      : (homestay.galleryImageUrls && typeof homestay.galleryImageUrls === 'object')
      ? Object.values(homestay.galleryImageUrls)
          .filter((url): url is string => typeof url === 'string' && url.length > 0)
          .map((url) => ({
            url,
            alt: homestay.title,
          }))
      : []
    ),
  ];

  // Prepare blocked dates for calendar
  const bookedDates = homestay.HomestayAvailability?.map(avail => new Date(avail.date)) || [];

  // Structured data for SEO
  const structuredData = generateHomestayStructuredData(homestay);

  // Type labels
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

  const cancellationLabels: Record<string, string> = {
    FLEXIBLE: 'Linh hoạt',
    MODERATE: 'Trung bình',
    STRICT: 'Nghiêm ngặt',
    SUPER_STRICT: 'Rất nghiêm ngặt',
    LONG_TERM: 'Dài hạn',
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderStructuredData(structuredData) }}
      />

      <Section className="py-8">
        <Container>
          <Breadcrumb items={breadcrumbs} />
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {typeLabels[homestay.type]}
                </span>
                <span className="rounded-full bg-secondary/50 px-3 py-1">
                  {categoryLabels[homestay.category]}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {homestay.title}
              </h1>
              
              {homestay.subtitle && (
                <p className="text-xl text-muted-foreground font-medium">
                  {homestay.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border">
                <div className="flex flex-wrap items-center gap-6">
                  {/* Rating */}
                  {homestay.ratingAverage && homestay.reviewCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold text-lg">
                        {Number(homestay.ratingAverage).toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({homestay.reviewCount} đánh giá)
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  {homestay.city && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {homestay.city}
                        {homestay.country && `, ${homestay.country}`}
                      </span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex gap-2">
                    {homestay.isVerified && (
                      <span className="flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <Check className="h-3 w-3" />
                        Đã xác minh
                      </span>
                    )}
                    {homestay.isSuperhost && (
                      <span className="flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-950 px-3 py-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        <Star className="h-3 w-3 fill-current" />
                        Superhost
                      </span>
                    )}
                  </div>
                </div>

                {/* Share Button */}
                <ShareButtons title={homestay.title} />
              </div>
            </div>

            {/* Gallery */}
            <Suspense fallback={<Loader />}>
              <HomestayGallery images={galleryImages} />
            </Suspense>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
                  {homestay.maxGuests && (
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/80 backdrop-blur">
                      <Users className="h-6 w-6 text-primary" />
                      <span className="font-bold text-lg">{homestay.maxGuests}</span>
                      <span className="text-xs text-muted-foreground">Khách</span>
                    </div>
                  )}
                  {homestay.bedrooms && (
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/80 backdrop-blur">
                      <Bed className="h-6 w-6 text-primary" />
                      <span className="font-bold text-lg">{homestay.bedrooms}</span>
                      <span className="text-xs text-muted-foreground">Phòng ngủ</span>
                    </div>
                  )}
                  {homestay.bathrooms && (
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/80 backdrop-blur">
                      <Bath className="h-6 w-6 text-primary" />
                      <span className="font-bold text-lg">{homestay.bathrooms}</span>
                      <span className="text-xs text-muted-foreground">Phòng tắm</span>
                    </div>
                  )}
                  {homestay.sizeSquareMeters && (
                    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/80 backdrop-blur">
                      <Maximize className="h-6 w-6 text-primary" />
                      <span className="font-bold text-lg">{Number(homestay.sizeSquareMeters)}</span>
                      <span className="text-xs text-muted-foreground">m²</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {homestay.description && (
                  <div className="p-6 rounded-xl bg-card border-2">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
                      Mô tả
                    </h2>
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                        {homestay.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Amenities */}
                <div className="p-6 rounded-xl bg-card border-2">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
                    Tiện nghi
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {homestay.hasWifi && (
                      <div className="flex items-center gap-3">
                        <Wifi className="h-5 w-5 text-primary" />
                        <span>WiFi miễn phí</span>
                      </div>
                    )}
                    {homestay.hasParking && (
                      <div className="flex items-center gap-3">
                        <Car className="h-5 w-5 text-primary" />
                        <span>Chỗ đỗ xe</span>
                      </div>
                    )}
                    {homestay.hasPool && (
                      <div className="flex items-center gap-3">
                        <Waves className="h-5 w-5 text-primary" />
                        <span>Hồ bơi</span>
                      </div>
                    )}
                    {homestay.hasAirConditioning && (
                      <div className="flex items-center gap-3">
                        <Wind className="h-5 w-5 text-primary" />
                        <span>Điều hòa</span>
                      </div>
                    )}
                    {homestay.hasKitchen && (
                      <div className="flex items-center gap-3">
                        <Coffee className="h-5 w-5 text-primary" />
                        <span>Bếp</span>
                      </div>
                    )}
                    {homestay.hasBalcony && (
                      <div className="flex items-center gap-3">
                        <Home className="h-5 w-5 text-primary" />
                        <span>Ban công</span>
                      </div>
                    )}
                    {homestay.hasGym && (
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <span>Phòng gym</span>
                      </div>
                    )}
                    {homestay.hasGarden && (
                      <div className="flex items-center gap-3">
                        <Home className="h-5 w-5 text-primary" />
                        <span>Vườn</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* House Rules */}
                {homestay.houseRules && homestay.houseRules.length > 0 && (
                  <div className="border-b pb-6">
                    <h2 className="text-2xl font-bold mb-4">Nội quy</h2>
                    <ul className="space-y-2">
                      {homestay.houseRules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Check-in/out & Policies */}
                <div className="border-b pb-6">
                  <h2 className="text-2xl font-bold mb-4">Chính sách</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center gap-2 font-semibold mb-2">
                        <Clock className="h-5 w-5" />
                        <span>Check-in</span>
                      </div>
                      <p className="text-muted-foreground">
                        {homestay.checkInTimeStart} - {homestay.checkInTimeEnd}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-semibold mb-2">
                        <Clock className="h-5 w-5" />
                        <span>Check-out</span>
                      </div>
                      <p className="text-muted-foreground">
                        {homestay.checkOutTime || '12:00'}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-semibold mb-2">
                        <XCircle className="h-5 w-5" />
                        <span>Chính sách hủy</span>
                      </div>
                      <p className="text-muted-foreground">
                        {cancellationLabels[homestay.cancellationPolicy]}
                      </p>
                    </div>
                    {homestay.minNights && (
                      <div>
                        <div className="flex items-center gap-2 font-semibold mb-2">
                          <Calendar className="h-5 w-5" />
                          <span>Số đêm tối thiểu</span>
                        </div>
                        <p className="text-muted-foreground">
                          {homestay.minNights} đêm
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Map */}
                <div className="border-b pb-6">
                  <LocationMap
                    latitude={homestay.latitude ? Number(homestay.latitude) : null}
                    longitude={homestay.longitude ? Number(homestay.longitude) : null}
                    address={homestay.addressLine1 || undefined}
                    city={homestay.city}
                    country={homestay.country}
                  />
                </div>
              </div>

              {/* Right Column - Booking Form & Calendar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <Suspense fallback={<Loader />}>
                    <BookingForm 
                      homestay={{
                        id: homestay.id,
                        slug: homestay.slug,
                        title: homestay.title,
                        basePrice: homestay.basePrice,
                        currency: homestay.currency,
                        cleaningFee: homestay.cleaningFee,
                        minNights: homestay.minNights,
                        maxGuests: homestay.maxGuests,
                      }}
                      rooms={homestay.HomestayRoom}
                    />
                  </Suspense>

                  {/* Availability Calendar */}
                  <AvailabilityCalendar 
                    homestayId={homestay.id} 
                    bookedDates={bookedDates}
                  />
                </div>
              </div>
            </div>

            {/* Similar Homestays */}
            <Suspense fallback={<Loader />}>
              <SimilarHomestays
                currentHomestayId={homestay.id}
                city={homestay.city}
                category={homestay.category}
                limit={4}
              />
            </Suspense>
          </div>
        </Container>
      </Section>

      {/* Reviews Section - Moved to bottom */}
      <Section className="bg-muted/30">
        <Container>
          <Suspense fallback={<Loader />}>
            <ReviewsSection 
              homestayId={homestay.id}
              reviews={homestay.HomestayReview}
              averageRating={homestay.ratingAverage ? Number(homestay.ratingAverage) : 0}
              totalReviews={homestay.reviewCount}
            />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
