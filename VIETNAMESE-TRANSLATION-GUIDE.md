# 🇻🇳 Hướng dẫn Việt hóa Tour Form

## 📋 Danh sách cần thay thế

### Find & Replace trong VSCode

**Cách dùng:**
1. Mở file `/conphung/components/tours/tour-form.tsx`
2. Ctrl+H (Windows) hoặc Cmd+H (Mac)
3. Copy từng cặp dưới đây và replace

---

## 🎯 Section Headers

```
Find: "Basic Information"
Replace: "Thông tin cơ bản"

Find: "Itinerary"
Replace: "Lịch trình"

Find: "Departures & Pricing"
Replace: "Lịch khởi hành & Giá"

Find: "Optional Add-ons"
Replace: "Dịch vụ bổ sung"

Find: "SEO & Promotions"
Replace: "SEO & Khuyến mãi"
```

---

## 📝 Form Labels

```
Find: <Label htmlFor="title">Title</Label>
Replace: <Label htmlFor="title">Tên tour</Label>

Find: <Label htmlFor="slug">Slug (URL)</Label>
Replace: <Label htmlFor="slug">Đường dẫn (URL)</Label>

Find: <Label htmlFor="summary">Summary</Label>
Replace: <Label htmlFor="summary">Tóm tắt</Label>

Find: <Label htmlFor="heroImageUrl">Hero Image URL</Label>
Replace: <Label htmlFor="heroImageUrl">Ảnh đại diện</Label>

Find: <Label htmlFor="durationDays">Days</Label>
Replace: <Label htmlFor="durationDays">Ngày</Label>

Find: <Label htmlFor="durationNights">Nights</Label>
Replace: <Label htmlFor="durationNights">Đêm</Label>

Find: <Label htmlFor="difficulty">Difficulty</Label>
Replace: <Label htmlFor="difficulty">Độ khó</Label>

Find: <Label htmlFor="basePrice">Base Price</Label>
Replace: <Label htmlFor="basePrice">Giá cơ bản</Label>

Find: <Label htmlFor="currency">Currency</Label>
Replace: <Label htmlFor="currency">Đơn vị tiền</Label>

Find: <Label htmlFor="maxGuests">Max Guests</Label>
Replace: <Label htmlFor="maxGuests">Số khách tối đa</Label>

Find: <Label htmlFor="meetingPoint">Meeting Point</Label>
Replace: <Label htmlFor="meetingPoint">Điểm hẹn</Label>

Find: <Label htmlFor="description">Description</Label>
Replace: <Label htmlFor="description">Mô tả</Label>

Find: <Label htmlFor="highlights">Highlights</Label>
Replace: <Label htmlFor="highlights">Điểm nổi bật</Label>

Find: <Label htmlFor="inclusions">Inclusions</Label>
Replace: <Label htmlFor="inclusions">Bao gồm</Label>

Find: <Label htmlFor="exclusions">Exclusions</Label>
Replace: <Label htmlFor="exclusions">Không bao gồm</Label>

Find: <Label htmlFor="whatToBring">What to Bring</Label>
Replace: <Label htmlFor="whatToBring">Cần mang theo</Label>

Find: <Label htmlFor="importantNotes">Important Notes</Label>
Replace: <Label htmlFor="importantNotes">Lưu ý quan trọng</Label>

Find: <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
Replace: <Label htmlFor="cancellationPolicy">Chính sách hủy</Label>

Find: <Label htmlFor="status">Status</Label>
Replace: <Label htmlFor="status">Trạng thái</Label>

Find: <Label htmlFor="isFeatured">Featured</Label>
Replace: <Label htmlFor="isFeatured">Nổi bật</Label>
```

---

## 🔘 Buttons

```
Find: >Add Day<
Replace: >Thêm ngày<

Find: >Add Departure<
Replace: >Thêm lịch khởi hành<

Find: >Add Add-on<
Replace: >Thêm dịch vụ<

Find: >Remove Day<
Replace: >Xóa ngày<

Find: >Remove Departure<
Replace: >Xóa lịch<

Find: >Remove Add-on<
Replace: >Xóa dịch vụ<

Find: >Cancel<
Replace: >Hủy<

Find: >Save<
Replace: >Lưu<

Find: >Create<
Replace: >Tạo<

Find: >Update<
Replace: >Cập nhật<
```

---

## 💬 Messages

```
Find: "Saving..."
Replace: "Đang lưu..."

Find: "Loading..."
Replace: "Đang tải..."

Find: "Failed to save tour"
Replace: "Không thể lưu tour"

Find: "No itinerary days added yet. Click \"Add Day\" to start describing the journey."
Replace: "Chưa có lịch trình. Nhấn 'Thêm ngày' để bắt đầu mô tả hành trình."

Find: "No departures added yet."
Replace: "Chưa có lịch khởi hành."

Find: "No add-ons created yet."
Replace: "Chưa có dịch vụ bổ sung."
```

---

## 📝 Itinerary Fields

```
Find: <Label>Day</Label>
Replace: <Label>Ngày</Label>

Find: <Label>Title</Label>
Replace: <Label>Tiêu đề</Label>

Find: <Label>Description</Label>
Replace: <Label>Mô tả</Label>

Find: <Label>Meals</Label>
Replace: <Label>Bữa ăn</Label>

Find: <Label>Activities</Label>
Replace: <Label>Hoạt động</Label>

Find: <Label>Stay Info</Label>
Replace: <Label>Thông tin lưu trú</Label>
```

---

## 📅 Departure Fields

```
Find: <Label>Start Date</Label>
Replace: <Label>Ngày bắt đầu</Label>

Find: <Label>End Date</Label>
Replace: <Label>Ngày kết thúc</Label>

Find: <Label>Total Seats</Label>
Replace: <Label>Tổng số chỗ</Label>

Find: <Label>Available Seats</Label>
Replace: <Label>Chỗ còn trống</Label>

Find: <Label>Price Adult</Label>
Replace: <Label>Giá người lớn</Label>

Find: <Label>Price Child</Label>
Replace: <Label>Giá trẻ em</Label>

Find: <Label>Price Infant</Label>
Replace: <Label>Giá trẻ sơ sinh</Label>

Find: <Label>Notes</Label>
Replace: <Label>Ghi chú</Label>
```

---

## 🎁 Add-on Fields

```
Find: <Label>Name</Label>
Replace: <Label>Tên</Label>

Find: <Label>Price</Label>
Replace: <Label>Giá</Label>

Find: <Label>Per Person</Label>
Replace: <Label>Theo người</Label>

Find: <Label>Active</Label>
Replace: <Label>Kích hoạt</Label>
```

---

## 🔍 SEO Fields

```
Find: <Label htmlFor="seoTitle">SEO Title</Label>
Replace: <Label htmlFor="seoTitle">Tiêu đề SEO</Label>

Find: <Label htmlFor="seoDescription">SEO Description</Label>
Replace: <Label htmlFor="seoDescription">Mô tả SEO</Label>

Find: <Label>SEO Keywords (one per line)</Label>
Replace: <Label>Từ khóa SEO (mỗi dòng một từ)</Label>
```

---

## 📋 Placeholders

```
Find: placeholder="Discover Mekong Delta in 3 Days"
Replace: placeholder="Khám phá Đồng bằng sông Cửu Long 3 ngày"

Find: placeholder="auto-generated-from-title"
Replace: placeholder="tự động tạo từ tên tour"

Find: placeholder="Brief overview of the tour..."
Replace: placeholder="Tóm tắt ngắn về tour..."

Find: placeholder="https://example.com/image.jpg"
Replace: placeholder="https://example.com/image.jpg"

Find: placeholder="Hanoi Old Quarter"
Replace: placeholder="Phố cổ Hà Nội"

Find: placeholder="Full tour description..."
Replace: placeholder="Mô tả đầy đủ về tour..."

Find: placeholder="One per line"
Replace: placeholder="Mỗi dòng một mục"
```

---

## 🎨 Status & Difficulty

**Lưu ý:** Những giá trị này là enum, KHÔNG nên dịch trong code.  
Thay vào đó, dịch trong phần hiển thị:

```typescript
// Thêm mapping
const difficultyLabels = {
  EASY: 'Dễ',
  MODERATE: 'Trung bình',
  CHALLENGING: 'Khó',
  EXTREME: 'Rất khó',
}

const statusLabels = {
  DRAFT: 'Nháp',
  PUBLISHED: 'Đã xuất bản',
  ARCHIVED: 'Lưu trữ',
}

const departureStatusLabels = {
  SCHEDULED: 'Đã lên lịch',
  CONFIRMED: 'Đã xác nhận',
  CANCELLED: 'Đã hủy',
  COMPLETED: 'Hoàn thành',
  SOLD_OUT: 'Hết chỗ',
}
```

---

## ⚠️ KHÔNG dịch

### 1. Code variables
```typescript
// KHÔNG dịch
const formData = ...
const handleSubmit = ...
```

### 2. API endpoints
```typescript
// KHÔNG dịch
fetch('/api/tours')
```

### 3. Database fields
```typescript
// KHÔNG dịch
title: formData.title
```

### 4. CSS classes
```typescript
// KHÔNG dịch
className="text-sm"
```

### 5. Import statements
```typescript
// KHÔNG dịch
import { Button } from '@/components/ui/button'
```

---

## 🧪 Test sau khi dịch

1. **Compile check:**
   ```bash
   npm run build
   ```

2. **Visual check:**
   - Vào http://localhost:3000/admin/tours
   - Click "Create Tour"
   - Verify tất cả text đã tiếng Việt

3. **Functional check:**
   - Tạo tour mới
   - Edit tour
   - Verify form vẫn hoạt động

---

## 📝 Checklist

- [ ] Section headers dịch
- [ ] Form labels dịch
- [ ] Buttons dịch
- [ ] Messages dịch
- [ ] Placeholders dịch
- [ ] Compile OK
- [ ] Visual check OK
- [ ] Functional test OK

---

## 🎯 Ước tính thời gian

- **Find & Replace:** 20-30 phút
- **Test:** 10 phút
- **Fix issues:** 10 phút
- **Total:** ~40-50 phút

---

**Good luck!** 🇻🇳
