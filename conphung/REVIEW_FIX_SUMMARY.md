# Khắc phục Bug: Từ chối Review không lưu và hiển thị

## Vấn đề đã phát hiện

### 1. **TourReview thiếu trường status**
- Model `TourReview` chỉ có trường `isPublished` (boolean)
- Không có cách nào lưu trạng thái REJECTED
- Khi từ chối review, chỉ set `isPublished = false`, giống như PENDING

### 2. **API PATCH không lưu status đúng**
- File: `/conphung/app/api/admin/reviews/[id]/route.ts`
- Chỉ update `isPublished`, không có trường `status`

### 3. **API GET không lọc đúng**
- File: `/conphung/app/api/admin/reviews/route.ts`
- Lọc theo `isPublished` thay vì `status`
- Không phân biệt được PENDING vs REJECTED

## Giải pháp đã thực hiện

### 1. Thêm trường `status` vào TourReview
```prisma
model TourReview {
  // ... existing fields
  status      ReviewStatus @default(PENDING)  // ✅ THÊM MỚI
  isPublished Boolean      @default(false)
  // ...
  
  @@index([status])  // ✅ THÊM INDEX
}
```

### 2. Chạy migration
```bash
npx prisma migrate dev --name add_status_to_tour_review
```

Migration tự động:
- Thêm cột `status` với default = 'PENDING'
- Tạo index cho cột `status`

### 3. Cập nhật dữ liệu cũ
```bash
npx tsx scripts/update-tour-review-status.ts
```

Script đã update:
- 3 reviews có `isPublished=true` → `status='APPROVED'`
- Các reviews còn lại giữ nguyên `status='PENDING'`

### 4. Cập nhật API PATCH
**Trước:**
```typescript
data: {
  ...(status && { isPublished: status === 'APPROVED' }),
}
```

**Sau:**
```typescript
data: {
  ...(status && { 
    status: status,                    // ✅ Lưu status
    isPublished: status === 'APPROVED' // Giữ backward compatibility
  }),
}
```

### 5. Cập nhật API GET
**Trước:**
```typescript
where: status && status !== 'all' ? {
  isPublished: status === 'APPROVED',  // ❌ Sai logic
} : undefined,
```

**Sau:**
```typescript
where: status && status !== 'all' ? {
  status: status as any,  // ✅ Lọc đúng theo status
} : undefined,
```

**Format response - Trước:**
```typescript
status: review.isPublished ? 'APPROVED' : 'PENDING',  // ❌ Không có REJECTED
```

**Format response - Sau:**
```typescript
status: review.status,  // ✅ Trả về đúng status từ DB
```

## Cách test

### Test 1: Từ chối review
1. Vào trang **Quản lý đánh giá**: http://localhost:3000/admin/reviews
2. Tìm review có status PENDING (ID: GoY4MixPhHzjm3jC8r91o)
3. Click nút **"Từ chối"**
4. Xác nhận trong dialog
5. **Kết quả mong đợi:**
   - Hiển thị "Đã từ chối đánh giá thành công!"
   - Review biến mất khỏi danh sách (vì đang filter PENDING)

### Test 2: Kiểm tra trong database
```sql
SELECT id, status, "isPublished" 
FROM "TourReview" 
WHERE id = 'GoY4MixPhHzjm3jC8r91o';
```
**Kết quả mong đợi:**
- `status` = 'REJECTED'
- `isPublished` = false

### Test 3: Lọc theo status
1. Chọn filter **"Tất cả"** → Hiển thị tất cả reviews
2. Chọn filter **"PENDING"** → Chỉ hiển thị reviews chưa duyệt
3. Chọn filter **"APPROVED"** → Chỉ hiển thị reviews đã duyệt
4. Chọn filter **"REJECTED"** → Chỉ hiển thị reviews đã từ chối

### Test 4: Kiểm tra trên trang Tour/Homestay
1. Vào trang chi tiết tour/homestay có review bị từ chối
2. **Kết quả mong đợi:** Review REJECTED không hiển thị
3. Chỉ hiển thị reviews có status = 'APPROVED'

## Files đã thay đổi

1. ✅ `/conphung/prisma/schema.prisma` - Thêm trường status
2. ✅ `/conphung/prisma/migrations/20251029125130_add_status_to_tour_review/migration.sql` - Migration
3. ✅ `/conphung/scripts/update-tour-review-status.ts` - Script update data
4. ✅ `/conphung/app/api/admin/reviews/[id]/route.ts` - API PATCH
5. ✅ `/conphung/app/api/admin/reviews/route.ts` - API GET

## Kiểm tra console logs

Khi test, kiểm tra console logs để debug:

**API PATCH logs:**
```
[PATCH Review] ID: xxx Status: REJECTED Response: undefined
[PATCH] Found tour review, updating...
[PATCH] Updated tour review: xxx New status: REJECTED
```

**API GET logs:**
```
Loaded reviews: X reviews
Sample review: { id: 'xxx', status: 'REJECTED', ... }
```

## Backward Compatibility

- Trường `isPublished` vẫn được giữ và update
- Các query cũ dựa vào `isPublished` vẫn hoạt động
- Frontend hiển thị review dựa vào `status = 'APPROVED'`

## Lưu ý

- Server đã được restart để load Prisma Client mới
- TypeScript types đã được regenerate
- Tất cả reviews cũ đã được migrate đúng status
