# 🔧 Giải Pháp Fix: Đồng Bộ Bảng Giá Tham Khảo với Home Settings

## ❌ Vấn Đề Hiện Tại

**`PricingSnapshotModern`** component:
- ❌ Dữ liệu HARDCODED trong component
- ❌ Không load từ database
- ❌ Không đồng bộ với Home Settings

**Home Settings** có:
- ✅ Tab "Ticket" quản lý giá vé
- ✅ Tab "Tours" quản lý giá tour
- ❌ Không có tab "Homestay" pricing

---

## ✅ Giải Pháp: Load Data từ Database

### Bước 1: Update `PricingSnapshotModern` Component

Thêm props để nhận data từ database và convert format:

```typescript
interface PricingSnapshotModernProps {
  ticketData?: TicketSection;
  tourData?: TourPricingSection;
}

export function PricingSnapshotModern({ 
  ticketData, 
  tourData 
}: PricingSnapshotModernProps) {
  // Convert database data to pricingOptions
  const pricingOptions = useMemo(() => {
    const options = [];
    
    // Ticket Card (from ticketData)
    if (ticketData) {
      options.push({
        id: 'ticket',
        name: ticketData.heading || 'Vé Tham Quan',
        price: ticketData.prices.adult.toLocaleString('vi-VN'),
        period: '/người lớn',
        popular: false,
        features: ticketData.includedItems || [],
        note: `Trẻ em: ${ticketData.prices.child.toLocaleString('vi-VN')}₫`,
        cta: {
          text: 'Mua Vé Ngay',
          link: 'tel:+84918267715',
        },
        gradient: 'from-blue-500 via-cyan-500 to-sky-500',
        iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
        borderColor: 'border-blue-500/20',
        shadowColor: 'shadow-blue-500/10',
      });
    }
    
    // Tour Card (from tourData - lấy tour đầu tiên)
    if (tourData?.tours && tourData.tours.length > 0) {
      const firstTour = tourData.tours.find(t => t.isActive) || tourData.tours[0];
      options.push({
        id: 'tour',
        name: firstTour.name || 'Tour Khám Phá',
        price: firstTour.finalPrice.toLocaleString('vi-VN'),
        period: '/người',
        popular: true,
        features: firstTour.includedItems || [],
        note: tourData.description || '',
        cta: {
          text: 'Đặt Tour Ngay',
          link: '/tours',
        },
        gradient: 'from-emerald-500 via-green-500 to-teal-500',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-green-500',
        borderColor: 'border-emerald-500/20',
        shadowColor: 'shadow-emerald-500/20',
      });
    }
    
    // Homestay Card (fallback - vẫn giữ hardcoded vì chưa có section)
    options.push({
      id: 'homestay',
      name: 'Lưu Trú Homestay',
      price: '500,000',
      period: '/phòng/đêm',
      popular: false,
      features: [
        '🏞️ View sông tuyệt đẹp',
        '🛏️ Phòng đầy đủ tiện nghi',
        '🍳 Ăn sáng miễn phí',
        '📶 Wi-Fi tốc độ cao',
        '❄️ Điều hòa, nước nóng',
        '🅿️ Chỗ đỗ xe miễn phí',
      ],
      note: 'Đặt từ 3 đêm giảm 15%',
      cta: {
        text: 'Đặt Phòng Ngay',
        link: 'https://cocoisland.vn',
      },
      gradient: 'from-amber-500 via-orange-500 to-yellow-500',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      borderColor: 'border-amber-500/20',
      shadowColor: 'shadow-amber-500/10',
    });
    
    // Fallback to hardcoded if no data
    if (options.length === 0) {
      return defaultPricingOptions; // Original hardcoded data
    }
    
    return options;
  }, [ticketData, tourData]);
  
  // ... rest of component
}
```

---

### Bước 2: Update `app/page.tsx`

Load config từ database và pass vào component:

```typescript
import { getHomepageConfig } from '@/lib/homepage/sections';

export default async function Home() {
  const latestPosts = await prisma.post.findMany({ /* ... */ });
  const activeTemplate = await getActiveTemplateServer();
  
  // Load homepage config từ database
  const homepageConfig = await getHomepageConfig();
  
  return (
    <TemplateWrapper template={activeTemplate}>
      <Section>
        <Container>
          <ExampleJsx 
            posts={latestPosts} 
            template={activeTemplate}
            homepageConfig={homepageConfig}
          />
        </Container>
      </Section>
    </TemplateWrapper>
  );
}
```

---

### Bước 3: Update `ExampleJsx` Component

Pass pricing data vào `PricingSnapshotModern`:

```typescript
const ExampleJsx = ({ 
  posts, 
  template,
  homepageConfig 
}: { 
  posts: LatestPost[]; 
  template: TemplateType;
  homepageConfig?: HomepageConfig;
}) => {
  return (
    <>
      {/* ... other sections ... */}
      
      {/* 4. Pricing Snapshot - Load from database */}
      <PricingSnapshotModern 
        ticketData={homepageConfig?.ticket}
        tourData={homepageConfig?.tourPricing}
      />
      
      {/* ... */}
    </>
  );
};
```

---

## 📋 Implementation Steps

1. ✅ Tạo báo cáo vấn đề (done)
2. ⬜ Update `PricingSnapshotModern` với props
3. ⬜ Update `app/page.tsx` load config
4. ⬜ Update `ExampleJsx` pass data
5. ⬜ Test: Edit trong admin → Check frontend
6. ⬜ Handle fallback nếu không có data

---

## 🎯 Benefits

- ✅ Đồng bộ hoàn toàn với Home Settings
- ✅ Admin có thể chỉnh sửa qua UI
- ✅ Backward compatible (fallback nếu không có data)
- ✅ Không breaking changes

---

## ⚠️ Notes

- **Homestay pricing**: Vẫn hardcoded vì chưa có section trong Home Settings
- **Fallback**: Nếu không có data từ database → dùng default hardcoded
- **Performance**: Config được cache qua `getHomepageConfig()` (có thể optimize thêm)

---

**Status**: 📝 **PLAN - Ready to implement**

