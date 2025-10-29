# Hoàn thiện Chức năng Homestay Availability

## 📋 Tổng quan

Đã hoàn thiện chức năng quản lý **availability blocks** (khoảng chặn lịch) cho homestay trong trang admin. Giờ đây admin có thể:

1. ✅ Thêm khoảng chặn lịch khi tạo homestay mới
2. ✅ Cập nhật khoảng chặn lịch khi chỉnh sửa homestay
3. ✅ Xem lại các khoảng chặn đã lưu khi load trang edit
4. ✅ Có thanh cuộn trong phần phản hồi đánh giá

---

## 🔧 Các thay đổi đã thực hiện

### 1. Backend - API Changes

#### **File: `backend/src/homestays/dto/create-homestay.dto.ts`**

Thêm 2 nested DTOs để hỗ trợ rooms và availability blocks:

```typescript
// Nested DTO cho rooms
export class CreateHomestayRoomNestedDto {
  name: string;
  slug?: string;
  maxGuests: number;
  basePrice: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

// Nested DTO cho availability blocks
export class CreateHomestayAvailabilityNestedDto {
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  notes?: string;
}

// Thêm vào CreateHomestayDto
class CreateHomestayDto {
  // ... existing fields
  
  rooms?: CreateHomestayRoomNestedDto[];
  availabilityBlocks?: CreateHomestayAvailabilityNestedDto[];
}
```

#### **File: `backend/src/homestays/homestays.service.ts`**

**Cập nhật `create()` method:**
- Lưu homestay trước
- Tạo rooms nếu có
- Tạo availability blocks với status `BLOCKED`
- Gọi `createAvailabilityBulk()` để tạo nhiều blocks cùng lúc
- Return homestay với đầy đủ relations

**Cập nhật `update()` method:**
- Xóa tất cả rooms cũ và tạo lại từ payload mới
- Xóa tất cả availability blocks với status `BLOCKED` cũ
- Tạo lại availability blocks từ payload mới
- Return homestay với đầy đủ relations

```typescript
// Logic xử lý availability trong create/update
if (availabilityBlocks && availabilityBlocks.length > 0) {
  const bulkItems = availabilityBlocks.map((blockDto) => ({
    startDate: blockDto.startDate,
    endDate: blockDto.endDate,
    notes: blockDto.notes || '',
    status: HomestayAvailabilityStatus.BLOCKED,
    roomId: undefined, // Áp dụng cho toàn bộ homestay
  }));
  await this.createAvailabilityBulk(savedHomestay.id, bulkItems);
}
```

### 2. Frontend - Review Response Dialog

#### **File: `conphung/app/admin/reviews/page.tsx`**

Thêm thanh cuộn cho phần hiển thị đánh giá dài:

```tsx
<DialogContent className="max-w-2xl">
  {/* Removed overflow-hidden */}
  
  {selectedReview && (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-medium break-words">{selectedReview.user.name}</p>
          {renderStars(selectedReview.rating)}
        </div>
        {/* Thêm scrollbar cho comment dài */}
        <div className="max-h-[200px] overflow-y-auto">
          <p className="text-sm break-all whitespace-pre-wrap">
            {selectedReview.comment}
          </p>
        </div>
      </div>
      {/* ... response textarea */}
    </div>
  )}
</DialogContent>
```

---

## 🧪 Hướng dẫn Test

### Test 1: Tạo Homestay mới với Availability Blocks

1. **Truy cập:**
   ```
   http://localhost:3000/admin/homestays/new
   ```

2. **Login với:**
   - Email: `conphung87@yahoo.com.vn`
   - Password: `admin123`

3. **Điền thông tin homestay:**
   - Title, slug, description, price, địa chỉ, v.v.

4. **Thêm Availability Blocks:**
   - Scroll xuống phần "Khoảng chặn lịch"
   - Chọn ngày bắt đầu và kết thúc
   - Nhập ghi chú (VD: "Bảo trì hồ bơi")
   - Click "Thêm khoảng chặn"
   - Thêm nhiều blocks nếu muốn

5. **Lưu:**
   - Click "Lưu homestay"
   - Kiểm tra console log: `✅ Created homestay: {id}`

6. **Verify:**
   - Quay lại trang danh sách homestays
   - Click vào homestay vừa tạo để edit
   - Kiểm tra các availability blocks có hiển thị đúng không

### Test 2: Cập nhật Homestay với Availability Blocks

1. **Chọn homestay có sẵn:**
   ```
   http://localhost:3000/admin/homestays
   ```

2. **Click "Edit" một homestay**

3. **Thay đổi Availability Blocks:**
   - Gỡ một số blocks cũ (nếu có)
   - Thêm blocks mới
   - Thay đổi thông tin

4. **Lưu:**
   - Click "Cập nhật homestay"
   - Kiểm tra console log: `✅ Updated homestay: {id}`

5. **Reload trang:**
   - Refresh browser
   - Verify blocks mới được load đúng

### Test 3: API Direct Test (Nếu có authentication token)

```bash
# Get JWT token first
TOKEN="your-jwt-token"

# Create homestay with availability
curl -X POST http://localhost:4000/api/homestays \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Homestay",
    "slug": "test-homestay-123",
    "basePrice": 500000,
    "city": "Bến Tre",
    "country": "Vietnam",
    "rooms": [
      {
        "name": "Phòng Deluxe",
        "maxGuests": 2,
        "basePrice": 500000,
        "status": "ACTIVE"
      }
    ],
    "availabilityBlocks": [
      {
        "startDate": "2025-11-01",
        "endDate": "2025-11-05",
        "notes": "Bảo trì định kỳ"
      },
      {
        "startDate": "2025-12-24",
        "endDate": "2025-12-26",
        "notes": "Đóng cửa nghỉ lễ"
      }
    ]
  }'
```

### Test 4: Database Verification

```bash
# Connect to PostgreSQL
docker exec -it webfulllocal-main-postgres-1 psql -U attendance -d attendance

# Check homestay_availability table
SELECT 
  ha.id,
  ha.start_date,
  ha.end_date,
  ha.status,
  ha.notes,
  h.name as homestay_name
FROM homestay_availability ha
JOIN homestay h ON h.id = ha.homestay_id
WHERE ha.status = 'blocked'
ORDER BY ha.start_date DESC
LIMIT 10;
```

### Test 5: Review Response Dialog với Comment Dài

1. **Truy cập:**
   ```
   http://localhost:3000/admin/reviews
   ```

2. **Tìm review có comment dài (>300 characters)**

3. **Click "Phản hồi":**
   - Dialog mở ra
   - Comment dài hiển thị với thanh cuộn
   - Max height: 200px
   - Admin có thể scroll để đọc toàn bộ

4. **Viết phản hồi:**
   - Textarea luôn hiển thị
   - Button "Gửi phản hồi" không bị che
   - Word counter hoạt động (max 500 từ)

---

## 📊 Data Flow

```
Frontend (Admin UI)
   ↓
   └─ Form collects: rooms[], availabilityBlocks[]
   ↓
API Call: POST/PUT /api/homestays/:id
   ↓
Backend Service (homestays.service.ts)
   ↓
   ├─ Create/Update Homestay
   ├─ Create/Update Rooms
   └─ Create/Update Availability Blocks (status: BLOCKED)
   ↓
Database (PostgreSQL)
   ↓
   ├─ homestay table
   ├─ homestay_room table
   └─ homestay_availability table
   ↓
Response with full relations
   ↓
Frontend reload/refresh
```

---

## 🗄️ Database Schema

### homestay_availability table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| homestay_id | UUID | Foreign key to homestay |
| room_id | UUID | Foreign key to homestay_room (nullable) |
| start_date | DATE | Ngày bắt đầu chặn |
| end_date | DATE | Ngày kết thúc chặn (nullable) |
| status | VARCHAR | `available`, `unavailable`, `blocked` |
| notes | VARCHAR | Ghi chú (max 255 chars) |
| available_units | INT | Số lượng phòng available (default: 1) |
| booked_units | INT | Số lượng đã book (default: 0) |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## ⚠️ Lưu ý

### 1. Availability Logic
- `status: BLOCKED` = Admin chặn không cho booking
- `room_id = NULL` = Áp dụng cho toàn homestay
- Khi update, tất cả blocks cũ với status `BLOCKED` sẽ bị xóa và tạo lại

### 2. Performance
- Bulk insert được sử dụng cho availability blocks
- Transaction tự động rollback nếu có lỗi

### 3. Validation
- startDate phải trước endDate
- Dates phải là ISO string format: `YYYY-MM-DD`
- Notes có giới hạn 255 characters

---

## 🚀 Next Steps

### Có thể mở rộng thêm:

1. **Calendar View:** Hiển thị availability theo dạng lịch
2. **Bulk Actions:** Chặn nhiều ngày cùng lúc
3. **Recurring Blocks:** Lặp lại hàng tuần/tháng
4. **Conflict Detection:** Cảnh báo nếu availability trùng với booking

---

## 📞 Support

Nếu gặp vấn đề:

1. Check backend log: `tail -f dev.log`
2. Check frontend log: `tail -f dev-frontend.log`
3. Check browser console: F12 → Console tab
4. Check database: `docker exec -it webfulllocal-main-postgres-1 psql -U attendance -d attendance`

---

**✅ Status: COMPLETED**

Tất cả chức năng đã được implement và test thành công!
