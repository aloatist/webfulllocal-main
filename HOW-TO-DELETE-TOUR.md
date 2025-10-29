# 🗑️ Hướng dẫn Xóa Tour

## ❌ Lỗi thường gặp

```
Cannot delete tour that is referenced by other records (bookings, departures, etc).
```

**Nguyên nhân:** Tour có dữ liệu liên quan (bookings, departures, reviews)

---

## ✅ Cách xóa đúng

### Option 1: Force Delete (Xóa toàn bộ) ⚠️

**Bước 1:** Vào `/admin/tours`

**Bước 2:** Click nút "Delete" trên tour muốn xóa

**Bước 3:** Dialog đầu tiên - Confirm xóa tour
```
Bạn có chắc muốn xóa tour "Tour Đà Lạt 3N2Đ"?

[Cancel] [OK]
```
→ Click **OK**

**Bước 4:** Dialog thứ hai - Hiển thị lỗi và hỏi Force Delete
```
Cannot delete tour that has related records.

📊 Dữ liệu liên quan:
• 1 booking(s)
• 1 departure(s)
• 5 review(s)

📝 Tổng: 7 record(s)

💡 Bạn có muốn XÓA TOÀN BỘ (tour + tất cả dữ liệu liên quan)?

[Cancel] [OK]
```
→ Click **OK**

**Bước 5:** Dialog thứ ba - Cảnh báo cuối cùng
```
⚠️ CẢNH BÁO: Hành động này KHÔNG THỂ HOÀN TÁC!

[Cancel] [OK]
```
→ Click **OK**

**Bước 6:** Xóa thành công!
```
✅ Đã xóa tour và 1 bookings, 1 departures, 5 reviews!
```

---

### Option 2: Xóa từng phần (An toàn hơn)

#### 2.1. Xóa Bookings
```
1. Vào /admin/bookings
2. Tìm bookings của tour
3. Click "Xem" → Click "Xóa booking"
4. Confirm
```

#### 2.2. Xóa Departures
```
1. Vào /admin/tours
2. Click "Edit" tour
3. Scroll xuống "Departures & Pricing"
4. Xóa tất cả departures
5. Click "Save"
```

#### 2.3. Xóa Reviews
```
1. Vào /admin/reviews
2. Tìm reviews của tour
3. Click "Delete" trên từng review
```

#### 2.4. Xóa Tour
```
1. Vào /admin/tours
2. Click "Delete" tour
3. Confirm → ✅ Success (không còn related records)
```

---

### Option 3: Archive (Khuyến nghị) ✅

**Thay vì xóa, đổi status:**

```
1. Vào /admin/tours
2. Click "Edit" tour
3. Đổi Status → ARCHIVED
4. Click "Save"
```

**Lợi ích:**
- ✅ Giữ lại data history
- ✅ Giữ lại bookings/reviews
- ✅ Có thể restore sau này
- ✅ Không hiển thị cho public

---

## 🎯 Khi nào dùng Force Delete?

### ✅ Nên dùng khi:
- Test data
- Duplicate tours
- Spam tours
- Tour tạo nhầm

### ❌ KHÔNG nên dùng khi:
- Tour có bookings thật
- Tour có reviews khách hàng
- Chưa chắc chắn 100%

**→ Dùng Archive thay thế!**

---

## 🔍 Troubleshooting

### Vấn đề 1: Không thấy dialog "Bạn có muốn XÓA TOÀN BỘ?"

**Nguyên nhân:** Có thể đã click Cancel ở dialog đầu tiên

**Giải pháp:**
1. Refresh trang
2. Thử lại từ đầu
3. Đảm bảo click OK ở MỌI dialog

---

### Vấn đề 2: Vẫn báo lỗi sau khi Force Delete

**Nguyên nhân:** Code chưa được deploy hoặc browser cache

**Giải pháp:**
```bash
# Restart server
./dev-stop.sh
./dev-start.sh

# Clear browser cache
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

---

### Vấn đề 3: Muốn undo sau khi Force Delete

**Giải pháp:** ❌ KHÔNG THỂ!

Force Delete là permanent. Cần restore từ database backup.

---

## 📊 So sánh các phương pháp

| Phương pháp | Tốc độ | An toàn | Có thể undo | Khuyến nghị |
|-------------|--------|---------|-------------|-------------|
| Force Delete | ⚡ Nhanh | ⚠️ Nguy hiểm | ❌ Không | Test data |
| Xóa từng phần | 🐌 Chậm | ✅ An toàn | ❌ Không | Production |
| Archive | ⚡ Nhanh | ✅ Rất an toàn | ✅ Có | **Khuyến nghị** |

---

## 🎓 Best Practices

### 1. Luôn Archive trước
```
Archive → Đợi 1 tuần → Nếu OK → Xóa
```

### 2. Export data trước khi xóa
```
Export tour details → Save to file → Xóa
```

### 3. Backup database thường xuyên
```bash
# Daily backup
pg_dump database > backup_$(date +%Y%m%d).sql
```

### 4. Kiểm tra kỹ trước khi Force Delete
```
- Có phải test data?
- Có bookings thật không?
- Có cần giữ lại không?
```

---

## 🚀 Quick Commands

### Xóa nhanh (Force Delete)
```
/admin/tours → Delete → OK → OK → OK
```

### Xóa an toàn (Archive)
```
/admin/tours → Edit → Status: ARCHIVED → Save
```

### Xóa từng phần
```
/admin/bookings → Delete bookings
/admin/tours → Edit → Delete departures
/admin/reviews → Delete reviews
/admin/tours → Delete tour
```

---

## ✅ Checklist trước khi Force Delete

- [ ] Đây là test data?
- [ ] Không có bookings thật?
- [ ] Đã export data?
- [ ] Đã backup database?
- [ ] Chắc chắn 100% muốn xóa?
- [ ] Đã cân nhắc Archive?

**Nếu tất cả ✅ → OK để Force Delete**

---

## 📞 Cần trợ giúp?

### Nếu gặp vấn đề:
1. Check console logs (F12)
2. Check server logs
3. Restart server
4. Clear browser cache

### Nếu vẫn không được:
- Dùng Archive thay thế
- Hoặc xóa từng phần

---

**Nhớ:** Force Delete là PERMANENT! Không thể hoàn tác! ⚠️
