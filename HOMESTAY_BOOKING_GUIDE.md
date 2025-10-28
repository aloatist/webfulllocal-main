# 📘 Hướng Dẫn Quản Lý Booking Homestay

**Last Updated**: January 22, 2025  
**Version**: 1.0

---

## 📋 Tổng Quan

Hệ thống quản lý booking homestay cho phép admin theo dõi và xử lý các đặt phòng từ khách hàng với quy trình rõ ràng từ khi nhận booking đến khi hoàn tất.

---

## 🔗 Truy Cập

### Từ Admin Dashboard:
1. Đăng nhập vào `/admin`
2. Sidebar → **Sản phẩm & Giao dịch** → **Booking Homestay**
3. Hoặc truy cập trực tiếp: `/admin/homestay-bookings`

---

## 📊 Quy Trình Booking

### Workflow Chuẩn:

```
┌─────────────┐
│   PENDING   │  ⏳ Chờ xử lý
│ (Mới nhận)  │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│  CONFIRMED  │   │  CANCELLED  │  ✕ Đã hủy
│ ✓ Đã xác nhận│   │             │
└──────┬──────┘   └─────────────┘
       │                 │
       ▼                 │
┌─────────────┐          │
│  COMPLETED  │  ✓ Hoàn tất      │
│             │          │
└─────────────┘          │
                         │
                    ┌────▼────┐
                    │ PENDING │ ↻ Khôi phục
                    └─────────┘
```

---

## 🎯 Các Trạng Thái Booking

### 1. ⏳ PENDING (Chờ xử lý)
**Mô tả**: Booking mới vừa được tạo, chưa được xác nhận

**Hành động có thể thực hiện**:
- ✓ **Xác nhận**: Chuyển sang CONFIRMED
- ✕ **Hủy**: Chuyển sang CANCELLED

**Khi nào**: Ngay sau khi khách đặt phòng

**Cần làm gì**:
1. Kiểm tra thông tin khách hàng
2. Xác nhận phòng còn trống
3. Liên hệ khách trong vòng 24h
4. Click "Xác nhận" hoặc "Hủy"

---

### 2. ✓ CONFIRMED (Đã xác nhận)
**Mô tả**: Booking đã được xác nhận, khách sẽ đến

**Hành động có thể thực hiện**:
- ✓ **Hoàn tất**: Chuyển sang COMPLETED (sau khi khách check-out)
- ✕ **Hủy**: Chuyển sang CANCELLED (nếu khách hủy)

**Khi nào**: Sau khi xác nhận với khách

**Cần làm gì**:
1. Gửi email xác nhận cho khách
2. Chuẩn bị phòng
3. Chờ khách check-in
4. Sau khi khách check-out, click "Hoàn tất"

---

### 3. ✓ COMPLETED (Hoàn tất)
**Mô tả**: Khách đã check-out, booking hoàn tất

**Hành động có thể thực hiện**:
- Không có hành động (trạng thái cuối)

**Khi nào**: Sau khi khách check-out

**Lưu ý**:
- Booking này sẽ được dùng cho thống kê
- Có thể gửi email nhắc review
- Không thể thay đổi trạng thái

---

### 4. ✕ CANCELLED (Đã hủy)
**Mô tả**: Booking đã bị hủy (do khách hoặc admin)

**Hành động có thể thực hiện**:
- ↻ **Khôi phục**: Chuyển về PENDING (nếu hủy nhầm)

**Khi nào**: 
- Khách hủy booking
- Admin hủy do lý do nào đó

**Lưu ý**:
- Phòng sẽ được giải phóng
- Có thể khôi phục nếu hủy nhầm

---

## 🔍 Bộ Lọc & Tìm Kiếm

### Lọc Theo Trạng Thái:
- **Tất cả trạng thái**: Hiển thị tất cả
- **⏳ Chờ xử lý**: Chỉ PENDING
- **✓ Đã xác nhận**: Chỉ CONFIRMED
- **✓ Hoàn tất**: Chỉ COMPLETED
- **✕ Đã hủy**: Chỉ CANCELLED

### Lọc Theo Kênh:
- **Mọi kênh**: Tất cả nguồn booking
- **cocoisland.vn**: Từ Coco Island
- **website**: Từ website chính
- **phone**: Đặt qua điện thoại
- **walk-in**: Khách walk-in

### Tìm Kiếm:
- Tìm theo **mã booking** (reference)
- Tìm theo **số điện thoại khách**
- Tìm theo **channel reference**

---

## 📝 Thông Tin Hiển Thị

### Cột Booking:
- **Mã booking**: Reference code (ví dụ: HS12345678)
- **Kênh**: Nguồn booking (cocoisland.vn, website, etc.)
- **Channel Reference**: Mã từ kênh bên ngoài
- **Yêu cầu đặc biệt**: Ghi chú từ khách

### Cột Khách:
- **Số người lớn**: Adult count
- **Số trẻ em**: Children count
- **Phòng**: Tên phòng đã đặt
- **Homestay**: Tên homestay

### Cột Thời Gian:
- **Check-in**: Ngày nhận phòng
- **Check-out**: Ngày trả phòng
- **Tạo lúc**: Thời gian tạo booking

### Cột Trạng Thái:
- Badge màu theo trạng thái
- Thông báo lỗi (nếu có)

### Cột Hành Động:
- Buttons tương ứng với trạng thái hiện tại

---

## 💡 Hướng Dẫn Sử Dụng

### Xử Lý Booking Mới (PENDING):

1. **Kiểm tra thông tin**:
   - Xem số khách, ngày check-in/out
   - Đọc yêu cầu đặc biệt
   - Kiểm tra phòng có sẵn không

2. **Liên hệ khách**:
   - Gọi điện xác nhận
   - Gửi email xác nhận
   - Giải đáp thắc mắc

3. **Xác nhận hoặc hủy**:
   - Click **"✓ Xác nhận"** nếu OK
   - Click **"✕ Hủy"** nếu không thể nhận

---

### Quản Lý Booking Đã Xác Nhận (CONFIRMED):

1. **Chuẩn bị**:
   - Chuẩn bị phòng trước ngày check-in
   - Gửi email nhắc nhở khách
   - Chuẩn bị amenities

2. **Check-in**:
   - Đón khách
   - Hướng dẫn sử dụng phòng
   - Giải đáp thắc mắc

3. **Check-out**:
   - Kiểm tra phòng
   - Thu tiền (nếu chưa)
   - Click **"✓ Hoàn tất"**

---

### Xử Lý Hủy Booking:

1. **Từ PENDING hoặc CONFIRMED**:
   - Click **"✕ Hủy"**
   - Phòng tự động được giải phóng
   - Thông báo cho khách

2. **Khôi phục nếu hủy nhầm**:
   - Tìm booking đã hủy
   - Click **"↻ Khôi phục"**
   - Booking quay về PENDING

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Thời Gian Xử Lý:
- ⏰ **PENDING → CONFIRMED**: Trong vòng 24h
- ⏰ **CONFIRMED → COMPLETED**: Sau check-out
- ⏰ **Hủy booking**: Càng sớm càng tốt

### 2. Tính Khả Dụng:
- Khi **XÁC NHẬN**: Phòng bị khóa
- Khi **HỦY**: Phòng được giải phóng
- Khi **KHÔI PHỤC**: Phòng lại bị khóa

### 3. Thông Báo:
- Email tự động gửi khi xác nhận
- Telegram alert cho admin
- Khách nhận email xác nhận

### 4. Không Thể Hoàn Tác:
- **COMPLETED**: Không thể chuyển về trạng thái khác
- Cẩn thận khi click "Hoàn tất"

---

## 🔔 Notifications

### Email Khách Hàng:
- ✅ Khi booking mới (PENDING)
- ✅ Khi xác nhận (CONFIRMED)
- ✅ Nhắc nhở trước check-in (1 ngày)
- ✅ Nhắc review sau check-out (3 ngày)

### Telegram Admin:
- 🔔 Booking mới
- 🔔 Khách hủy booking
- 🔔 Booking sắp check-in (1 ngày)

---

## 📊 Thống Kê & Báo Cáo

### Metrics Quan Trọng:
- **Tỷ lệ xác nhận**: CONFIRMED / PENDING
- **Tỷ lệ hủy**: CANCELLED / Total
- **Tỷ lệ hoàn tất**: COMPLETED / CONFIRMED
- **Thời gian xử lý**: Từ PENDING → CONFIRMED

### Xem Thống Kê:
- Dashboard admin
- Báo cáo hàng tuần
- Export data (coming soon)

---

## 🐛 Xử Lý Lỗi

### Không Cập Nhật Được Trạng Thái:
1. Kiểm tra kết nối internet
2. Refresh trang
3. Thử lại sau vài giây
4. Liên hệ IT nếu vẫn lỗi

### Booking Bị Trùng:
1. Kiểm tra availability
2. Hủy một trong hai
3. Liên hệ khách để xác nhận

### Phòng Không Khả Dụng:
1. Hủy booking
2. Đề xuất phòng khác
3. Hoàn tiền nếu cần

---

## 🎯 Best Practices

### 1. Xử Lý Nhanh:
- ✅ Xử lý PENDING trong 24h
- ✅ Trả lời khách trong 2h
- ✅ Xác nhận qua nhiều kênh

### 2. Giao Tiếp Rõ Ràng:
- ✅ Email xác nhận chi tiết
- ✅ SMS nhắc nhở
- ✅ Điện thoại xác nhận

### 3. Theo Dõi:
- ✅ Check dashboard mỗi ngày
- ✅ Xem booking sắp check-in
- ✅ Follow up sau check-out

### 4. Ghi Chú:
- ✅ Ghi chú yêu cầu đặc biệt
- ✅ Ghi chú vấn đề phát sinh
- ✅ Ghi chú feedback khách

---

## 🔐 Phân Quyền

### ADMIN:
- ✅ Xem tất cả bookings
- ✅ Thay đổi trạng thái
- ✅ Hủy booking
- ✅ Xem thống kê

### EDITOR:
- ✅ Xem tất cả bookings
- ✅ Thay đổi trạng thái
- ✅ Hủy booking
- ❌ Không xem thống kê tài chính

### VIEWER:
- ✅ Xem bookings
- ❌ Không thay đổi trạng thái

---

## 📞 Hỗ Trợ

### Liên Hệ:
- **Email**: admin@conphungtourist.com
- **Phone**: 0123 456 789
- **Telegram**: @conphung_support

### Tài Liệu:
- API Documentation: `/docs/api`
- User Guide: `/docs/user-guide`
- FAQ: `/docs/faq`

---

## ✅ Checklist Hàng Ngày

### Buổi Sáng (9:00 AM):
- [ ] Check bookings PENDING mới
- [ ] Xác nhận bookings trong 24h
- [ ] Check bookings check-in hôm nay
- [ ] Chuẩn bị phòng

### Buổi Chiều (2:00 PM):
- [ ] Follow up bookings chưa xác nhận
- [ ] Check bookings check-out hôm nay
- [ ] Hoàn tất bookings đã check-out

### Buổi Tối (6:00 PM):
- [ ] Review bookings ngày mai
- [ ] Gửi email nhắc nhở
- [ ] Chuẩn bị cho ngày mai

---

## 🎉 Tóm Tắt

Hệ thống booking homestay giúp bạn:
- ✅ Quản lý booking hiệu quả
- ✅ Theo dõi trạng thái rõ ràng
- ✅ Giao tiếp với khách tốt hơn
- ✅ Tăng tỷ lệ xác nhận
- ✅ Giảm tỷ lệ hủy

**Quy trình đơn giản**: PENDING → CONFIRMED → COMPLETED

**Luôn nhớ**: Xử lý nhanh, giao tiếp rõ ràng, theo dõi sát sao!

---

**Last Updated**: January 22, 2025  
**Version**: 1.0  
**Status**: ✅ Complete
