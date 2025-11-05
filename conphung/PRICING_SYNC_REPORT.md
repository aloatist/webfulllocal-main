# 🔍 Báo Cáo Kiểm Tra: Bảng Giá Tham Khảo vs Home Settings

## ❌ Vấn Đề Phát Hiện: **KHÔNG ĐỒNG BỘ**

---

## 📊 So Sánh

### 1. **Component `PricingSnapshotModern`** (Frontend)

**Location**: `components/home/pricing-snapshot-modern.tsx`

**Trạng thái**: ❌ **HARDCODED** - Dữ liệu không load từ database

**Dữ liệu hiển thị** (hardcoded):
```typescript
const pricingOptions = [
  {
    id: 'ticket',
    name: 'Vé Tham Quan',
    price: '50,000',
    period: '/người lớn',
    // ... features, note, cta
  },
  {
    id: 'tour',
    name: 'Tour Khám Phá',
    price: '500,000',
    period: '/người',
    // ...
  },
  {
    id: 'homestay',
    name: 'Lưu Trú Homestay',
    price: '500,000',
    period: '/phòng/đêm',
    // ...
  },
]
```

**Vấn đề**:
- ❌ Dữ liệu hardcoded trong component
- ❌ Không có props để nhận data từ database
- ❌ Không load từ API

---

### 2. **Home Settings** (Admin Panel)

**Location**: `/admin/homepage-settings`

**Sections liên quan**:

#### ✅ Tab "Ticket" - Quản lý Vé Tham Quan
- **Editor**: `TicketSectionEditor`
- **Schema**: `ticketSectionSchema`
- **Fields**:
  - `eyebrow`: "Vé Tham Quan"
  - `heading`: "VÉ THAM QUAN KHU DU LỊCH SINH THÁI"
  - `prices.adult`: 50000
  - `prices.child`: 30000
  - `includedItems`: [...]
  - `pickupLocation`, `warningNote`

#### ✅ Tab "Tours" - Quản lý Tour Pricing
- **Editor**: `TourPricingEditor`
- **Schema**: `tourPricingSectionSchema`
- **Fields**:
  - `eyebrow`: "Tour Du Lịch"
  - `heading`: "BẢNG GIÁ VÉ TOUR"
  - `tours[]`: Array of tour items

#### ❌ Không có Tab "Homestay"
- Home Settings KHÔNG có section quản lý giá homestay
- Component hiển thị "Lưu Trú Homestay" nhưng không có data source

---

### 3. **Database Schema**

**HomepageConfig** (từ `lib/homepage/schema.ts`):
```typescript
{
  ticket?: TicketSection,        // ✅ Có trong schema
  tourPricing?: TourPricingSection, // ✅ Có trong schema
  // ❌ KHÔNG có homestay pricing
}
```

**Lưu trữ**:
- `HomepageSettings.sections` (JSON field)
- Hoặc `HomepageSection` (old CMS)

---

## 🔄 Luồng Dữ Liệu Hiện Tại

### Homepage Load Data:
```
app/page.tsx
  ↓
PricingSnapshotModern (HARDCODED) ❌
  ↓
Không load từ database
```

### Admin Save Data:
```
/admin/homepage-settings
  ↓
TicketSectionEditor → Save to database ✅
TourPricingEditor → Save to database ✅
  ↓
HomepageSettings.sections (JSON)
```

**Vấn đề**: Frontend KHÔNG đọc data từ database!

---

## ✅ Giải Pháp Đề Xuất

### Option 1: Load Data từ Database (Recommended)

**1. Tạo API để load pricing data:**
```typescript
// app/api/public/homepage-pricing/route.ts
export async function GET() {
  const config = await getHomepageConfig();
  return NextResponse.json({
    ticket: config.ticket,
    tourPricing: config.tourPricing,
  });
}
```

**2. Update `PricingSnapshotModern` component:**
```typescript
export function PricingSnapshotModern({ 
  ticketData,
  tourData,
  homestayData 
}: {
  ticketData?: TicketSection;
  tourData?: TourPricingSection;
  homestayData?: any; // Nếu có
}) {
  // Convert database data to pricingOptions format
  const pricingOptions = useMemo(() => {
    const options = [];
    
    if (ticketData) {
      options.push({
        id: 'ticket',
        name: ticketData.heading || 'Vé Tham Quan',
        price: ticketData.prices.adult.toLocaleString('vi-VN'),
        period: '/người lớn',
        features: ticketData.includedItems,
        // ...
      });
    }
    
    if (tourData?.tours?.[0]) {
      const firstTour = tourData.tours[0];
      options.push({
        id: 'tour',
        name: firstTour.name,
        price: firstTour.finalPrice.toLocaleString('vi-VN'),
        period: '/người',
        features: firstTour.includedItems,
        // ...
      });
    }
    
    // Fallback to hardcoded if no data
    if (options.length === 0) {
      return defaultPricingOptions;
    }
    
    return options;
  }, [ticketData, tourData]);
  
  // ... render
}
```

**3. Update `app/page.tsx`:**
```typescript
export default async function Home() {
  // Load pricing data
  const pricingResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/public/homepage-pricing`,
    { next: { revalidate: 120 } }
  );
  const pricingData = pricingResponse.ok 
    ? await pricingResponse.json() 
    : { ticket: null, tourPricing: null };
  
  // Load full config
  const config = await getHomepageConfig();
  
  return (
    <ExampleJsx 
      posts={latestPosts} 
      template={activeTemplate}
      pricingData={pricingData}
      config={config}
    />
  );
}
```

---

### Option 2: Tạo Component Mới Load từ Database

Tạo `PricingSnapshotDynamic` component load từ database và thay thế `PricingSnapshotModern`.

---

### Option 3: Merge Pricing Sections

Tạo 1 section duy nhất "Pricing" trong Home Settings quản lý cả 3 loại:
- Ticket pricing
- Tour pricing  
- Homestay pricing

---

## 📋 Checklist Đồng Bộ

- [ ] Tạo API endpoint load pricing data
- [ ] Update `PricingSnapshotModern` nhận props từ database
- [ ] Update `app/page.tsx` load và pass data
- [ ] Test đồng bộ: Edit trong admin → Check frontend
- [ ] Handle fallback: Nếu không có data → dùng default
- [ ] Add Homestay pricing section (optional)

---

## 🎯 Khuyến Nghị

**Ưu tiên Option 1** vì:
- ✅ Minimal changes
- ✅ Backward compatible (fallback to hardcoded)
- ✅ Reuse existing schema
- ✅ Easy to implement

---

## 📝 Files Cần Modify

1. `components/home/pricing-snapshot-modern.tsx` - Add props & data loading
2. `app/page.tsx` - Load data và pass to component
3. `app/api/public/homepage-pricing/route.ts` - New API (optional)
4. Hoặc dùng existing `getHomepageConfig()` function

---

**Status**: ⚠️ **KHÔNG ĐỒNG BỘ - CẦN FIX**

