# 🎯 Kế hoạch Merge Homepage CMS vào Home Settings

## 📊 Nghiên cứu Homepage Hiện Tại

### Sections trên Homepage (app/page.tsx)

1. ✅ **HeroSection** - Banner chính với phone, address, hours
2. ✅ **PromotionSection** - Khuyến mãi với image, discount
3. ✅ **TicketSection** - Vé cổng với giá, included items
4. ✅ **TourPricingSection** - Tour pricing với nhiều tours
5. ✅ **HomestaySection** - Coco Island homestay
6. ✅ **LatestPostsSection** - Bài viết mới nhất (auto từ DB)
7. ✅ **RestaurantSection** - Nhà hàng với specialties
8. ⚠️ **FAQ Section** - Hard-coded trong page.tsx
9. ⚠️ **About Section** - Hard-coded "Thông tin về chúng tôi"
10. ⚠️ **Policy Links** - Hard-coded 4 links
11. ✅ **MapSection** - Google Maps embed
12. ✅ **GallerySection** - Carousel images
13. ✅ **CTABookingSection** - Call-to-action booking
14. ✅ **VideoGuideSection** - Video hướng dẫn
15. ✅ **FeaturesSection** - 3 features (Tận tâm, Giá tốt, Hỗ trợ)

### Homepage CMS Cũ Quản Lý (app/admin/homepage)

12 tabs với editors cho:
- Hero, Features, Promotion, Ticket, Tours, Certificates, Policies, Gallery, Map, Video, CTA, Posts

### Home Settings Mới Hiện Tại

5 tabs:
- Hero (đơn giản), About, CTA, Featured Services, SEO

---

## ✅ Plan: Merge Tất Cả Vào Home Settings Đầy Đủ

### Unified Schema (Tất cả sections)

1. **Hero** - Full (phone, address, hours, 2 CTAs)
2. **About** - NEW với rich text editor
3. **Promotion** - Khuyến mãi
4. **Ticket** - Vé cổng
5. **Tour Pricing** - Tours pricing
6. **Features** - 3 features cards
7. **Certificates** - Giấy phép
8. **Restaurant** - NEW - Nhà hàng section
9. **Homestay** - Coco Island
10. **Gallery** - Image carousel
11. **Map** - Google Maps
12. **Video Guide** - Videos
13. **CTA Booking** - CTA section
14. **Featured Services** - Services từ Service table
15. **Latest Posts** - Config cho latest posts
16. **Policy Links** - 4 policy links
17. **FAQ** - NEW - FAQ section
18. **SEO** - Meta tags, OG image

### Database Schema Update

Extend `HomepageSettings` với JSON field cho tất cả sections:
```prisma
model HomepageSettings {
  // ... existing fields
  sections JSON? // All sections data
  status HomepageStatus
  publishedAt DateTime?
}
```

Hoặc tách thành nhiều models riêng cho từng section.

### Implementation Steps

1. ✅ Update Prisma schema
2. ✅ Create unified API endpoint
3. ✅ Merge tất cả editors vào một page
4. ✅ Add missing editors (About, Restaurant, FAQ)
5. ✅ Update homepage renderer để dùng unified data
6. ✅ Migration từ old data

---

## 📋 Final Home Settings Page Structure

### Tabs Organization (18 tabs total)

**Core Sections:**
1. Hero
2. About ⭐ NEW
3. SEO ⭐ NEW
4. Features

**Product Sections:**
5. Promotion
6. Ticket
7. Tour Pricing
8. Homestay
9. Featured Services ⭐ NEW
10. Restaurant ⭐ NEW

**Content Sections:**
11. Gallery
12. Video Guide
13. Latest Posts
14. Certificates
15. Policy Links
16. FAQ ⭐ NEW

**Location & CTA:**
17. Map
18. CTA Booking

**Status:**
- Draft/Published toggle
- Preview mode
- Version tracking

---

## 🎨 UI Organization

### Group Tabs by Category

**Tab Groups:**
- **Core** (Hero, About, SEO)
- **Products** (Promotion, Ticket, Tours, Homestay, Services, Restaurant)
- **Content** (Gallery, Video, Posts, Certificates, Policies, FAQ)
- **Location** (Map, CTA)

### Collapsible Sections

Allow admin to show/hide sections on homepage.

---

## ✅ Next Steps

1. Create unified schema
2. Merge all editors
3. Update database models
4. Create unified API
5. Update homepage renderer
6. Migration script

