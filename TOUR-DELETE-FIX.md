# ✅ Tour Delete - Improved Error Handling

## 🐛 Vấn đề

**Error:** "Cannot delete tour that is referenced by other records (bookings, departures, etc)."

**Nguyên nhân:** Tour có dữ liệu liên quan (bookings, departures, reviews) → Backend từ chối xóa

---

## 🛠️ Fix đã áp dụng

### Fix 1: Backend - Check Related Records

**File:** `/conphung/app/api/tours/[tourId]/route.ts`

**Trước:**
```typescript
await prisma.tour.delete({ where: { id: tourId } })
// Nếu fail → Generic error
```

**Sau:**
```typescript
// Check for related records BEFORE deleting
const [bookingsCount, departuresCount, reviewsCount] = await Promise.all([
  prisma.booking.count({ where: { tourId } }),
  prisma.tourDeparture.count({ where: { tourId } }),
  prisma.tourReview.count({ where: { tourId } }),
])

const totalRelated = bookingsCount + departuresCount + reviewsCount

if (totalRelated > 0) {
  return NextResponse.json(
    {
      error: 'Cannot delete tour that has related records.',
      details: {
        bookings: bookingsCount,
        departures: departuresCount,
        reviews: reviewsCount,
        total: totalRelated,
      },
      suggestion:
        'Please delete all related bookings, departures, and reviews first, or archive the tour instead.',
    },
    { status: 409 }
  )
}

await prisma.tour.delete({ where: { id: tourId } })
```

**Cải thiện:**
- ✅ Check trước khi delete
- ✅ Trả về số lượng cụ thể
- ✅ Đưa ra suggestion

---

### Fix 2: Frontend - Detailed Error Message

**File:** `/conphung/app/admin/tours/page.tsx`

**Trước:**
```typescript
if (!response.ok) {
  const body = await response.json().catch(() => null);
  throw new Error(body?.error ?? 'Không thể xóa tour...');
}
```

**Sau:**
```typescript
if (!response.ok) {
  const body = await response.json().catch(() => null);
  
  console.error('❌ Delete error:', body);
  
  // Handle conflict error (409) with detailed info
  if (response.status === 409 && body?.details) {
    const { bookings, departures, reviews, total } = body.details;
    
    let detailedMessage = body.error || 'Không thể xóa tour có dữ liệu liên quan.';
    
    detailedMessage += '\n\n📊 Dữ liệu liên quan:';
    if (bookings > 0) detailedMessage += `\n• ${bookings} booking(s)`;
    if (departures > 0) detailedMessage += `\n• ${departures} departure(s)`;
    if (reviews > 0) detailedMessage += `\n• ${reviews} review(s)`;
    detailedMessage += `\n\n📝 Tổng: ${total} record(s)`;
    
    detailedMessage += '\n\n💡 Giải pháp:';
    detailedMessage += '\n1. Xóa tất cả bookings, departures, reviews trước';
    detailedMessage += '\n2. Hoặc Archive tour thay vì xóa (đổi status sang ARCHIVED)';
    
    console.warn('⚠️ Cannot delete tour:', body.details);
    throw new Error(detailedMessage);
  }
  
  throw new Error(body?.error ?? 'Không thể xóa tour...');
}
```

**Cải thiện:**
- ✅ Hiển thị số lượng cụ thể
- ✅ Đưa ra 2 giải pháp rõ ràng
- ✅ Console logging để debug

---

## 🧪 Test

### Test 1: Delete Tour Without Related Records

1. **Setup:** Tạo tour mới, không có bookings/departures/reviews
2. **Action:** Click "Delete" → Confirm
3. **Expected:** ✅ Xóa thành công, alert "✅ Đã xóa tour thành công!"

### Test 2: Delete Tour With Related Records

1. **Setup:** 
   - Tour có 2 bookings
   - Tour có 3 departures
   - Tour có 1 review

2. **Action:** Click "Delete" → Confirm

3. **Expected Error:**
   ```
   Cannot delete tour that has related records.
   
   📊 Dữ liệu liên quan:
   • 2 booking(s)
   • 3 departure(s)
   • 1 review(s)
   
   📝 Tổng: 6 record(s)
   
   💡 Giải pháp:
   1. Xóa tất cả bookings, departures, reviews trước
   2. Hoặc Archive tour thay vì xóa (đổi status sang ARCHIVED)
   ```

4. **Console:**
   ```
   ❌ Delete error: { error: "...", details: { bookings: 2, departures: 3, reviews: 1, total: 6 } }
   ⚠️ Cannot delete tour: { bookings: 2, departures: 3, reviews: 1, total: 6 }
   ```

---

## 💡 Giải pháp cho User

### Option 1: Xóa Related Records Trước

**Bước 1: Xóa Bookings**
```
/admin/bookings → Tìm bookings của tour → Delete
```

**Bước 2: Xóa Departures**
```
/admin/tours → Edit tour → Xóa tất cả departures → Save
```

**Bước 3: Xóa Reviews**
```
/admin/reviews → Tìm reviews của tour → Delete
```

**Bước 4: Xóa Tour**
```
/admin/tours → Delete tour → Success!
```

---

### Option 2: Archive Tour (Khuyến nghị)

**Thay vì xóa, đổi status:**

1. Edit tour
2. Đổi Status → ARCHIVED
3. Save

**Lợi ích:**
- ✅ Giữ lại data history
- ✅ Không mất bookings/reviews
- ✅ Có thể restore sau này
- ✅ Không hiển thị cho public

---

## 🎯 Best Practices

### 1. Soft Delete thay vì Hard Delete

**Thêm field `deletedAt`:**
```prisma
model Tour {
  // ... other fields
  deletedAt DateTime?
}
```

**Khi "delete":**
```typescript
await prisma.tour.update({
  where: { id: tourId },
  data: { deletedAt: new Date() }
})
```

**Khi query:**
```typescript
await prisma.tour.findMany({
  where: { deletedAt: null }  // Chỉ lấy tours chưa xóa
})
```

---

### 2. Cascade Delete (Cẩn thận!)

**Option A: Database Level**
```prisma
model TourDeparture {
  tourId String
  tour   Tour   @relation(fields: [tourId], references: [id], onDelete: Cascade)
}
```

**Option B: Application Level**
```typescript
// Delete all related records first
await prisma.booking.deleteMany({ where: { tourId } })
await prisma.tourDeparture.deleteMany({ where: { tourId } })
await prisma.tourReview.deleteMany({ where: { tourId } })
await prisma.tour.delete({ where: { id: tourId } })
```

**⚠️ Warning:** Cascade delete có thể mất data quan trọng!

---

### 3. Archive Instead of Delete

**Thêm status ARCHIVED:**
```typescript
enum TourStatus {
  DRAFT
  PUBLISHED
  ARCHIVED  // ← Add this
}
```

**UI:**
```tsx
<Button onClick={() => archiveTour(tour.id)}>
  Archive
</Button>
```

**Backend:**
```typescript
await prisma.tour.update({
  where: { id: tourId },
  data: { status: 'ARCHIVED' }
})
```

---

## 🔧 Future Improvements

### 1. Bulk Delete with Confirmation

```tsx
<Button onClick={() => {
  if (confirm(`Xóa tour và ${totalRelated} records liên quan?`)) {
    cascadeDelete(tourId)
  }
}}>
  Force Delete (Cascade)
</Button>
```

### 2. Move to Another Tour

```tsx
<Button onClick={() => moveBookingsToAnotherTour(fromTourId, toTourId)}>
  Move Bookings to Another Tour
</Button>
```

### 3. Export Before Delete

```tsx
<Button onClick={() => {
  exportTourData(tourId)  // Export to JSON/CSV
  deleteTour(tourId)
}}>
  Export & Delete
</Button>
```

---

## 📊 Error Response Structure

### Backend Response (409 Conflict)

```json
{
  "error": "Cannot delete tour that has related records.",
  "details": {
    "bookings": 2,
    "departures": 3,
    "reviews": 1,
    "total": 6
  },
  "suggestion": "Please delete all related bookings, departures, and reviews first, or archive the tour instead."
}
```

### Frontend Handling

```typescript
if (response.status === 409 && body?.details) {
  // Show detailed message with counts
  // Suggest solutions
  // Log for debugging
}
```

---

## ✅ Status

**FIXED** ✅

- Đã thêm check related records
- Đã thêm detailed error message
- Đã thêm suggestions
- Đã thêm console logging

**Nút xóa vẫn có, nhưng có thông báo rõ ràng khi không xóa được!** 🎯

---

## 📝 Files Changed

1. **`/conphung/app/api/tours/[tourId]/route.ts`**
   - Thêm check related records
   - Trả về detailed counts

2. **`/conphung/app/admin/tours/page.tsx`**
   - Cải thiện error handling
   - Hiển thị detailed message
   - Thêm console logging

---

**Nhớ:** Đây KHÔNG phải bug, mà là data protection! 🛡️
