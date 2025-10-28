# 🚀 Hướng Dẫn Bắt Đầu Nhanh

## 📦 Những Gì Vừa Được Tạo

Tôi đã tạo cho bạn:

### 1. **Tài Liệu Chiến Lược**
- ✅ `DEVELOPMENT_ROADMAP.md` - Lộ trình phát triển chi tiết 2-3 tháng
- ✅ `QUICK_START_GUIDE.md` - Hướng dẫn này

### 2. **SEO Infrastructure**
- ✅ `lib/seo/structured-data.ts` - JSON-LD generators cho Tours, Homestays, Posts
- ✅ `lib/seo/metadata.ts` - Next.js metadata generators

### 3. **Homestay Pages (Mẫu)**
- ✅ `app/homestays/page.tsx` - Trang danh sách homestay với filters
- ✅ `components/homestays/HomestayCard.tsx` - Card component
- ✅ `components/homestays/HomestayFilters.tsx` - Bộ lọc tìm kiếm

---

## 🎯 Bước Tiếp Theo - Ưu Tiên Cao

### **Bước 1: Kiểm Tra Build** (5 phút)

```bash
cd /Users/congtrinh/fullconphung-main/conphung
npm run build
```

Nếu có lỗi TypeScript, cần fix trước khi tiếp tục.

### **Bước 2: Test Trang Homestay** (10 phút)

```bash
npm run dev
```

Truy cập: `http://localhost:3000/homestays`

**Kiểm tra:**
- [ ] Trang load được không?
- [ ] Filters hoạt động?
- [ ] Cards hiển thị đúng?
- [ ] Responsive trên mobile?

### **Bước 3: Tạo Trang Chi Tiết Homestay** (2-3 giờ)

```bash
# File cần tạo:
conphung/app/homestays/[slug]/page.tsx
conphung/components/homestays/HomestayGallery.tsx
conphung/components/homestays/BookingForm.tsx
conphung/components/homestays/AvailabilityCalendar.tsx
conphung/components/homestays/ReviewsSection.tsx
```

**Template cho `app/homestays/[slug]/page.tsx`:**

```typescript
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { generateHomestayMetadata } from '@/lib/seo/metadata';
import { generateHomestayStructuredData } from '@/lib/seo/structured-data';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const homestay = await prisma.homestay.findUnique({
    where: { slug: params.slug },
  });

  if (!homestay) return {};
  return generateHomestayMetadata(homestay);
}

export default async function HomestayDetailPage({ params }: { params: { slug: string } }) {
  const homestay = await prisma.homestay.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' },
    include: {
      rooms: true,
      reviews: {
        where: { status: 'APPROVED' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { reviewer: true },
      },
    },
  });

  if (!homestay) notFound();

  const structuredData = generateHomestayStructuredData(homestay);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Your UI here */}
      <div>
        <h1>{homestay.title}</h1>
        {/* Add gallery, booking form, reviews, etc. */}
      </div>
    </>
  );
}
```

### **Bước 4: Nâng Cấp Sitemap** (30 phút)

Cập nhật file `conphung/app/sitemap.ts`:

```typescript
import { prisma } from '@/lib/prisma';

export default async function sitemap() {
  const baseUrl = 'https://conphungtourist.com/';

  // Fetch all published content
  const [tours, homestays, posts] = await Promise.all([
    prisma.tour.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    }),
    prisma.homestay.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    // Static pages
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/homestays`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    
    // Dynamic tours
    ...tours.map((tour) => ({
      url: `${baseUrl}/tours/${tour.slug}`,
      lastModified: tour.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    
    // Dynamic homestays
    ...homestays.map((homestay) => ({
      url: `${baseUrl}/homestays/${homestay.slug}`,
      lastModified: homestay.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    
    // Dynamic posts
    ...posts.map((post) => ({
      url: `${baseUrl}/news/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
```

### **Bước 5: Tạo N8N Webhook cho Booking** (1 giờ)

#### A. Tạo Workflow trong n8n

1. Mở n8n: `http://localhost:5678`
2. Tạo workflow mới: "Tour Booking Notification"
3. Thêm nodes:
   - Webhook (trigger)
   - Email Send (customer)
   - Email Send (admin)
   - Telegram (optional)

#### B. Cập nhật API Booking

File: `conphung/app/api/public/tours/[slug]/book/route.ts`

```typescript
// Thêm vào cuối hàm POST, sau khi tạo booking thành công:

// Send notification via n8n
if (process.env.N8N_BOOKING_WEBHOOK_URL) {
  try {
    await fetch(process.env.N8N_BOOKING_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference: booking.reference,
        tourTitle: tour.title,
        customerName: customer.fullName,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        totalAmount: booking.totalAmount,
        adults: booking.adults,
        children: booking.children,
        departureDate: departure.startDate,
        bookingUrl: `https://conphungtourist.com//admin/bookings/${booking.id}`,
      }),
    });
  } catch (error) {
    console.error('Failed to send n8n notification:', error);
    // Don't fail the booking if notification fails
  }
}
```

#### C. Thêm vào `.env`

```env
N8N_BOOKING_WEBHOOK_URL=http://localhost:5678/webhook/tour-booking
```

---

## 📊 Checklist Hoàn Thiện Phase 1

### **Frontend Public Pages**

#### Homestays
- [x] Trang danh sách `/homestays` (đã tạo)
- [x] Component `HomestayCard` (đã tạo)
- [x] Component `HomestayFilters` (đã tạo)
- [ ] Trang chi tiết `/homestays/[slug]`
- [ ] Component `HomestayGallery`
- [ ] Component `BookingForm`
- [ ] Component `AvailabilityCalendar`
- [ ] Component `ReviewsSection`

#### Tours (Nâng cấp)
- [ ] Nâng cấp trang chi tiết `/tours/[slug]`
- [ ] Component `ItineraryTimeline`
- [ ] Component `DepartureSelector`
- [ ] Nâng cấp `TourBookingForm`

#### Blog/News
- [ ] Trang danh sách `/news`
- [ ] Trang chi tiết `/news/[slug]`
- [ ] Component `PostCard`
- [ ] Component `PostContent`
- [ ] Component `TableOfContents`

#### Search
- [ ] Trang tìm kiếm `/search`
- [ ] Component `SearchBar`
- [ ] Component `SearchResults`
- [ ] Unified search API

#### Contact
- [ ] Trang liên hệ `/contact`
- [ ] Component `ContactForm`
- [ ] API `/api/contact`

### **SEO & Performance**
- [x] Structured data generators (đã tạo)
- [x] Metadata generators (đã tạo)
- [ ] Dynamic sitemap (cần cập nhật)
- [ ] robots.txt enhancement
- [ ] Image optimization config
- [ ] Code splitting setup

### **N8N Integration**
- [ ] Booking notification workflow
- [ ] Review reminder workflow
- [ ] Social auto-post workflow
- [ ] Analytics report workflow

---

## 🎨 Design System Reference

### **Colors**
```css
/* Đã có trong Tailwind config */
primary: green (du lịch, thiên nhiên)
secondary: blue (biển)
accent: amber (nắng)
```

### **Typography**
```css
font-family: Inter, sans-serif
heading: font-bold, tracking-tight
body: font-normal, leading-relaxed
```

### **Spacing**
```css
section-padding: py-12 md:py-20
container-max-width: max-w-7xl
card-radius: rounded-xl
```

### **Components Style**
- **Cards**: `rounded-xl border bg-card hover:shadow-lg`
- **Buttons**: `rounded-lg bg-primary px-4 py-2 font-medium`
- **Inputs**: `rounded-lg border bg-background px-3 py-2`

---

## 🔧 Troubleshooting

### **Lỗi TypeScript khi build**

```bash
# Kiểm tra types
npx tsc --noEmit

# Generate Prisma client
npx prisma generate
```

### **Lỗi import components**

Đảm bảo các component được export đúng:
```typescript
export function ComponentName() { ... }  // ✅ Đúng
export default function ComponentName() { ... }  // ⚠️ Cẩn thận với default export
```

### **Lỗi database connection**

```bash
# Kiểm tra PostgreSQL
docker ps

# Nếu chưa chạy
docker compose up -d postgres

# Test connection
npx prisma studio
```

### **Lỗi n8n webhook**

```bash
# Kiểm tra n8n đang chạy
curl http://localhost:5678/healthz

# Xem logs
docker logs n8n
```

---

## 📚 Tài Liệu Tham Khảo

### **Next.js 14**
- [App Router](https://nextjs.org/docs/app)
- [Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

### **Prisma**
- [Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Filtering](https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting)

### **SEO**
- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

### **n8n**
- [Webhook Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Email Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.emailsend/)

---

## 💡 Tips & Best Practices

### **Performance**
1. Luôn dùng `Image` component của Next.js
2. Lazy load components nặng với `dynamic()`
3. Implement pagination cho lists
4. Cache API responses với `revalidate`

### **SEO**
1. Mỗi page phải có unique title & description
2. Thêm structured data cho tất cả content types
3. Optimize images (alt text, proper sizing)
4. Internal linking giữa các pages

### **Code Quality**
1. Tách logic ra khỏi components (custom hooks, utils)
2. Reuse components (DRY principle)
3. Type safety với TypeScript
4. Validation với Zod schemas

### **Security**
1. Validate tất cả user inputs
2. Sanitize data trước khi lưu DB
3. Rate limit cho APIs
4. Không expose sensitive data

---

## 🎯 Mục Tiêu Tuần Này

### **Week 1: Homestay Pages**
- [ ] Hoàn thành trang chi tiết homestay
- [ ] Implement booking form
- [ ] Add reviews section
- [ ] Test responsive design

### **Week 2: Tours Enhancement**
- [ ] Nâng cấp tour detail page
- [ ] Add itinerary timeline
- [ ] Improve booking flow
- [ ] Add related tours

### **Week 3: Blog & Search**
- [ ] Create blog listing page
- [ ] Create blog detail page
- [ ] Implement search functionality
- [ ] Add contact page

### **Week 4: SEO & N8N**
- [ ] Complete SEO optimization
- [ ] Setup n8n workflows
- [ ] Performance testing
- [ ] Bug fixes & polish

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console logs (browser & terminal)
2. Xem lại documentation
3. Google error message
4. Ask me for help!

---

**Chúc bạn code vui vẻ! 🚀**
