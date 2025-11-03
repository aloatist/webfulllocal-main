# 🏠 Home Settings Module - Implementation Complete

**Status**: ✅ Ready for Testing

---

## 📋 Overview

Complete "Home Settings" module cho phép Admin quản lý nội dung trang chủ động qua database, không cần edit code.

---

## 🗄️ Database Schema

### Models Added

1. **HomepageSettings** - Main settings với Draft/Published status
2. **HomepageSEO** - SEO metadata
3. **Service** - Services với featured flag và ordering

### Migration

```bash
# Run migration
npx prisma migrate dev --name add_homepage_settings

# Generate Prisma Client
npx prisma generate
```

---

## 🔌 API Endpoints

### Admin APIs (Protected)

1. **GET `/api/admin/homepage-settings`**
   - Load settings (with preview mode support)
   - Returns: settings, seo, featuredServices

2. **PUT `/api/admin/homepage-settings`**
   - Update settings & SEO
   - Body: `{ settings: {...}, seo: {...} }`

3. **POST `/api/admin/homepage-settings/upload`**
   - Upload images to Cloudinary
   - Fields: heroBackgroundImage, aboutImage, ogImage

4. **DELETE `/api/admin/homepage-settings/upload?publicId=...`**
   - Delete image from Cloudinary

5. **GET `/api/admin/services`**
   - List all services

6. **PATCH `/api/admin/services/[serviceId]`**
   - Update service featured status and order

### Public API

1. **GET `/api/public/homepage-settings`**
   - Public endpoint for homepage (ISR enabled)
   - Returns published settings only (unless draft mode)

---

## 🎨 Admin UI

### Location
`/admin/homepage-settings`

### Features
- ✅ Hero Section Editor
- ✅ About Section Editor (with EditorJS rich text)
- ✅ CTA Section Editor
- ✅ Featured Services Selector
- ✅ SEO Settings Editor
- ✅ Draft/Published Toggle
- ✅ Preview Mode
- ✅ Image Upload (Cloudinary)
- ✅ Auto-save indicator
- ✅ Version tracking

---

## 🌐 Dynamic Homepage

### Current Setup

**File**: `app/page-new.tsx` (rename to `app/page.tsx` after testing)

### Features
- ✅ ISR with 120s revalidate
- ✅ Fetches from `/api/public/homepage-settings`
- ✅ Fallback defaults if no data
- ✅ Renders all sections dynamically

### Sections Rendered
1. Hero Section
2. About Section
3. Featured Services
4. CTA Section
5. Latest Posts (existing)

---

## 📝 Migration Guide

### Step 1: Run Migration

```bash
cd conphung
npx prisma migrate dev --name add_homepage_settings
npx prisma generate
```

### Step 2: Seed Initial Data (Optional)

Create `prisma/seed-homepage.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default settings
  await prisma.homepageSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      heroTitle: 'DU LỊCH SINH THÁI CỒN PHỤNG',
      heroSubtitle: 'KHÁM PHÁ THIÊN NHIÊN MIỀN TÂY',
      status: 'PUBLISHED',
    },
  });

  // Create default SEO
  await prisma.homepageSEO.create({
    data: {
      metaTitle: 'Du Lịch Sinh Thái Cồn Phụng',
      metaDescription: 'Khám phá thiên nhiên miền Tây với tour Cồn Phụng',
      robotsMeta: 'index, follow',
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run: `npx ts-node prisma/seed-homepage.ts`

### Step 3: Replace Homepage

```bash
# Backup old homepage
mv app/page.tsx app/page-old.tsx

# Use new dynamic homepage
mv app/page-new.tsx app/page.tsx
```

### Step 4: Update Sidebar Nav

Add to `app/admin/_components/sidebar-nav.tsx`:

```typescript
{ href: "/admin/homepage-settings", label: "🏠 Home Settings" },
```

---

## 🧪 Testing Checklist

- [ ] Database migration runs successfully
- [ ] Admin can access `/admin/homepage-settings`
- [ ] All sections editable and save correctly
- [ ] Images upload to Cloudinary
- [ ] Draft/Published toggle works
- [ ] Preview mode shows draft content
- [ ] Public homepage fetches dynamic content
- [ ] ISR revalidation works (wait 120s)
- [ ] Fallback renders when no data
- [ ] Featured services selection and ordering works
- [ ] SEO metadata updates correctly

---

## 🔐 Authentication

All admin endpoints protected by:
- NextAuth session check
- Role check (ADMIN or EDITOR)

Add middleware if needed:

```typescript
// middleware.ts
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/admin/:path*'],
};
```

---

## 📸 Image Upload

- **Provider**: Cloudinary
- **Max Size**: 5MB (validated client-side)
- **Formats**: JPG, PNG, WebP
- **Storage**: `homepage-settings/{field}/` folder

**Environment Variables Required**:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🎯 Next Steps

1. **Test thoroughly** before replacing homepage
2. **Migrate existing hard-coded content**:
   - Extract text from `app/page.tsx`
   - Add to database via admin UI
   - Verify rendering

3. **Add Services** if needed:
   ```sql
   INSERT INTO "Service" (id, name, slug, description, "isActive")
   VALUES ('svc-1', 'Tour Du Lịch', 'tour-du-lich', 'Dịch vụ tour du lịch', true);
   ```

4. **Configure Draft Mode** for preview:
   ```typescript
   // app/api/draft/route.ts
   import { draftMode } from 'next/headers';
   
   export async function GET(request: Request) {
     const { enable } = await draftMode();
     return new Response('Draft mode enabled');
   }
   ```

---

## 📚 File Structure

```
conphung/
├── prisma/
│   └── schema.prisma (updated)
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── homepage-settings/
│   │   │       ├── route.ts
│   │   │       └── upload/
│   │   │           └── route.ts
│   │   └── public/
│   │       └── homepage-settings/
│   │           └── route.ts
│   ├── admin/
│   │   └── homepage-settings/
│   │       └── page.tsx
│   └── page.tsx (or page-new.tsx)
├── components/
│   └── admin/
│       └── homepage-settings/
│           ├── HeroSectionEditor.tsx
│           ├── AboutSectionEditor.tsx
│           ├── CTASectionEditor.tsx
│           ├── SEOSectionEditor.tsx
│           ├── FeaturedServicesEditor.tsx
│           └── ImageUpload.tsx
└── lib/
    └── homepage/
        └── renderer.tsx
```

---

## ✅ Completed Features

- [x] Database schema (HomepageSettings, HomepageSEO, Service)
- [x] Admin API endpoints (GET/PUT)
- [x] Image upload API (Cloudinary)
- [x] Public API (ISR enabled)
- [x] Admin UI with all editors
- [x] Draft/Published workflow
- [x] Preview mode support
- [x] Dynamic homepage renderer
- [x] ISR with 120s revalidate
- [x] Fallback defaults
- [x] Featured services management
- [x] SEO metadata management
- [x] Rich text editor (EditorJS)

---

**Status**: ✅ **IMPLEMENTATION COMPLETE - READY FOR TESTING**

