# 🧪 HƯỚNG DẪN TEST NHANH - 5 PHÚT

## ✅ Bước 1: Tạo Test Homestay (2 phút)

### Mở browser:
```
http://localhost:3000/admin/homestays/new
```

### Điền form (chỉ cần các field bắt buộc):

**Thông tin cơ bản:**
- ✅ Title: `Test Homestay Cồn Phụng`
- ✅ Slug: `test-homestay` (tự động)
- ✅ Summary: `Test homestay`
- ✅ Description: `Mô tả test`
- ✅ Status: PUBLISHED
- ✅ Type: ENTIRE_PLACE
- ✅ Category: VILLA

**Địa chỉ:**
- ✅ Address Line 1: `123 Test Street`
- ✅ City: `Bến Tre`
- ✅ Country: `Việt Nam`

**Thông số:**
- ✅ Max Guests: `4`
- ✅ Bedrooms: `2`
- ✅ Bathrooms: `1`
- ✅ Base Price: `1500000`
- ✅ Currency: `VND`

**Lịch & chặn phòng (QUAN TRỌNG!):**
1. Scroll xuống section "Lịch & chặn phòng"
2. Click button "Thêm khoảng thời gian"
3. Điền:
   - Start Date: `2025-11-01`
   - End Date: `2025-11-05`
   - Notes: `Test block`
4. Click "Thêm"
5. Xem block xuất hiện trong danh sách

**Lưu:**
- Click "Xuất bản" (hoặc "Lưu nháp")
- Đợi redirect về list page

---

## ✅ Bước 2: Kiểm Tra Database (1 phút)

### Mở terminal mới và chạy:
```bash
cd /Users/congtrinh/webfulllocal-main
./check-test-data.sh
```

### Kết quả mong đợi:
```
1️⃣ Checking if homestay 'test-homestay' exists...
✅ 1 row: title="Test Homestay Cồn Phụng", slug="test-homestay"

2️⃣ Checking rooms...
✅ 1-2 rows: "Phòng chính" (default room)

3️⃣ Checking availability blocks...
✅ 5 rows:
   - 2025-11-01, BLOCKED, "Test block"
   - 2025-11-02, BLOCKED, "Test block"
   - 2025-11-03, BLOCKED, "Test block"
   - 2025-11-04, BLOCKED, "Test block"
   - 2025-11-05, BLOCKED, "Test block"

4️⃣ Summary...
✅ room_count: 1, blocked_days: 5
```

### ❌ Nếu thấy lỗi:
- `0 rows` → Homestay không được tạo
- `blocked_days: 0` → Availability không được lưu
- Foreign key error → Có vấn đề với room

---

## ✅ Bước 3: Test Trang Chi Tiết (1 phút)

### Mở browser:
```
http://localhost:3000/homestays/test-homestay
```

### Kiểm tra:

**Header:**
- ✅ Title hiển thị: "Test Homestay Cồn Phụng"
- ✅ Location: "Bến Tre, Việt Nam"

**Quick Info Cards:**
- ✅ Thấy 3 cards: Guests, Bedrooms, Bathrooms
- ✅ Có gradient background đẹp

**Calendar Section:**
- ✅ Heading: "Lịch Trống"
- ✅ Counter: "5 ngày đã chặn"
- ✅ Calendar hiển thị

**Navigate to November 2025:**
- ✅ Nov 1: RED background + diagonal line
- ✅ Nov 2: RED background + diagonal line
- ✅ Nov 3: RED background + diagonal line
- ✅ Nov 4: RED background + diagonal line
- ✅ Nov 5: RED background + diagonal line
- ✅ Other dates: GREEN background

**Hover test:**
- ✅ Hover Nov 1: Tooltip "Đã chặn - Không thể đặt"
- ✅ Hover Nov 10: Tooltip "Còn trống - Có thể đặt"

**Legend:**
- ✅ 3 items: Còn trống (green), Đã chặn (red), Đã qua (gray)

---

## ✅ Bước 4: Test Cập Nhật (1 phút)

### Quay lại admin:
```
http://localhost:3000/admin/homestays
```

### Tìm và click vào "Test Homestay Cồn Phụng"

### Kiểm tra load:
- ✅ Title: "Test Homestay Cồn Phụng"
- ✅ Base Price: 1500000
- ✅ Availability blocks: Thấy 1 block (Nov 1-5)

### Thêm block mới:
1. Click "Thêm khoảng thời gian"
2. Start Date: `2025-12-24`
3. End Date: `2025-12-26`
4. Notes: `Nghỉ lễ`
5. Click "Thêm"

### Sửa giá:
- Change Base Price: `1800000`

### Lưu:
- Click "Cập nhật"
- Đợi success message

### Kiểm tra lại database:
```bash
./check-test-data.sh
```

**Kết quả mong đợi:**
- ✅ blocked_days: 8 (5 + 3)
- ✅ basePrice: 1800000

---

## ✅ Bước 5: Verify Calendar Updated

### Quay lại detail page:
```
http://localhost:3000/homestays/test-homestay
```

### Kiểm tra:
- ✅ Counter: "8 ngày đã chặn"
- ✅ Navigate to December 2025
- ✅ Dec 24, 25, 26: RED blocked

---

## 🎯 KẾT QUẢ CUỐI CÙNG

### ✅ PASS nếu:
1. Homestay được tạo thành công
2. Database có 5 blocked dates (Nov 1-5)
3. Calendar hiển thị đúng dates màu đỏ
4. Có thể update và thêm blocks mới
5. Database update thành 8 blocked dates
6. Calendar update hiển thị đúng

### ❌ FAIL nếu:
1. Homestay không được tạo
2. Availability blocks = 0 trong DB
3. Calendar không hiển thị blocked dates
4. Update không lưu vào DB
5. Có lỗi trong console
6. Foreign key constraint error

---

## 🐛 Nếu Gặp Lỗi

### Lỗi: "Foreign key constraint violated"
**Nguyên nhân:** Không có room
**Giải pháp:** Code đã fix - sẽ tự tạo default room

### Lỗi: Availability không lưu
**Check:**
1. Browser console có log: `availabilityBlocks: [...]`?
2. Network tab có payload `availabilityBlocks`?
3. Server logs có "Processing availability blocks"?

### Lỗi: Calendar trống
**Check:**
1. Console log: `AvailabilityCalendar - bookedDates: X`
2. Nếu X = 0 → Data không load
3. Nếu X > 0 → Check CSS/styling

### Lỗi: Không thể save
**Check:**
1. Console có validation errors?
2. Required fields đã điền?
3. Network tab có error 400/500?

---

## 📊 Debug Commands

### Check console logs:
```javascript
// Open DevTools (F12)
// Console tab should show:
"AvailabilityCalendar - bookedDates: 5 [...]"
```

### Check network payload:
```javascript
// Network tab → PUT /api/homestays/[id]
// Request Payload should include:
{
  "availabilityBlocks": [
    {
      "startDate": "2025-11-01",
      "endDate": "2025-11-05",
      "notes": "Test block"
    }
  ]
}
```

### Check server logs:
```bash
# Terminal where dev server is running
# Should see:
"Processing availability blocks"
"Created 5 availability records"
```

---

## ✅ Cleanup (Sau khi test xong)

### Xóa test data:
```sql
-- Run in Prisma Studio or psql
DELETE FROM "HomestayAvailability" 
WHERE "homestayId" = (SELECT id FROM "Homestay" WHERE slug = 'test-homestay');

DELETE FROM "HomestayRoom" 
WHERE "homestayId" = (SELECT id FROM "Homestay" WHERE slug = 'test-homestay');

DELETE FROM "Homestay" 
WHERE slug = 'test-homestay';
```

---

## 🎉 Test Complete!

**Thời gian:** ~5 phút
**Kết quả:** ☐ PASS ☐ FAIL
**Ghi chú:** _________________________________

Nếu tất cả ✅ → Implementation hoàn hảo! 🚀
Nếu có ❌ → Report lỗi cụ thể để fix!
