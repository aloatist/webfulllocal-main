# 🧪 BROWSER TEST PLAN - Admin Panel

**Ngày test:** 28/10/2025  
**Browser Preview:** http://127.0.0.1:51635  
**Target:** http://localhost:3000

---

## 📋 TEST CHECKLIST

### 1. ✅ Login & Authentication
- [ ] Truy cập `/login`
- [ ] Đăng nhập với: `aloatist@gmail.com` / `ChangeMe123!`
- [ ] Kiểm tra redirect về `/admin`

### 2. ✅ Analytics Dashboard (MỚI)
**URL:** `/admin`

**Test cases:**
- [ ] **Stat Cards hiển thị:**
  - [ ] Tổng doanh thu (với icon DollarSign màu xanh)
  - [ ] Đặt phòng (với icon Calendar màu xanh dương)
  - [ ] Khách hàng (với icon Users màu tím)
  - [ ] Đánh giá TB (với icon Star màu vàng)
  - [ ] Percentage change indicators

- [ ] **Revenue Chart:**
  - [ ] Area chart hiển thị
  - [ ] 2 lines: Tours (xanh dương) & Homestays (xanh lá)
  - [ ] X-axis: Dates (7 ngày)
  - [ ] Y-axis: Currency format
  - [ ] Tooltip hoạt động khi hover
  - [ ] Legend hiển thị

- [ ] **Booking Stats Chart:**
  - [ ] Bar chart hiển thị
  - [ ] 3 bars: Confirmed (xanh), Pending (vàng), Cancelled (đỏ)
  - [ ] Tooltip hoạt động
  - [ ] Legend hiển thị

- [ ] **Responsive:**
  - [ ] Desktop: 2 columns layout
  - [ ] Mobile: Stack vertically

**Expected Result:**
```
✅ Dashboard đẹp với charts chuyên nghiệp
✅ Data loading từ API
✅ No console errors
```

---

### 3. ✅ Posts Management (Bulk Actions - MỚI)
**URL:** `/admin/posts`

**Test cases:**
- [ ] **List View:**
  - [ ] Table hiển thị posts
  - [ ] Checkbox ở header (select all)
  - [ ] Checkbox ở mỗi row

- [ ] **Bulk Actions Toolbar (MỚI):**
  - [ ] Chọn 1 post → Toolbar xuất hiện
  - [ ] Counter hiển thị: "Đã chọn: 1"
  - [ ] Chọn tất cả → Counter update
  - [ ] Button "Chọn tất cả (X)" hoạt động
  - [ ] Button "Bỏ chọn tất cả" hoạt động

- [ ] **Bulk Delete:**
  - [ ] Chọn 2-3 posts
  - [ ] Click "Xóa (X)"
  - [ ] Confirmation dialog xuất hiện
  - [ ] Confirm → Posts bị xóa
  - [ ] Toolbar biến mất
  - [ ] Table refresh

- [ ] **Bulk Publish:**
  - [ ] Chọn DRAFT posts
  - [ ] Click "Xuất bản"
  - [ ] Status change sang PUBLISHED
  - [ ] Badge color change

- [ ] **Bulk Unpublish:**
  - [ ] Chọn PUBLISHED posts
  - [ ] Click "Ẩn"
  - [ ] Status change sang DRAFT

**Expected Result:**
```
✅ Bulk actions hoạt động mượt mà
✅ Toolbar sticky khi scroll
✅ Selection state đúng
✅ No console errors
```

---

### 4. ✅ Homestay Images (ĐÃ FIX)
**URL:** `/admin/homestays/[id]` (chọn 1 homestay bất kỳ)

**Test cases:**
- [ ] **Hero Image:**
  - [ ] Input URL hiển thị
  - [ ] Button "Chọn từ thư viện" hoạt động
  - [ ] Nhập URL hợp lệ → Ảnh hiển thị
  - [ ] Nhập URL không hợp lệ → Error message
  - [ ] Preview ảnh đúng (h-40)

- [ ] **Gallery Images (ĐÃ FIX):**
  - [ ] Empty state: "Chưa có ảnh nào..."
  - [ ] Input URL + Button "Thêm URL"
  - [ ] Button "Chọn từ thư viện"
  - [ ] Thêm URL → Ảnh xuất hiện trong grid
  - [ ] Ảnh hiển thị với thumbnail (h-20 w-28)
  - [ ] Hover vào ảnh → Delete button (×) xuất hiện
  - [ ] Delete button màu đỏ khi hover
  - [ ] Click delete → Ảnh bị xóa
  - [ ] Xóa hết ảnh → Empty state lại xuất hiện

- [ ] **Media Picker Dialog:**
  - [ ] Click "Chọn từ thư viện"
  - [ ] Dialog mở ra
  - [ ] Hiển thị media library
  - [ ] Chọn 1 ảnh → Thêm vào hero
  - [ ] Chọn nhiều ảnh → Thêm vào gallery
  - [ ] Close dialog

- [ ] **Error Handling:**
  - [ ] URL không hợp lệ → Console log error
  - [ ] Ảnh load fail → Placeholder hoặc error message
  - [ ] Background màu muted khi loading

**Expected Result:**
```
✅ Ảnh hiển thị đúng
✅ Empty state rõ ràng
✅ Error handling tốt
✅ UI/UX mượt mà
✅ No crashes
```

---

### 5. ✅ Review Management (MỚI)
**URL:** `/admin/reviews`

**Test cases:**
- [ ] **Stats Cards:**
  - [ ] Tổng số reviews
  - [ ] Chờ duyệt (màu cam)
  - [ ] Đã duyệt (màu xanh)
  - [ ] Từ chối (màu đỏ)
  - [ ] Đánh giá TB (với ⭐)

- [ ] **Filter:**
  - [ ] Dropdown "Lọc theo trạng thái"
  - [ ] Options: Tất cả, Chờ duyệt, Đã duyệt, Từ chối
  - [ ] Filter hoạt động

- [ ] **Review Table:**
  - [ ] Hiển thị customer info
  - [ ] Hiển thị product (tour/homestay)
  - [ ] Star rating (5 stars)
  - [ ] Comment content
  - [ ] Status badge
  - [ ] Date

- [ ] **Actions:**
  - [ ] Pending review: Approve & Reject buttons
  - [ ] Click Approve → Status change
  - [ ] Click Reject → Status change
  - [ ] Response button (MessageSquare icon)
  - [ ] Delete button (Trash icon)

- [ ] **Response Dialog:**
  - [ ] Click response button
  - [ ] Dialog mở ra
  - [ ] Hiển thị review content
  - [ ] Textarea để nhập response
  - [ ] Button "Gửi phản hồi"
  - [ ] Submit → Dialog close

**Expected Result:**
```
✅ Review management hoạt động
✅ Stats update real-time
✅ Actions work correctly
✅ Dialog smooth
```

---

### 6. ✅ Advanced Filters (MỚI - Component đã tạo)
**Note:** Chưa apply vào pages, chỉ test component

**Test cases:**
- [ ] Component render
- [ ] Search input hoạt động
- [ ] Filter button với badge count
- [ ] Popover mở/đóng
- [ ] Status filter
- [ ] Category filter
- [ ] Sort options
- [ ] Active filters display
- [ ] Clear filters button

---

## 🎯 PRIORITY TEST ORDER

### High Priority (Test ngay):
1. ✅ Analytics Dashboard
2. ✅ Bulk Actions (Posts)
3. ✅ Homestay Images Fix
4. ✅ Review Management

### Medium Priority:
5. Advanced Filters
6. Navigation & Sidebar
7. Settings page

### Low Priority:
8. Other admin pages
9. Mobile responsive
10. Performance

---

## 🐛 BUG TRACKING

### Bugs Found:
| # | Page | Issue | Severity | Status |
|---|------|-------|----------|--------|
| 1 | - | - | - | - |

### Console Errors:
| # | Error | Page | Fix |
|---|-------|------|-----|
| 1 | - | - | - |

---

## 📸 SCREENSHOTS

### Analytics Dashboard
- [ ] Desktop view
- [ ] Mobile view
- [ ] Charts rendering

### Bulk Actions
- [ ] Toolbar visible
- [ ] Selection state
- [ ] Confirmation dialog

### Homestay Images
- [ ] Empty state
- [ ] With images
- [ ] Error state
- [ ] Media picker

### Review Management
- [ ] Stats cards
- [ ] Table view
- [ ] Response dialog

---

## ✅ TEST RESULTS

### Pass Rate: __/__ (__%)

### Summary:
- ✅ Passed: __
- ❌ Failed: __
- ⏳ Pending: __

### Notes:
```
[Ghi chú kết quả test ở đây]
```

---

## 🚀 NEXT STEPS

1. [ ] Fix bugs found
2. [ ] Apply Advanced Filters to all pages
3. [ ] Apply Bulk Actions to Homestays
4. [ ] Add Toast notifications
5. [ ] Performance optimization

---

**Tester:** AI Testing Team  
**Date:** 28/10/2025  
**Browser:** Chrome/Safari/Firefox  
**Device:** Desktop/Mobile
