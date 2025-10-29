# ✅ Tour Form - Trạng thái Việt hóa

## 📊 Tổng quan

**File:** `/conphung/components/tours/tour-form.tsx`  
**Tổng số dòng:** 2,629  
**Trạng thái:** 🟡 Một phần đã dịch

---

## ✅ Đã dịch (Tiếng Việt)

### 1. Tiêu đề chính
- ✅ "Thêm tour" / "Chỉnh sửa tour"

### 2. Section "Hình ảnh & Media" (Line ~2117)
- ✅ "Hình ảnh & Media"
- ✅ "Chọn hình ảnh từ thư viện..."
- ✅ "Chọn từ thư viện"
- ✅ "Chưa có hình ảnh nào..."
- ✅ "Vị trí #"
- ✅ "Ảnh hero"
- ✅ "Chưa có alt text"
- ✅ "Lên" / "Xuống"
- ✅ "Đặt làm hero"

### 3. Section "SEO & Promotions" (Line ~2213)
- ✅ "SEO & Promotions"
- ✅ "Danh mục tour"
- ✅ "Đang tải danh mục tour..."
- ✅ "Chọn danh mục liên quan"
- ✅ "Chưa có danh mục nào..."
- ✅ "Đang tải dữ liệu..."

### 4. Section "Chương trình khuyến mãi"
- ✅ "Chương trình khuyến mãi"
- ✅ "Chọn khuyến mãi từ thư viện"
- ✅ "Chưa có khuyến mãi nào..."
- ✅ "Tạo khuyến mãi mới"

---

## ❌ Chưa dịch (Tiếng Anh)

### 1. Section "Basic Information" (Line ~1141)
- ❌ "Basic Information"
- ❌ "Title"
- ❌ "Slug (URL)"
- ❌ "Summary"
- ❌ "Hero Image URL"
- ❌ "Duration"
- ❌ "Days" / "Nights"
- ❌ "Difficulty"
- ❌ "Base Price"
- ❌ "Currency"
- ❌ "Max Guests"
- ❌ "Meeting Point"
- ❌ "Description"
- ❌ "Highlights"
- ❌ "Inclusions"
- ❌ "Exclusions"
- ❌ "What to Bring"
- ❌ "Important Notes"
- ❌ "Cancellation Policy"
- ❌ "Status"
- ❌ "Featured"

### 2. Section "Itinerary" (Line ~1529)
- ❌ "Itinerary"
- ❌ "Add Day"
- ❌ "No itinerary days added yet..."
- ❌ "Day"
- ❌ "Title"
- ❌ "Description"
- ❌ "Meals"
- ❌ "Activities"
- ❌ "Stay Info"
- ❌ "Remove Day"

### 3. Section "Departures & Pricing" (Line ~1696)
- ❌ "Departures & Pricing"
- ❌ "Add Departure"
- ❌ "Start Date"
- ❌ "End Date"
- ❌ "Total Seats"
- ❌ "Available Seats"
- ❌ "Price Adult"
- ❌ "Price Child"
- ❌ "Price Infant"
- ❌ "Status"
- ❌ "Notes"
- ❌ "Remove Departure"

### 4. Section "Optional Add-ons" (Line ~1967)
- ❌ "Optional Add-ons"
- ❌ "Add Add-on"
- ❌ "Name"
- ❌ "Description"
- ❌ "Price"
- ❌ "Per Person"
- ❌ "Active"
- ❌ "Remove Add-on"

### 5. Buttons & Messages
- ❌ "Cancel"
- ❌ "Save"
- ❌ "Saving..."
- ❌ "Failed to save tour"
- ❌ Placeholders (nhiều)

---

## 🎯 Ưu tiên việt hóa

### Priority 1 (Cao nhất) - User-facing text
1. Section headers
2. Form labels
3. Button text
4. Error messages
5. Placeholders

### Priority 2 (Trung bình) - Helper text
1. Descriptions
2. Tooltips
3. Helper messages

### Priority 3 (Thấp) - Internal
1. Console logs
2. Comments
3. Variable names (KHÔNG dịch)

---

## 🛠️ Cách việt hóa

### Option 1: Dịch trực tiếp trong file (Đơn giản)
```typescript
// Trước
<Label>Title</Label>

// Sau
<Label>Tên tour</Label>
```

**Pros:**
- ✅ Đơn giản
- ✅ Không cần setup thêm

**Cons:**
- ❌ Khó maintain
- ❌ Không support đa ngôn ngữ

---

### Option 2: Tạo constants file (Khuyến nghị)
```typescript
// translations/tour-form.ts
export const TOUR_FORM_VI = {
  BASIC_INFO: 'Thông tin cơ bản',
  TITLE: 'Tên tour',
  SLUG: 'Đường dẫn (URL)',
  // ...
}

// Sử dụng
<Label>{TOUR_FORM_VI.TITLE}</Label>
```

**Pros:**
- ✅ Dễ maintain
- ✅ Có thể support đa ngôn ngữ sau
- ✅ Tập trung tất cả text ở một chỗ

**Cons:**
- ❌ Cần refactor code
- ❌ Import thêm file

---

### Option 3: i18n library (Professional)
```bash
npm install next-intl
```

**Pros:**
- ✅ Professional
- ✅ Support đa ngôn ngữ
- ✅ Auto-detect locale

**Cons:**
- ❌ Setup phức tạp
- ❌ Overkill cho project nhỏ

---

## 📝 Recommendation

**Cho project này:** Dùng **Option 1** (dịch trực tiếp)

**Lý do:**
1. Nhanh nhất
2. Đơn giản nhất
3. Chỉ cần tiếng Việt
4. File đã lớn, không muốn thêm complexity

**Sau này nếu cần đa ngôn ngữ:** Migrate sang Option 2 hoặc 3

---

## 🚀 Action Plan

### Bước 1: Dịch Section Headers (5 phút)
- Basic Information → Thông tin cơ bản
- Itinerary → Lịch trình
- Departures & Pricing → Lịch khởi hành & Giá
- Optional Add-ons → Dịch vụ bổ sung

### Bước 2: Dịch Form Labels (10 phút)
- Title → Tên tour
- Slug → Đường dẫn
- Summary → Tóm tắt
- ... (tất cả labels)

### Bước 3: Dịch Buttons (5 phút)
- Add Day → Thêm ngày
- Add Departure → Thêm lịch
- Add Add-on → Thêm dịch vụ
- Cancel → Hủy
- Save → Lưu

### Bước 4: Dịch Messages (5 phút)
- Saving... → Đang lưu...
- Failed to... → Không thể...
- No ... yet → Chưa có...

### Bước 5: Dịch Placeholders (10 phút)
- Enter tour title... → Nhập tên tour...
- Brief overview... → Tóm tắt ngắn...
- ... (tất cả placeholders)

**Tổng thời gian ước tính:** ~35-40 phút

---

## ✅ Status

**Đã dịch:** ~30%  
**Chưa dịch:** ~70%  
**Ưu tiên:** 🔴 HIGH

**Bắt đầu từ:** Section "Basic Information" (Line 1141)

---

**Sẵn sàng việt hóa!** 🇻🇳
