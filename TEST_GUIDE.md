# 🧪 Hướng Dẫn Test Phase 1

## 🚀 Quick Start

### **1. Khởi động Development Server**

```bash
cd /Users/congtrinh/fullconphung-main/conphung
npm run dev
```

Truy cập: `http://localhost:3000`

---

## ✅ Test Checklist

### **Test 1: Trang Danh Sách Homestay** (5 phút)

**URL**: `http://localhost:3000/homestays`

#### Kiểm tra:
- [ ] Trang load thành công
- [ ] Hiển thị danh sách homestay (nếu có data)
- [ ] Search bar hoạt động
- [ ] Bộ lọc mở/đóng được
- [ ] Filters hoạt động (type, category, price, etc.)
- [ ] Sort options hoạt động
- [ ] Cards hiển thị đúng (image, title, price, rating)
- [ ] Responsive trên mobile (resize browser)
- [ ] Click vào card chuyển đến trang chi tiết

#### Test Cases:
```bash
# Test với filters
http://localhost:3000/homestays?type=ENTIRE_PLACE
http://localhost:3000/homestays?minPrice=100000&maxPrice=500000
http://localhost:3000/homestays?hasWifi=true&hasPool=true
http://localhost:3000/homestays?sortBy=basePrice&sortOrder=asc
```

---

### **Test 2: Trang Chi Tiết Homestay** (10 phút)

**URL**: `http://localhost:3000/homestays/[slug]`

#### Kiểm tra:
- [ ] Trang load thành công
- [ ] Hero gallery hiển thị
- [ ] Click vào gallery mở fullscreen modal
- [ ] Swiper navigation hoạt động (prev/next)
- [ ] Thumbnail navigation hoạt động
- [ ] Keyboard navigation (arrow keys, ESC)
- [ ] Property details hiển thị đúng
- [ ] Amenities icons hiển thị
- [ ] House rules hiển thị
- [ ] Policies hiển thị
- [ ] Reviews section hiển thị (nếu có)
- [ ] Booking form sticky bên phải
- [ ] Responsive trên mobile

#### Test Booking Form:
- [ ] Chọn check-in date
- [ ] Chọn check-out date
- [ ] Số đêm tính đúng
- [ ] Tăng/giảm số khách
- [ ] Price calculation đúng
- [ ] Validation hoạt động (min nights, max guests)
- [ ] Submit form (test với data thật)

---

### **Test 3: Booking Flow** (10 phút)

#### Bước 1: Tạo Test Data (nếu chưa có)

```bash
# Mở Prisma Studio
npx prisma studio

# Tạo 1 homestay test với:
- title: "Test Homestay"
- slug: "test-homestay"
- status: PUBLISHED
- basePrice: 500000
- minNights: 1
- maxGuests: 4
```

#### Bước 2: Test Booking

1. Truy cập: `http://localhost:3000/homestays/test-homestay`
2. Điền booking form:
   - Check-in: Ngày mai
   - Check-out: 2 ngày sau
   - Adults: 2
3. Click "Đặt ngay"
4. Kiểm tra:
   - [ ] Loading state hiển thị
   - [ ] Redirect đến confirmation page
   - [ ] Booking details hiển thị đúng
   - [ ] Reference number được tạo

#### Bước 3: Kiểm tra Database

```bash
# Mở Prisma Studio
npx prisma studio

# Kiểm tra bảng HomestayBooking
- Có record mới
- Reference number đúng
- Status = PENDING
- Customer được tạo
```

---

### **Test 4: API Endpoints** (5 phút)

#### Test Booking API

```bash
# Test với curl
curl -X POST http://localhost:3000/api/public/homestays/test-homestay/book \
  -H "Content-Type: application/json" \
  -d '{
    "checkIn": "2024-10-23",
    "checkOut": "2024-10-25",
    "adults": 2,
    "children": 0,
    "infants": 0,
    "totalAmount": 1000000,
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "customerPhone": "0123456789"
  }'
```

#### Expected Response:
```json
{
  "success": true,
  "reference": "HS12345678",
  "bookingId": "...",
  "message": "Đặt phòng thành công"
}
```

---

### **Test 5: SEO & Metadata** (5 phút)

#### Test Sitemap

```bash
# Truy cập sitemap
http://localhost:3000/sitemap.xml

# Kiểm tra:
- Có /homestays
- Có /homestays/[slug] cho mỗi homestay
- Có /tours
- Có /tours/[slug]
```

#### Test Structured Data

1. Truy cập: `http://localhost:3000/homestays/test-homestay`
2. View page source (Ctrl+U)
3. Tìm `<script type="application/ld+json">`
4. Kiểm tra JSON-LD có đúng format

#### Test với Google Rich Results

```bash
# Copy URL
http://localhost:3000/homestays/test-homestay

# Paste vào:
https://search.google.com/test/rich-results

# (Cần deploy lên public URL để test)
```

---

### **Test 6: Responsive Design** (5 phút)

#### Desktop (1920x1080)
- [ ] Layout đẹp, không bị vỡ
- [ ] Images load đúng size
- [ ] Booking form sticky

#### Tablet (768x1024)
- [ ] Layout adapt tốt
- [ ] Filters collapse
- [ ] Cards 2 columns

#### Mobile (375x667)
- [ ] Layout mobile-friendly
- [ ] Touch targets đủ lớn
- [ ] Forms dễ điền
- [ ] Gallery swipe mượt

---

### **Test 7: Performance** (5 phút)

#### Lighthouse Test

1. Mở Chrome DevTools (F12)
2. Tab "Lighthouse"
3. Chọn "Mobile" hoặc "Desktop"
4. Click "Analyze page load"

#### Target Scores:
- **Performance**: > 80
- **Accessibility**: > 90
- **Best Practices**: > 90
- **SEO**: > 90

---

## 🐛 Common Issues & Solutions

### **Issue 1: Components không tìm thấy**

```bash
# Restart TypeScript server trong VSCode
Cmd+Shift+P -> "TypeScript: Restart TS Server"

# Hoặc restart dev server
Ctrl+C
npm run dev
```

### **Issue 2: Prisma Client lỗi**

```bash
# Regenerate Prisma Client
npx prisma generate

# Restart dev server
npm run dev
```

### **Issue 3: Database connection error**

```bash
# Kiểm tra PostgreSQL
docker ps

# Nếu không chạy
docker compose up -d postgres

# Test connection
npx prisma studio
```

### **Issue 4: Images không load**

```bash
# Kiểm tra next.config.js
# Đảm bảo có domains cho Cloudinary

module.exports = {
  images: {
    domains: ['res.cloudinary.com'],
  },
}
```

### **Issue 5: Swiper không hoạt động**

```bash
# Kiểm tra Swiper đã install
npm list swiper

# Nếu chưa có
npm install swiper

# Import CSS trong component
import 'swiper/css';
```

---

## 📊 Test Results Template

### **Test Session**: [Date]

#### Trang Danh Sách Homestay
- Status: ✅ Pass / ❌ Fail
- Issues: [Ghi chú]

#### Trang Chi Tiết Homestay
- Status: ✅ Pass / ❌ Fail
- Issues: [Ghi chú]

#### Booking Flow
- Status: ✅ Pass / ❌ Fail
- Issues: [Ghi chú]

#### API Endpoints
- Status: ✅ Pass / ❌ Fail
- Issues: [Ghi chú]

#### SEO & Metadata
- Status: ✅ Pass / ❌ Fail
- Issues: [Ghi chú]

#### Responsive Design
- Status: ✅ Pass / ❌ Fail
- Issues: [Ghi chú]

#### Performance
- Lighthouse Score: [Score]
- Issues: [Ghi chú]

---

## 🔧 Debug Tools

### **Browser DevTools**
```javascript
// Console commands for debugging

// Check if components loaded
console.log('HomestayCard:', typeof HomestayCard);

// Check API response
fetch('/api/public/homestays/test-homestay/book', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({...})
}).then(r => r.json()).then(console.log);

// Check localStorage
console.log(localStorage);
```

### **Network Tab**
- Monitor API calls
- Check response times
- Verify status codes
- Inspect payloads

### **React DevTools**
- Inspect component props
- Check state values
- Monitor re-renders

---

## 📈 Performance Benchmarks

### **Target Metrics**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### **Bundle Size**
- **Total JS**: < 300KB (gzipped)
- **Total CSS**: < 50KB (gzipped)
- **Images**: Optimized with Next/Image

---

## 🎯 Acceptance Criteria

### **Must Have** (Blocking)
- ✅ All pages load without errors
- ✅ Booking flow works end-to-end
- ✅ Data saves to database correctly
- ✅ Responsive on mobile
- ✅ No TypeScript errors

### **Should Have** (Important)
- ✅ Lighthouse score > 80
- ✅ SEO metadata present
- ✅ Loading states work
- ✅ Error handling works
- ✅ Forms validate correctly

### **Nice to Have** (Optional)
- ⭐ Animations smooth
- ⭐ Images lazy load
- ⭐ Keyboard navigation
- ⭐ Accessibility features

---

## 🚀 Ready for Production?

### **Pre-deployment Checklist**
- [ ] All tests pass
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables set
- [ ] Database migrated
- [ ] n8n webhooks configured
- [ ] Email templates tested
- [ ] Performance acceptable
- [ ] SEO tags verified

---

## 📞 Need Help?

### **Common Commands**
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Check TypeScript
npx tsc --noEmit
```

### **Useful Links**
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Swiper Docs: https://swiperjs.com/react

---

**Happy Testing! 🧪**
