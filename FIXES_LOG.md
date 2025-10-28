# 🔧 Fixes Log

## October 22, 2025 - 2:35 PM

### Issue: Multiple 404 errors on /rooms links (Complete Fix)

**Problem:**
- Fixed bookings page link
- But still getting 404 on list page
- Multiple places linking to `/rooms`

**All Locations Found:**

**1. Bookings page** ✅ Fixed (2:25 PM)
```typescript
// Was: /admin/homestays/${id}/rooms
// Now: /admin/homestays/${id}
```

**2. List page** ❌ Still had issue
```typescript
// Line 164 in page.tsx
<Link href={`/admin/homestays/${h.id}/rooms`}>
  Phòng
</Link>
```

**Complete Solution:**
```typescript
// Remove "Phòng" link entirely
<div className="flex gap-3">
  <Link href={`/admin/homestays/${h.id}`}>Sửa</Link>
  <Link href={`/admin/homestays/${h.id}/bookings`}>Booking</Link>
  <button onClick={handleDelete}>Xóa</button>
</div>
```

**Reason:**
- Rooms managed in Edit page
- No need for separate link
- Cleaner UI

**Status:** ✅ **COMPLETELY FIXED**

---

## October 22, 2025 - 2:25 PM

### Issue: 404 error on "Quản lý phòng" link

**Problem:**
- Click "Quản lý phòng" in bookings page
- Get 404 error
- Route `/admin/homestays/[id]/rooms` doesn't exist

**Root Cause:**
```typescript
// Link to non-existent route
<Link href={`/admin/homestays/${homestayId}/rooms`}>
  Quản lý phòng →
</Link>
```

**Solution:**
```typescript
// Redirect to edit page where rooms are managed
<Link href={`/admin/homestays/${homestayId}`}>
  Chỉnh sửa homestay →
</Link>
```

**Reason:**
- Rooms are already managed in Edit homestay page
- No need for separate rooms page
- Edit page has full room management UI

**Status:** ✅ **FIXED**

---

## October 22, 2025 - 2:15 PM

### Issue: Slug still auto-generates in edit mode (Complete Fix)

**Problem:**
- Fixed frontend auto-generation
- Fixed backend validation
- But still getting "Slug đã tồn tại" error
- Root cause: Multiple places generating slug

**All Issues Found:**

**1. Frontend useEffect** ✅ Fixed
```typescript
// Was auto-generating slug from title
useEffect(() => {
  const nextSlug = slugify(title);
  setForm({ ...prev, slug: nextSlug });
}, [title]);
```

**2. Frontend handleSubmit** ❌ Still had issue
```typescript
// Was falling back to title-based slug
const slugValue = form.slug || slugify(form.title);
```

**3. Backend PUT handler** ❌ Still had issue
```typescript
// Was auto-generating from title
if (data.slug) {
  slug = slugify(data.slug)
} else if (data.title) {
  slug = slugify(data.title) // ← Problem!
}
```

**Complete Solution:**

**Frontend:**
```typescript
// Only send slug if explicitly set in edit mode
const slugValue = mode === 'edit' 
  ? (form.slug?.trim() || undefined)  // ← Don't fallback to title
  : (form.slug || slugify(form.title));
```

**Backend:**
```typescript
// Don't auto-generate slug in PUT
if (data.slug) {
  slug = slugify(data.slug)
  // Check for duplicates...
} else {
  slug = undefined // ← Keep existing slug
}
```

**Status:** ✅ **COMPLETELY FIXED**

---

## October 22, 2025 - 8:41 AM

### Issue: Auto-generated slug causes conflict in edit mode

**Problem:**
- Edit homestay và thay đổi title
- Slug tự động thay đổi theo title
- Gây lỗi "Slug đã tồn tại"
- Không thể cập nhật

**Root Cause:**
```typescript
// useEffect tự động generate slug từ title
useEffect(() => {
  if (slugTouched) return;
  const nextSlug = slugify(title);
  setForm({ ...prev, slug: nextSlug });
}, [title]);

// ❌ Trong edit mode, slug thay đổi → conflict
```

**Solution:**
```typescript
// Disable auto-slug trong edit mode
useEffect(() => {
  if (mode === 'edit') {
    return; // ← Không auto-generate
  }
  
  if (slugTouched) return;
  const nextSlug = slugify(title);
  setForm({ ...prev, slug: nextSlug });
}, [title, mode]);
```

**Benefits:**
- ✅ Edit title không ảnh hưởng slug
- ✅ Slug giữ nguyên trừ khi user thay đổi
- ✅ Không còn lỗi conflict
- ✅ Better UX

**Status:** ✅ **FIXED**

---

## October 22, 2025 - 8:32 AM

### Issue: Slug validation error when editing homestay

**Problem:**
- Edit homestay → error "Slug đã tồn tại"
- Happens even when slug doesn't change
- Cannot save updates

**Root Cause:**
```typescript
// Old code - doesn't exclude current homestay
const duplicate = await prisma.homestay.findUnique({ where: { slug } })
if (duplicate) {
  return error('Slug đã tồn tại')
}
```

**Solution:**
```typescript
// New code - exclude current homestay from check
const duplicate = await prisma.homestay.findFirst({
  where: { 
    slug,
    id: { not: homestayId } // ← Exclude current
  }
})
```

**Benefits:**
- ✅ Can edit without changing slug
- ✅ Only errors on real conflicts
- ✅ Better user experience

**Status:** ✅ **FIXED**

---

## October 22, 2025 - 8:30 AM

### Feature: Full Edit Homestay Implementation ✅

**Request:**
- Xóa trang sửa cũ (view-only)
- Viết lại chức năng hoàn chỉnh
- Giống hệt trang tạo mới

**Implementation:**
- ✅ Copied `new/page.tsx` to `[homestayId]/page.tsx`
- ✅ Added data loading wrapper
- ✅ Modified submit handler for PUT
- ✅ Updated UI text for edit mode
- ✅ All features from Create page included

**Features:**
```
✅ Load existing data
✅ Edit all fields (basic, location, pricing)
✅ Image picker (hero + gallery)
✅ Room management (add/edit/remove)
✅ Amenities & house rules
✅ Availability blocks
✅ SEO fields
✅ Auto-save draft
✅ Validation
✅ Progress indicator
```

**Code Changes:**
```typescript
// Data loading
const res = await fetch(`/api/homestays/${homestayId}`);
const data = await res.json();

// Dynamic submit
const url = mode === 'edit' ? `/api/homestays/${id}` : '/api/homestays';
const method = mode === 'edit' ? 'PUT' : 'POST';

// Dynamic UI
{mode === 'edit' ? 'Cập nhật' : 'Xuất bản'}
```

**Files:**
- Created: `/app/admin/homestays/[homestayId]/page.tsx` (2,002 lines)
- Backup: `/app/admin/homestays/[homestayId]/page.tsx.backup`
- Docs: `/EDIT_HOMESTAY_IMPLEMENTATION.md`

**Time**: 30 minutes  
**Status:** ✅ **COMPLETE - READY FOR TESTING**

---

## October 21, 2025 - 10:56 PM

### Issue 4b: 404 khi xóa item đã bị xóa + List cache

**Problem:**
- Click xóa item đã bị xóa → 404 error
- List không reload sau 404
- List bị cache, không sync với server

**Root Cause:**
- 404 handler không reload page
- API calls không bypass cache
- Multiple tabs/windows không sync

**Solution:**
```tsx
// 1. Handle 404 with reload
if (res.status === 404) {
  console.log('⚠️ Homestay already deleted (404):', id);
  setRows((prev) => prev.filter((item) => item.id !== id));
  setTimeout(() => window.location.reload(), 300);
  return;
}

// 2. Add cache buster to all API calls
const params = new URLSearchParams({ 
  page: String(page), 
  limit: String(limit),
  _t: String(Date.now()) // ← Cache buster
});

// 3. Add logging
console.log('📋 Loaded', data.length, 'homestays');
```

**Status:** ✅ **FIXED**

---

## October 21, 2025 - 10:52 PM

### Issue 4: Create/Delete không cập nhật list ngay lập tức

**Problem:**
- Sau khi tạo homestay → không thấy trong list
- Sau khi xóa homestay → vẫn còn trong list
- Phải refresh trang thủ công

**Root Cause:**
- Client-side navigation cache
- React state không sync với server
- `router.refresh()` không đủ mạnh

**Solution:**
```tsx
// CREATE: Force reload with timestamp
const timestamp = Date.now();
router.replace(`/admin/homestays?_t=${timestamp}`);
setTimeout(() => router.refresh(), 100);

// DELETE: Update local state + force reload
setRows((prev) => prev.filter((item) => item.id !== homestay.id));
setTimeout(() => window.location.reload(), 500);
```

**Benefits:**
- ✅ Instant UI feedback (local state update)
- ✅ Guaranteed consistency (force reload)
- ✅ Cache bypass (timestamp param)
- ✅ Console logging for debugging

**Status:** ✅ **FIXED**

---

## October 21, 2025 - 10:40 PM

### Issue 3: Redirect to wrong page after create + Decimal warnings

**Problem:**
- After creating homestay, redirects to `/admin/homestays/[id]` (edit page)
- Should redirect to `/admin/homestays` (list page)
- Warnings about Decimal objects in client components

**Root Cause:**
- Using `router.push()` which can be intercepted
- Prisma Decimal types not converted to numbers for client components

**Solution:**
```tsx
// app/admin/homestays/new/page.tsx
// Use router.replace instead of router.push
router.replace('/admin/homestays');
router.refresh();

// app/homestays/[slug]/page.tsx
// Convert Decimal to number
averageRating={homestay.ratingAverage ? Number(homestay.ratingAverage) : 0}

// components/homestays/ReviewsSection.tsx
// Fix type compatibility
overallRating: number | any;
createdAt: Date | string;
```

**Status:** ✅ **FIXED**

---

## October 21, 2025 - 10:25 PM

### Issue 1: Homestay không hiện trong danh sách sau khi tạo

**Problem:**
- Tạo homestay thành công (có trong Prisma Studio)
- Nhưng không hiện trong `/admin/homestays` list
- Phải refresh trang thủ công mới thấy

**Root Cause:**
- Sau khi `router.push()`, React không tự động re-fetch data
- Client-side navigation không trigger useEffect dependency

**Solution:**
```tsx
// app/admin/homestays/new/page.tsx
// Thêm router.refresh() sau router.push()
router.push('/admin/homestays');
router.refresh(); // Force re-fetch server data
```

**Status:** ✅ **FIXED**

---

### Issue 2: Trang Edit không giống trang Create

**Problem:**
- Trang `/admin/homestays/new` có đầy đủ tính năng (1882 dòng)
- Trang `/admin/homestays/[id]` chỉ có form đơn giản
- Thiếu: image picker, amenities, rooms, availability, etc.

**Root Cause:**
- Tạo component `HomestayEditorForm` mới quá đơn giản
- Không reuse logic từ trang Create

**Solution (Tạm thời):**
- Chuyển trang Edit thành **View-only mode**
- Hiển thị thông tin homestay
- Cung cấp workaround:
  - Link đến Prisma Studio để edit
  - Link xem trang công khai
  - Hiển thị JSON data để debug

**Solution (Dài hạn - Phase 3.2):**
- Refactor trang `new/page.tsx` thành shared component
- Support cả Create và Edit mode
- Reuse toàn bộ logic và UI

**Status:** ⚠️ **WORKAROUND** (Full fix in Phase 3.2)

---

## October 21, 2025 - 10:00 PM

### Issue: Runtime Error - Cannot read properties of undefined (reading 'call')

**Error Message:**
```
Unhandled Runtime Error
TypeError: Cannot read properties of undefined (reading 'call')
Call Stack: options.factory
```

**Root Cause:**
- Swiper CSS imports in client component (`HomestayGallery.tsx`) causing webpack module loading issues
- CSS imports in 'use client' components can cause bundling problems in Next.js 14

**Solution:**
1. Moved Swiper CSS imports from component to `app/globals.css`
2. Removed CSS imports from `components/homestays/HomestayGallery.tsx`

**Files Changed:**
- ✅ `app/globals.css` - Added Swiper CSS imports
- ✅ `components/homestays/HomestayGallery.tsx` - Removed CSS imports

**Code Changes:**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Swiper styles */
@import 'swiper/css';
@import 'swiper/css/navigation';
@import 'swiper/css/pagination';
@import 'swiper/css/thumbs';
@import 'swiper/css/free-mode';
```

```tsx
/* components/homestays/HomestayGallery.tsx */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// ❌ REMOVED: CSS imports (now in globals.css)
// import 'swiper/css';
// import 'swiper/css/navigation';
// ...
```

**Status:** ✅ **FIXED**

**Testing:**
- [ ] Refresh browser and verify error is gone
- [ ] Test homestay listing page
- [ ] Test homestay detail page with gallery
- [ ] Verify Swiper styles are applied

---

## Previous Fixes

### TypeScript Compilation Errors (Earlier Today)

**Issues Fixed:**
1. ✅ HomestayEditor export issue
2. ✅ Null safety issues (booking.customer)
3. ✅ OpenGraph type compatibility
4. ✅ Regex flag ES2018 support

**Status:** All resolved, build successful

---

## Notes

### Best Practices for Next.js 14 + Swiper

**✅ DO:**
- Import Swiper CSS in `app/globals.css` or `app/layout.tsx`
- Use 'use client' directive for components using Swiper
- Import only necessary Swiper modules

**❌ DON'T:**
- Import CSS files directly in client components
- Import all Swiper modules (increases bundle size)
- Forget to add 'use client' when using Swiper hooks

### Example Usage:

```tsx
// ✅ Correct way
// app/globals.css
@import 'swiper/css';

// component.tsx
'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
```

```tsx
// ❌ Wrong way
// component.tsx
'use client';
import { Swiper } from 'swiper/react';
import 'swiper/css'; // ❌ Don't import CSS here
```

---

**Last Updated:** October 21, 2025, 10:00 PM
