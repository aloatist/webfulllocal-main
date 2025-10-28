# 🔧 HƯỚNG DẪN INTEGRATION - HOÀN THIỆN

**Status:** ✅ All components created  
**Next:** Integrate vào main page

---

## ✅ COMPONENTS ĐÃ TẠO

### 1. HomestayGallery.tsx ✅
- Mosaic layout
- Hover effects
- Modal lightbox

### 2. ModernBookingCard.tsx ✅
- Sticky sidebar
- Date/Guest pickers
- Price breakdown

### 3. HighlightsSection.tsx ✅
- Icon grid
- Auto-generate highlights

### 4. AmenitiesGrid.tsx ✅
- Expandable list
- Icon mapping

### 5. ModernReviewsSection.tsx ✅
- Rating breakdown
- Review cards with Avatar

### 6. MobileBottomBar.tsx ✅
- Sticky bottom CTA
- Price + Rating display

---

## 🔧 INTEGRATION STEPS

### Step 1: Update Main Page Imports

**File:** `/app/homestays/[slug]/page.tsx`

```typescript
// Add new imports
import { ModernBookingCard } from '@/components/homestays/ModernBookingCard';
import { HighlightsSection } from '@/components/homestays/HighlightsSection';
import { AmenitiesGrid } from '@/components/homestays/AmenitiesGrid';
import { ModernReviewsSection } from '@/components/homestays/ModernReviewsSection';
import { MobileBottomBar } from '@/components/homestays/MobileBottomBar';
```

### Step 2: Replace Old Components

**Replace:**
```typescript
// OLD
<BookingForm homestay={homestay} rooms={rooms} />

// NEW
<ModernBookingCard 
  homestay={{
    id: homestay.id,
    slug: homestay.slug,
    title: homestay.title,
    basePrice: homestay.basePrice,
    currency: homestay.currency,
    cleaningFee: homestay.cleaningFee,
    minNights: homestay.minNights,
    maxGuests: homestay.maxGuests,
    ratingAverage: homestay.ratingAverage,
    reviewCount: homestay.reviewCount,
    isInstantBook: homestay.isInstantBook,
  }}
  rooms={rooms}
/>
```

**Replace:**
```typescript
// OLD
<ReviewsSection reviews={reviews} />

// NEW
<ModernReviewsSection 
  reviews={homestay.HomestayReview}
  ratingAverage={Number(homestay.ratingAverage)}
  reviewCount={homestay.reviewCount}
/>
```

### Step 3: Add New Sections

**After description, add:**
```typescript
{/* Highlights */}
<HighlightsSection 
  type={homestay.type}
  isInstantBook={homestay.isInstantBook}
  hasWifi={homestay.amenities?.includes('Wifi')}
  isSelfCheckin={homestay.checkInType === 'SELF_CHECKIN'}
/>
```

**After house rules, add:**
```typescript
{/* Amenities */}
<AmenitiesGrid amenities={homestay.amenities || []} />
```

**At the end, add:**
```typescript
{/* Mobile Bottom Bar */}
<MobileBottomBar 
  price={homestay.basePrice}
  currency={homestay.currency}
  rating={Number(homestay.ratingAverage)}
  reviewCount={homestay.reviewCount}
  onBookClick={() => {
    // Scroll to booking card
    document.getElementById('booking-card')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }}
/>
```

### Step 4: Add ID to Booking Card

```typescript
<div id="booking-card">
  <ModernBookingCard ... />
</div>
```

---

## 📝 COMPLETE PAGE STRUCTURE

```tsx
export default async function HomestayDetailPage({ params }: PageProps) {
  const homestay = await prisma.homestay.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: {
      HomestayRoom: { where: { status: 'ACTIVE' } },
      HomestayReview: { 
        where: { status: 'APPROVED' },
        take: 10,
        include: { User: true }
      },
      HomestayMedia: { include: { Media: true } },
      HomestayAvailability: { ... },
    },
  });

  if (!homestay) notFound();

  // Prepare gallery images
  const galleryImages = [
    ...(homestay.heroImageUrl ? [{ url: homestay.heroImageUrl, alt: homestay.title }] : []),
    ...homestay.HomestayMedia.map(item => ({
      url: item.Media.url,
      alt: item.Media.alt || homestay.title,
    })),
    ...(Array.isArray(homestay.galleryImageUrls) 
      ? homestay.galleryImageUrls
          .filter((url): url is string => typeof url === 'string' && url.length > 0)
          .map((url) => ({ url, alt: homestay.title }))
      : (homestay.galleryImageUrls && typeof homestay.galleryImageUrls === 'object')
      ? Object.values(homestay.galleryImageUrls)
          .filter((url): url is string => typeof url === 'string' && url.length > 0)
          .map((url) => ({ url, alt: homestay.title }))
      : []
    ),
  ];

  const bookedDates = homestay.HomestayAvailability?.map(avail => new Date(avail.date)) || [];

  return (
    <>
      {/* SEO - Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateHomestayStructuredData(homestay)) 
        }}
      />

      <Section className="py-8">
        <Container>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{homestay.title}</h1>
            <div className="flex flex-wrap items-center gap-4">
              {homestay.ratingAverage && homestay.reviewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {Number(homestay.ratingAverage).toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({homestay.reviewCount} đánh giá)
                  </span>
                </div>
              )}
              {homestay.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{homestay.city}, {homestay.country}</span>
                </div>
              )}
              <ShareButtons title={homestay.title} />
            </div>
          </div>

          {/* Gallery */}
          <Suspense fallback={<Loader />}>
            <HomestayGallery images={galleryImages} />
          </Suspense>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3 mt-8">
            {/* Left Column - 2/3 */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info */}
              <div className="flex flex-wrap gap-6 border-b pb-6">
                {homestay.maxGuests && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span>{homestay.maxGuests} khách</span>
                  </div>
                )}
                {homestay.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-muted-foreground" />
                    <span>{homestay.bedrooms} phòng ngủ</span>
                  </div>
                )}
                {homestay.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-muted-foreground" />
                    <span>{homestay.bathrooms} phòng tắm</span>
                  </div>
                )}
              </div>

              {/* Highlights */}
              <HighlightsSection 
                type={homestay.type}
                isInstantBook={homestay.isInstantBook}
                hasWifi={homestay.amenities?.includes('Wifi')}
                isSelfCheckin={homestay.checkInType === 'SELF_CHECKIN'}
              />

              {/* Description */}
              {homestay.description && (
                <div className="border-b pb-6">
                  <h2 className="text-2xl font-bold mb-4">Mô tả</h2>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{homestay.description}</p>
                  </div>
                </div>
              )}

              {/* Amenities */}
              <AmenitiesGrid amenities={homestay.amenities || []} />

              {/* House Rules */}
              {homestay.houseRules && homestay.houseRules.length > 0 && (
                <div className="border-b pb-6">
                  <h2 className="text-2xl font-bold mb-4">Nội quy</h2>
                  <div className="space-y-3">
                    {homestay.houseRules.map((rule: string) => (
                      <div key={rule} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability Calendar */}
              <div className="border-b pb-6">
                <h2 className="text-2xl font-bold mb-4">Lịch trống</h2>
                <AvailabilityCalendar 
                  homestayId={homestay.id}
                  bookedDates={bookedDates}
                />
              </div>

              {/* Location & Map */}
              <LocationMap homestay={homestay} />

              {/* Reviews */}
              <ModernReviewsSection 
                reviews={homestay.HomestayReview}
                ratingAverage={Number(homestay.ratingAverage)}
                reviewCount={homestay.reviewCount}
              />

              {/* Similar Properties */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Chỗ ở tương tự</h2>
                <SimilarHomestays 
                  city={homestay.city}
                  currentId={homestay.id}
                />
              </div>
            </div>

            {/* Right Column - 1/3 Sticky */}
            <div>
              <div id="booking-card">
                <ModernBookingCard 
                  homestay={{
                    id: homestay.id,
                    slug: homestay.slug,
                    title: homestay.title,
                    basePrice: homestay.basePrice,
                    currency: homestay.currency,
                    cleaningFee: homestay.cleaningFee,
                    minNights: homestay.minNights,
                    maxGuests: homestay.maxGuests,
                    ratingAverage: homestay.ratingAverage,
                    reviewCount: homestay.reviewCount,
                    isInstantBook: homestay.isInstantBook,
                  }}
                  rooms={homestay.HomestayRoom}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mobile Bottom Bar */}
      <MobileBottomBar 
        price={homestay.basePrice}
        currency={homestay.currency}
        rating={Number(homestay.ratingAverage)}
        reviewCount={homestay.reviewCount}
        onBookClick={() => {
          document.getElementById('booking-card')?.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }}
      />
    </>
  );
}
```

---

## 🗑️ REMOVE DEBUG LOGS

**File:** `/app/homestays/[slug]/page.tsx`

**Remove lines 79-109:**
```typescript
// DELETE THESE:
console.log('🖼️ Homestay galleryImageUrls:', homestay.galleryImageUrls);
console.log('🖼️ Type:', typeof homestay.galleryImageUrls);
console.log('🖼️ Is Array:', Array.isArray(homestay.galleryImageUrls));
console.log('🖼️ Total gallery images:', galleryImages.length);
console.log('🖼️ Gallery images:', galleryImages);
```

**File:** `/app/admin/homestays/[homestayId]/page.tsx`

**Remove lines 254-263:**
```typescript
// DELETE THESE:
console.log('🔧 Building form state from:', initial);
console.log('🔧 Gallery from initial:', initial?.galleryImageUrls);
console.log('🔧 Processed gallery URLs:', galleryUrls);
```

**Remove lines 2051-2054:**
```typescript
// DELETE THESE:
console.log('📝 Loaded homestay for edit:', homestay.id);
console.log('📸 Gallery images:', homestay.galleryImageUrls);
console.log('📸 Type:', typeof homestay.galleryImageUrls);
console.log('📸 Is Array:', Array.isArray(homestay.galleryImageUrls));
```

---

## ✅ FINAL CHECKLIST

### Components:
- [x] HomestayGallery - Mosaic layout
- [x] ModernBookingCard - Sticky sidebar
- [x] HighlightsSection - Icon grid
- [x] AmenitiesGrid - Expandable list
- [x] ModernReviewsSection - Rating breakdown
- [x] MobileBottomBar - Sticky CTA

### Integration:
- [ ] Update imports
- [ ] Replace old components
- [ ] Add new sections
- [ ] Add IDs for scroll
- [ ] Remove debug logs

### Testing:
- [ ] Build passes
- [ ] Desktop responsive
- [ ] Mobile responsive
- [ ] All features work
- [ ] Performance OK

---

## 🚀 RUN COMMANDS

```bash
# Remove debug logs first
# Then build
cd conphung
npm run build

# If build passes, run dev
npm run dev

# Test on browser
open http://localhost:3001/homestays/[slug]
```

---

Bạn muốn tôi thực hiện integration ngay bây giờ?
