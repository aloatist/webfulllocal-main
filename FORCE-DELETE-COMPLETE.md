# ✅ Force Delete Feature - Complete

## 🎯 Đã implement

### 1. Tour Force Delete ✅

#### Backend API
**File:** `/conphung/app/api/tours/[tourId]/route.ts`

**Endpoint:** `DELETE /api/tours/:id?force=true`

**Logic:**
```typescript
// Normal delete: Check for related records
if (totalRelated > 0 && !forceDelete) {
  return 409 with details
}

// Force delete: Delete all in transaction
if (forceDelete && totalRelated > 0) {
  await prisma.$transaction([
    prisma.booking.deleteMany({ where: { tourId } }),
    prisma.tourDeparture.deleteMany({ where: { tourId } }),
    prisma.tourReview.deleteMany({ where: { tourId } }),
    prisma.tour.delete({ where: { id: tourId } }),
  ])
}
```

**Response:**
```json
{
  "success": true,
  "message": "Deleted tour and 7 related records",
  "deleted": {
    "bookings": 1,
    "departures": 1,
    "reviews": 5
  }
}
```

---

#### Frontend UI
**File:** `/conphung/app/admin/tours/page.tsx`

**Flow:**
1. User clicks "Delete" tour
2. If has related records → Show error with counts
3. Ask: "Bạn có muốn XÓA TOÀN BỘ?"
4. If Yes → Call DELETE with `?force=true`
5. Show success message with deleted counts

**Dialog:**
```
Cannot delete tour that has related records.

📊 Dữ liệu liên quan:
• 1 booking(s)
• 1 departure(s)
• 5 review(s)

📝 Tổng: 7 record(s)

💡 Bạn có muốn XÓA TOÀN BỘ (tour + tất cả dữ liệu liên quan)?

⚠️ CẢNH BÁO: Hành động này KHÔNG THỂ HOÀN TÁC!

[Cancel] [OK]
```

---

### 2. Booking Delete ✅

#### Backend API
**File:** `/conphung/app/api/bookings/[id]/route.ts`

**Endpoint:** `DELETE /api/bookings/:id`

**Logic:**
```typescript
// Check if exists
const booking = await prisma.booking.findUnique({ where: { id } })
if (!booking) return 404

// Delete
await prisma.booking.delete({ where: { id } })

return { success: true, message: `Đã xóa booking ${booking.reference}` }
```

---

#### Frontend UI
**Status:** ⏳ Cần thêm nút Delete trong `/admin/bookings/page.tsx`

**Cần implement:**
```tsx
const handleDeleteBooking = async (bookingId: string) => {
  const confirmed = window.confirm('Bạn có chắc muốn xóa booking này?')
  if (!confirmed) return

  try {
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Không thể xóa booking')
    }
    
    // Reload bookings list
    fetchBookings()
    alert('✅ Đã xóa booking thành công!')
  } catch (error) {
    alert('❌ ' + error.message)
  }
}
```

---

## 🧪 Test

### Test 1: Tour Force Delete

1. **Setup:**
   - Tour có 1 booking, 1 departure, 5 reviews

2. **Action:**
   ```
   /admin/tours → Click Delete
   ```

3. **Expected:**
   - Dialog 1: "Bạn có chắc muốn xóa tour?"
   - Dialog 2: Shows related records + "Bạn có muốn XÓA TOÀN BỘ?"
   - Dialog 3: "⚠️ CẢNH BÁO: Hành động này KHÔNG THỂ HOÀN TÁC!"
   - If OK → Deletes all
   - Alert: "✅ Đã xóa tour và 1 bookings, 1 departures, 5 reviews!"

4. **Verify:**
   - Tour deleted from list
   - Bookings deleted
   - Departures deleted
   - Reviews deleted

---

### Test 2: Booking Delete

1. **Setup:**
   - Booking exists in system

2. **Action:**
   ```
   /admin/bookings → Click Delete (cần thêm nút)
   ```

3. **Expected:**
   - Dialog: "Bạn có chắc muốn xóa booking này?"
   - If OK → Deletes booking
   - Alert: "✅ Đã xóa booking BK-XXX thành công!"

4. **Verify:**
   - Booking deleted from list
   - Database record removed

---

## 💡 UX Flow

### Scenario 1: Tour Without Related Records
```
Click Delete → Confirm → ✅ Deleted
```

### Scenario 2: Tour With Related Records (Cancel)
```
Click Delete → Confirm → Error Dialog → Cancel → No action
```

### Scenario 3: Tour With Related Records (Force Delete)
```
Click Delete → Confirm → Error Dialog → 
"Bạn có muốn XÓA TOÀN BỘ?" → Yes → 
"⚠️ CẢNH BÁO" → Yes → ✅ All deleted
```

---

## 🔒 Safety Features

### 1. Double Confirmation
- First: Confirm delete tour
- Second: Confirm force delete with warning

### 2. Clear Warning
```
⚠️ CẢNH BÁO: Hành động này KHÔNG THỂ HOÀN TÁC!
```

### 3. Transaction
```typescript
await prisma.$transaction([...])
// All or nothing - no partial deletes
```

### 4. Logging
```typescript
console.log(`🗑️ Force deleting tour ${tourId} with ${totalRelated} related records`)
console.log(`✅ Force deleted tour ${tourId} and ${totalRelated} related records`)
```

---

## 📊 API Summary

| Endpoint | Method | Query Params | Description |
|----------|--------|--------------|-------------|
| `/api/tours/:id` | DELETE | - | Normal delete (fails if has related) |
| `/api/tours/:id?force=true` | DELETE | `force=true` | Force delete (cascade) |
| `/api/bookings/:id` | DELETE | - | Delete booking |

---

## 🚀 Next Steps

### 1. Add Delete Button in Bookings Page
**File:** `/conphung/app/admin/bookings/page.tsx`

**Add:**
```tsx
<Button
  variant="destructive"
  size="sm"
  onClick={() => handleDeleteBooking(booking.id)}
>
  <Trash2 className="h-4 w-4" />
  Xóa
</Button>
```

### 2. Add Delete Button in Homestay Bookings
**File:** `/conphung/app/admin/homestay-bookings/page.tsx`

Similar implementation

### 3. Add Bulk Delete (Optional)
```tsx
<Button onClick={() => bulkDelete(selectedIds)}>
  Delete Selected ({selectedIds.length})
</Button>
```

---

## ⚠️ Important Notes

### 1. Không thể Undo
- Force delete là permanent
- Không có soft delete
- Không có recycle bin

### 2. Data Loss
- Bookings → Mất thông tin khách hàng
- Reviews → Mất feedback
- Departures → Mất lịch trình

### 3. Khuyến nghị
- **Archive thay vì Delete** (đổi status)
- **Export data trước khi xóa**
- **Backup database thường xuyên**

---

## 📝 Files Changed

1. **`/conphung/app/api/tours/[tourId]/route.ts`**
   - Thêm force delete logic
   - Transaction để xóa all related

2. **`/conphung/app/admin/tours/page.tsx`**
   - Thêm force delete confirmation
   - Recursive call với force=true

3. **`/conphung/app/api/bookings/[id]/route.ts`**
   - Thêm DELETE endpoint

4. **`FORCE-DELETE-COMPLETE.md`** (this file)
   - Documentation

---

## ✅ Status

**Tour Force Delete:** ✅ COMPLETE  
**Booking Delete API:** ✅ COMPLETE  
**Booking Delete UI:** ⏳ TODO (cần thêm nút)

---

**Cảnh báo:** Sử dụng Force Delete cẩn thận! Không thể hoàn tác! ⚠️
