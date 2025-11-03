# ✅ Homepage Merge - COMPLETE

**Status**: ✅ **UNIFIED HOMEPAGE SETTINGS READY**

---

## 🎯 Mục tiêu đã hoàn thành

Đã **merge** 2 trang (`/admin/homepage` và `/admin/homepage-settings`) thành **1 trang duy nhất** với đầy đủ tất cả sections.

---

## 📊 Tổng hợp Sections (18 tabs)

### Core Sections (4)
1. ✅ **Hero** - Banner chính (full với phone, address, hours, 2 CTAs)
2. ✅ **About** - Giới thiệu với rich text editor
3. ✅ **Features** - 3 features cards (Tận tâm, Giá tốt, Hỗ trợ)
4. ✅ **SEO** - Meta tags, OG image, keywords

### Product Sections (4)
5. ✅ **Promotion** - Khuyến mãi với image, discount
6. ✅ **Ticket** - Vé cổng với giá, included items
7. ✅ **Tours** - Tour pricing với nhiều tours
8. ✅ **Services** - Featured Services từ Service table

### Content Sections (7)
9. ✅ **Gallery** - Image carousel
10. ✅ **Video** - Video hướng dẫn
11. ✅ **Latest Posts** - Config cho bài viết mới nhất
12. ✅ **Certificates** - Giấy phép & chứng nhận
13. ✅ **Policies** - Chính sách links
14. ✅ **Restaurant** - ⭐ NEW - Nhà hàng section
15. ✅ **FAQ** - ⭐ NEW - Câu hỏi thường gặp

### Location & CTA (2)
16. ✅ **Map** - Google Maps embed
17. ✅ **CTA Booking** - Call-to-action booking

### Special Features
- ✅ **Draft/Published** workflow
- ✅ **Preview Mode** support
- ✅ **Version tracking**
- ✅ **Auto-save** indicator

---

## 🗄️ Database Schema

### Updated `HomepageSettings`
```prisma
model HomepageSettings {
  id          String   @id @default(cuid())
  sections    Json?   // Unified JSON với tất cả sections
  // ... legacy fields (backward compatible)
  status      HomepageStatus @default(DRAFT)
  publishedAt DateTime?
  version     Int      @default(1)
  // ...
}
```

### Extended Schema
- ✅ Added `aboutSectionSchema`
- ✅ Added `restaurantSectionSchema`
- ✅ Added `faqSectionSchema`
- ✅ Extended `homepageConfigSchema` với 3 sections mới

---

## 🔌 API Endpoints

### Unified API
**GET/PUT** `/api/admin/homepage-settings-unified`
- Loads từ `HomepageSettings.sections` (JSON)
- Fallback về `HomepageSection` (old CMS) nếu chưa có
- Merge cả 2 sources để đảm bảo đầy đủ

### Backward Compatibility
- Old API `/api/admin/homepage` vẫn hoạt động
- Unified API cũng save vào `HomepageSection` để tương thích

---

## 📁 Files Created/Updated

### New Files
1. ✅ `app/api/admin/homepage-settings-unified/route.ts` - Unified API
2. ✅ `components/admin/homepage-settings/RestaurantSectionEditor.tsx`
3. ✅ `components/admin/homepage-settings/FAQSectionEditor.tsx`
4. ✅ `app/admin/homepage-settings/page-merged.tsx` → merged to `page.tsx`

### Updated Files
1. ✅ `prisma/schema.prisma` - Added `sections` JSON field
2. ✅ `lib/homepage/schema.ts` - Added 3 new schemas
3. ✅ `app/admin/homepage-settings/page.tsx` - Now unified với 18 tabs
4. ✅ `app/admin/homepage/page.tsx` - Added link to unified page

---

## 🎨 UI Structure

### Tab Organization
```
Core:
- Hero | About | Features | SEO

Products:
- Promotion | Ticket | Tours | Services

Content:
- Gallery | Video | Posts | Certificates | Policies | Restaurant | FAQ

Location:
- Map | CTA Booking
```

### Features
- ✅ Organized tabs by category
- ✅ All editors from old CMS integrated
- ✅ New editors (About, Restaurant, FAQ, SEO, Services)
- ✅ Draft/Published workflow
- ✅ Preview mode
- ✅ Refresh button
- ✅ Direct preview link
- ✅ Save button (top & bottom)

---

## 🔄 Migration Path

### Option 1: Use Unified Page (Recommended)
1. Access `/admin/homepage-settings`
2. Data tự động merge từ old CMS
3. Save vào unified format (JSON in `HomepageSettings.sections`)

### Option 2: Keep Both (Temporary)
- Old page: `/admin/homepage` (still works)
- New unified: `/admin/homepage-settings` (recommended)

### Option 3: Redirect Old to New
```typescript
// In app/admin/homepage/page.tsx
redirect('/admin/homepage-settings');
```

---

## ✅ Testing Checklist

- [ ] Access `/admin/homepage-settings`
- [ ] Verify tất cả 18 tabs hiển thị
- [ ] Test save/load cho mỗi section
- [ ] Test Draft/Published workflow
- [ ] Test Preview mode
- [ ] Verify data merge từ old CMS
- [ ] Check backward compatibility
- [ ] Test image uploads
- [ ] Verify SEO settings save
- [ ] Test Featured Services selection

---

## 🚀 Next Steps

1. **Run Migration**:
   ```bash
   cd conphung
   npx prisma migrate dev --name add_homepage_settings_sections_json
   npx prisma generate
   ```

2. **Test Unified Page**:
   - Navigate to `/admin/homepage-settings`
   - Verify all tabs load
   - Test saving each section

3. **Update Homepage Renderer**:
   - Update `app/page.tsx` to use unified API
   - Use ISR with 120s revalidate
   - Fetch from `/api/public/homepage-settings-unified`

4. **Migration Script** (Optional):
   - Migrate existing `HomepageSection` data to `HomepageSettings.sections`
   - Preserve all existing content

---

## 📝 Notes

- **Backward Compatible**: Old homepage CMS still works
- **Dual Save**: Unified API saves to both `HomepageSettings` AND `HomepageSection`
- **Migration**: Existing data auto-merged on first load
- **Default Values**: Uses `DEFAULT_CONFIG` from `sections.ts` as fallback

---

**Status**: ✅ **MERGE COMPLETE - READY FOR TESTING**

🎉 Bây giờ bạn có **1 trang duy nhất** để quản lý toàn bộ nội dung trang chủ!

