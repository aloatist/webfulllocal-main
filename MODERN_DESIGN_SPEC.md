# 🎨 THIẾT KẾ HIỆN ĐẠI - HOMESTAY, POST, TOUR

**Phong cách:** Airbnb + Booking.com + Modern Minimalist  
**Framework:** Next.js 14 + TailwindCSS + Shadcn/UI  
**Mobile-first:** Responsive, Touch-friendly  
**SEO:** Structured Data, Meta Tags, Performance

---

## 🏠 HOMESTAY DETAIL PAGE

### 📐 Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  Breadcrumb: Home > Homestays > [City] > [Name]     │
├─────────────────────────────────────────────────────┤
│  HERO SECTION                                        │
│  ┌──────────────────────────────────────────────┐  │
│  │  Image Gallery (Mosaic Grid)                  │  │
│  │  ┌────────┬────┬────┐                        │  │
│  │  │  Main  │ 2  │ 3  │  + View all photos    │  │
│  │  │  Image │────┼────┤                        │  │
│  │  │        │ 4  │ 5  │                        │  │
│  │  └────────┴────┴────┘                        │  │
│  └──────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  STICKY HEADER (scroll)                              │
│  [Title] [Rating] [Share] [Save]          [Book Now]│
├──────────────────────────┬──────────────────────────┤
│  LEFT COLUMN (8/12)      │  RIGHT COLUMN (4/12)     │
│                          │  ┌────────────────────┐  │
│  📍 Location Info        │  │  BOOKING CARD      │  │
│  ⭐ Rating Summary       │  │  (Sticky)          │  │
│  👤 Host Info            │  │  - Price/night     │  │
│                          │  │  - Date picker     │  │
│  📝 Description          │  │  - Guests select   │  │
│                          │  │  - Total price     │  │
│  ✨ Highlights           │  │  - Book button     │  │
│  - Entire place          │  │  - Contact host    │  │
│  - Self check-in         │  │  └────────────────┘  │
│  - Great location        │  │                       │
│                          │  │  🛡️ Trust & Safety   │
│  🏠 Rooms & Spaces       │  │  - Verified          │
│  [Room Cards Grid]       │  │  - Cancellation      │
│                          │  │  - Support 24/7      │
│  🎯 Amenities            │  └──────────────────────┘
│  [Icon Grid]             │
│                          │
│  📋 House Rules          │
│  [Expandable List]       │
│                          │
│  📅 Availability         │
│  [Calendar Widget]       │
│                          │
│  📍 Location & Map       │
│  [Interactive Map]       │
│                          │
│  ⭐ Reviews              │
│  [Rating Breakdown]      │
│  [Review Cards]          │
│                          │
│  🏘️ Similar Properties  │
│  [Horizontal Scroll]     │
│                          │
└──────────────────────────┴──────────────────────────┘
```

---

## 🎨 DESIGN TOKENS

### Colors
```css
--primary: 220 90% 56%        /* Blue #2563eb */
--secondary: 142 76% 36%      /* Green #059669 */
--accent: 24 95% 53%          /* Orange #f97316 */
--success: 142 71% 45%        /* Green #10b981 */
--warning: 38 92% 50%         /* Yellow #f59e0b */
--error: 0 84% 60%            /* Red #ef4444 */
--background: 0 0% 100%       /* White */
--foreground: 222 47% 11%     /* Dark */
--muted: 210 40% 96%          /* Light gray */
--border: 214 32% 91%         /* Border */
```

### Typography
```css
--font-sans: 'Inter', system-ui, sans-serif
--font-display: 'Cal Sans', 'Inter', sans-serif

h1: 2.5rem / 3rem, font-bold, tracking-tight
h2: 2rem / 2.5rem, font-bold
h3: 1.5rem / 2rem, font-semibold
body: 1rem / 1.5rem, font-normal
small: 0.875rem / 1.25rem
```

### Spacing
```css
--spacing-xs: 0.5rem    /* 8px */
--spacing-sm: 0.75rem   /* 12px */
--spacing-md: 1rem      /* 16px */
--spacing-lg: 1.5rem    /* 24px */
--spacing-xl: 2rem      /* 32px */
--spacing-2xl: 3rem     /* 48px */
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

---

## 🖼️ IMAGE GALLERY - MOSAIC LAYOUT

### Desktop (≥1024px)
```tsx
<div className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden h-[500px]">
  {/* Main Image - 2x2 */}
  <div className="col-span-2 row-span-2 relative group cursor-pointer">
    <Image src={images[0]} fill className="object-cover" />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
  </div>
  
  {/* Top Right */}
  <div className="col-span-1 row-span-1 relative group cursor-pointer">
    <Image src={images[1]} fill className="object-cover" />
  </div>
  <div className="col-span-1 row-span-1 relative group cursor-pointer">
    <Image src={images[2]} fill className="object-cover" />
  </div>
  
  {/* Bottom Right */}
  <div className="col-span-1 row-span-1 relative group cursor-pointer">
    <Image src={images[3]} fill className="object-cover" />
  </div>
  <div className="col-span-1 row-span-1 relative group cursor-pointer">
    <Image src={images[4]} fill className="object-cover" />
    {/* Show all photos button */}
    <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg">
      <Grid className="w-4 h-4 mr-2" />
      Xem tất cả {images.length} ảnh
    </button>
  </div>
</div>
```

### Mobile (<1024px)
```tsx
{/* Horizontal scroll carousel */}
<div className="relative">
  <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-4">
    {images.map((img, i) => (
      <div key={i} className="flex-none w-full snap-center">
        <Image src={img} width={800} height={600} className="rounded-xl" />
      </div>
    ))}
  </div>
  {/* Dots indicator */}
  <div className="flex justify-center gap-2 mt-2">
    {images.map((_, i) => (
      <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
    ))}
  </div>
</div>
```

---

## 📱 BOOKING CARD - STICKY SIDEBAR

```tsx
<div className="sticky top-24 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xl">
  {/* Price */}
  <div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold">
        {formatPrice(homestay.basePrice)}
      </span>
      <span className="text-muted-foreground">/ đêm</span>
    </div>
    {homestay.ratingAverage && (
      <div className="flex items-center gap-2 mt-2">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold">{homestay.ratingAverage}</span>
        <span className="text-muted-foreground">
          ({homestay.reviewCount} đánh giá)
        </span>
      </div>
    )}
  </div>

  {/* Date Picker */}
  <div className="grid grid-cols-2 gap-2">
    <div className="border rounded-lg p-3">
      <label className="text-xs font-semibold uppercase">Nhận phòng</label>
      <input type="date" className="w-full mt-1" />
    </div>
    <div className="border rounded-lg p-3">
      <label className="text-xs font-semibold uppercase">Trả phòng</label>
      <input type="date" className="w-full mt-1" />
    </div>
  </div>

  {/* Guests */}
  <div className="border rounded-lg p-3">
    <label className="text-xs font-semibold uppercase">Khách</label>
    <select className="w-full mt-1">
      {[1,2,3,4,5,6].map(n => (
        <option key={n}>{n} khách</option>
      ))}
    </select>
  </div>

  {/* Price Breakdown */}
  <div className="space-y-2 pt-4 border-t">
    <div className="flex justify-between">
      <span>{formatPrice(basePrice)} x 3 đêm</span>
      <span>{formatPrice(basePrice * 3)}</span>
    </div>
    <div className="flex justify-between">
      <span>Phí dịch vụ</span>
      <span>{formatPrice(serviceFee)}</span>
    </div>
    <div className="flex justify-between font-bold text-lg pt-2 border-t">
      <span>Tổng cộng</span>
      <span>{formatPrice(total)}</span>
    </div>
  </div>

  {/* CTA Buttons */}
  <div className="space-y-2">
    <Button size="lg" className="w-full">
      Đặt ngay
    </Button>
    <Button variant="outline" size="lg" className="w-full">
      <MessageCircle className="w-4 h-4 mr-2" />
      Liên hệ chủ nhà
    </Button>
  </div>

  {/* Trust Badges */}
  <div className="text-center text-sm text-muted-foreground">
    <p>Bạn sẽ chưa bị trừ tiền</p>
    <div className="flex justify-center gap-4 mt-3">
      <div className="flex items-center gap-1">
        <Shield className="w-4 h-4" />
        <span>Thanh toán an toàn</span>
      </div>
      <div className="flex items-center gap-1">
        <Check className="w-4 h-4" />
        <span>Hủy miễn phí</span>
      </div>
    </div>
  </div>
</div>
```

---

## ✨ HIGHLIGHTS SECTION

```tsx
<div className="grid md:grid-cols-2 gap-6 py-8 border-y">
  <div className="flex gap-4">
    <div className="flex-shrink-0">
      <Home className="w-8 h-8 text-primary" />
    </div>
    <div>
      <h3 className="font-semibold mb-1">Toàn bộ nhà</h3>
      <p className="text-sm text-muted-foreground">
        Bạn sẽ có cả không gian cho riêng mình
      </p>
    </div>
  </div>

  <div className="flex gap-4">
    <div className="flex-shrink-0">
      <Sparkles className="w-8 h-8 text-primary" />
    </div>
    <div>
      <h3 className="font-semibold mb-1">Vệ sinh tăng cường</h3>
      <p className="text-sm text-muted-foreground">
        Chủ nhà cam kết vệ sinh 5 bước của Airbnb
      </p>
    </div>
  </div>

  <div className="flex gap-4">
    <div className="flex-shrink-0">
      <MapPin className="w-8 h-8 text-primary" />
    </div>
    <div>
      <h3 className="font-semibold mb-1">Vị trí tuyệt vời</h3>
      <p className="text-sm text-muted-foreground">
        100% khách gần đây đánh giá 5 sao về vị trí
      </p>
    </div>
  </div>

  <div className="flex gap-4">
    <div className="flex-shrink-0">
      <Calendar className="w-8 h-8 text-primary" />
    </div>
    <div>
      <h3 className="font-semibold mb-1">Hủy miễn phí</h3>
      <p className="text-sm text-muted-foreground">
        Hủy trước 48h để được hoàn tiền đầy đủ
      </p>
    </div>
  </div>
</div>
```

---

## 🎯 AMENITIES GRID

```tsx
<div className="py-8 border-b">
  <h2 className="text-2xl font-bold mb-6">Tiện nghi</h2>
  <div className="grid md:grid-cols-2 gap-4">
    {amenities.slice(0, showAll ? amenities.length : 10).map((amenity) => (
      <div key={amenity} className="flex items-center gap-3 py-2">
        <AmenityIcon name={amenity} className="w-6 h-6 text-muted-foreground" />
        <span>{amenity}</span>
      </div>
    ))}
  </div>
  {amenities.length > 10 && (
    <Button 
      variant="outline" 
      className="mt-4"
      onClick={() => setShowAll(!showAll)}
    >
      {showAll ? 'Thu gọn' : `Hiện tất cả ${amenities.length} tiện nghi`}
    </Button>
  )}
</div>
```

---

## ⭐ REVIEWS SECTION

```tsx
<div className="py-8 border-b">
  <div className="flex items-center gap-2 mb-6">
    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
    <h2 className="text-2xl font-bold">
      {homestay.ratingAverage} · {homestay.reviewCount} đánh giá
    </h2>
  </div>

  {/* Rating Breakdown */}
  <div className="grid md:grid-cols-2 gap-6 mb-8">
    {Object.entries(ratingCategories).map(([category, score]) => (
      <div key={category}>
        <div className="flex justify-between mb-2">
          <span className="text-sm">{category}</span>
          <span className="text-sm font-semibold">{score}</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-foreground rounded-full"
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
      </div>
    ))}
  </div>

  {/* Review Cards */}
  <div className="grid md:grid-cols-2 gap-6">
    {reviews.map((review) => (
      <div key={review.id} className="space-y-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={review.user.image} />
            <AvatarFallback>{review.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{review.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              className={cn(
                "w-4 h-4",
                i < review.rating 
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          ))}
        </div>
        <p className="text-sm line-clamp-4">{review.comment}</p>
        {review.comment.length > 200 && (
          <button className="text-sm font-semibold underline">
            Xem thêm
          </button>
        )}
      </div>
    ))}
  </div>

  <Button variant="outline" className="mt-6">
    Xem tất cả {homestay.reviewCount} đánh giá
  </Button>
</div>
```

---

## 📍 LOCATION & MAP

```tsx
<div className="py-8 border-b">
  <h2 className="text-2xl font-bold mb-2">Vị trí</h2>
  <p className="text-muted-foreground mb-6">
    {homestay.city}, {homestay.country}
  </p>

  {/* Interactive Map */}
  <div className="rounded-xl overflow-hidden h-[400px] mb-6">
    <Map 
      center={[homestay.latitude, homestay.longitude]}
      zoom={15}
      markers={[{
        position: [homestay.latitude, homestay.longitude],
        popup: homestay.title
      }]}
    />
  </div>

  {/* Nearby Places */}
  <div className="grid md:grid-cols-2 gap-4">
    <div className="flex justify-between py-3 border-b">
      <span>🏖️ Bãi biển</span>
      <span className="text-muted-foreground">5 phút đi bộ</span>
    </div>
    <div className="flex justify-between py-3 border-b">
      <span>🍴 Nhà hàng</span>
      <span className="text-muted-foreground">2 phút đi bộ</span>
    </div>
    <div className="flex justify-between py-3 border-b">
      <span>🏪 Siêu thị</span>
      <span className="text-muted-foreground">10 phút đi bộ</span>
    </div>
    <div className="flex justify-between py-3 border-b">
      <span>✈️ Sân bay</span>
      <span className="text-muted-foreground">30 phút lái xe</span>
    </div>
  </div>
</div>
```

---

## 📱 MOBILE OPTIMIZATIONS

### Sticky Bottom Bar
```tsx
{/* Mobile only - Fixed bottom */}
<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
  <div className="flex items-center justify-between">
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold">{formatPrice(price)}</span>
        <span className="text-sm text-muted-foreground">/ đêm</span>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        <span>{rating}</span>
      </div>
    </div>
    <Button size="lg">Đặt ngay</Button>
  </div>
</div>
```

### Touch Gestures
- Swipe gallery
- Pull to refresh
- Pinch to zoom images
- Smooth scroll

---

## 🎯 SEO OPTIMIZATION

### Meta Tags
```tsx
export async function generateMetadata({ params }: PageProps) {
  const homestay = await getHomestay(params.slug);
  
  return {
    title: `${homestay.title} - ${homestay.city} | YourSite`,
    description: homestay.summary || homestay.description?.slice(0, 160),
    keywords: [homestay.city, homestay.country, 'homestay', 'villa', ...homestay.amenities],
    openGraph: {
      title: homestay.title,
      description: homestay.summary,
      images: [homestay.heroImageUrl],
      type: 'website',
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: homestay.title,
      description: homestay.summary,
      images: [homestay.heroImageUrl],
    },
    alternates: {
      canonical: `/homestays/${params.slug}`,
    },
  };
}
```

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Villa Biển Đà Nẵng",
  "image": ["url1", "url2"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Võ Nguyên Giáp",
    "addressLocality": "Đà Nẵng",
    "addressCountry": "VN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 16.0544,
    "longitude": 108.2022
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  },
  "priceRange": "$$"
}
```

---

Tiếp theo tôi sẽ implement code thực tế! Bạn muốn tôi bắt đầu với component nào trước?

1. **HomestayGallery** - Mosaic layout
2. **BookingCard** - Sticky sidebar
3. **ReviewsSection** - Modern reviews
4. **Toàn bộ page** - Complete redesign
