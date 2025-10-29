# ✅ Cascade Delete Fix - Foreign Key Constraints

## 🐛 Vấn đề

### Error 1: Tour Force Delete
```
DELETE /api/tours/:id?force=true 409 (Conflict)
Cannot delete tour that is referenced by other records
```

### Error 2: Booking Delete
```
DELETE /api/bookings/:id 500 (Internal Server Error)
Không thể xóa booking
```

**Nguyên nhân:** Foreign key constraints - Cần xóa child records trước parent

---

## 🔍 Database Schema

### Booking Relations
```prisma
model Booking {
  id           String
  BookingAddon BookingAddon[]  // ← Child
  Payment      Payment[]       // ← Child
}

model BookingAddon {
  bookingId String
  Booking   Booking @relation(...)  // ← Parent
}

model Payment {
  bookingId String
  Booking   Booking @relation(...)  // ← Parent
}
```

**Rule:** Phải xóa `BookingAddon` và `Payment` TRƯỚC khi xóa `Booking`

---

## 🛠️ Fix đã áp dụng

### Fix 1: Tour Force Delete

**File:** `/conphung/app/api/tours/[tourId]/route.ts`

**Trước:**
```typescript
await prisma.$transaction([
  prisma.booking.deleteMany({ where: { tourId } }),  // ❌ Fail: Has children
  prisma.tourDeparture.deleteMany({ where: { tourId } }),
  prisma.tourReview.deleteMany({ where: { tourId } }),
  prisma.tour.delete({ where: { id: tourId } }),
])
```

**Sau:**
```typescript
// Get all booking IDs first
const bookingIds = await prisma.booking.findMany({
  where: { tourId },
  select: { id: true },
})
const bookingIdList = bookingIds.map(b => b.id)

await prisma.$transaction([
  // 1. Delete children of Booking first
  prisma.bookingAddon.deleteMany({ 
    where: { bookingId: { in: bookingIdList } } 
  }),
  prisma.payment.deleteMany({ 
    where: { bookingId: { in: bookingIdList } } 
  }),
  
  // 2. Delete Booking
  prisma.booking.deleteMany({ where: { tourId } }),
  
  // 3. Delete other tour relations
  prisma.tourDeparture.deleteMany({ where: { tourId } }),
  prisma.tourReview.deleteMany({ where: { tourId } }),
  prisma.tourAddon.deleteMany({ where: { tourId } }),
  prisma.tourMedia.deleteMany({ where: { tourId } }),
  prisma.itineraryDay.deleteMany({ where: { tourId } }),
  
  // 4. Finally delete Tour
  prisma.tour.delete({ where: { id: tourId } }),
])
```

**Thứ tự xóa:**
```
1. BookingAddon (child of Booking)
2. Payment (child of Booking)
3. Booking
4. TourDeparture
5. TourReview
6. TourAddon
7. TourMedia
8. ItineraryDay
9. Tour
```

---

### Fix 2: Booking Delete

**File:** `/conphung/app/api/bookings/[id]/route.ts`

**Trước:**
```typescript
await prisma.booking.delete({ where: { id } })  // ❌ Fail: Has children
```

**Sau:**
```typescript
await prisma.$transaction([
  // 1. Delete children first
  prisma.bookingAddon.deleteMany({ where: { bookingId: id } }),
  prisma.payment.deleteMany({ where: { bookingId: id } }),
  
  // 2. Delete parent
  prisma.booking.delete({ where: { id } }),
])
```

**Thứ tự xóa:**
```
1. BookingAddon (child)
2. Payment (child)
3. Booking (parent)
```

---

## 🧪 Test

### Test 1: Tour Force Delete

1. **Setup:**
   - Tour có 1 booking với addons và payments

2. **Action:**
   ```bash
   ./dev-start.sh
   ```
   ```
   /admin/tours → Delete → OK (3 times)
   ```

3. **Expected:**
   - ✅ Xóa thành công
   - Console: `✅ Force deleted tour ... and 7 related records`
   - Alert: Success message

4. **Verify:**
   - Tour deleted
   - Bookings deleted
   - BookingAddons deleted
   - Payments deleted
   - All related records deleted

---

### Test 2: Booking Delete

1. **Setup:**
   - Booking có addons và payments

2. **Action:**
   ```
   /admin/bookings → Xem → Xóa booking → Confirm
   ```

3. **Expected:**
   - ✅ Xóa thành công
   - Alert: "✅ Đã xóa booking BK-XXX thành công!"

4. **Verify:**
   - Booking deleted
   - BookingAddons deleted
   - Payments deleted

---

## 📊 Cascade Delete Order

### General Rule
```
Children → Parent → Grandparent
```

### Tour Hierarchy
```
Tour
├── Booking
│   ├── BookingAddon  ← Delete 1st
│   └── Payment       ← Delete 2nd
├── TourDeparture
├── TourReview
├── TourAddon
├── TourMedia
└── ItineraryDay
```

### Delete Order
```
1. BookingAddon      (child of Booking)
2. Payment           (child of Booking)
3. Booking           (child of Tour)
4. TourDeparture     (child of Tour)
5. TourReview        (child of Tour)
6. TourAddon         (child of Tour)
7. TourMedia         (child of Tour)
8. ItineraryDay      (child of Tour)
9. Tour              (root)
```

---

## 💡 Why This Matters

### Foreign Key Constraints
```sql
-- Database enforces referential integrity
ALTER TABLE booking_addon 
  ADD CONSTRAINT fk_booking 
  FOREIGN KEY (booking_id) 
  REFERENCES booking(id);
```

**Effect:**
- Cannot delete `Booking` if `BookingAddon` exists
- Must delete children first

---

### Transaction Safety
```typescript
await prisma.$transaction([...])
```

**Benefits:**
- All or nothing
- No partial deletes
- Database consistency

---

## 🔧 Alternative: Cascade on Database Level

### Option 1: Prisma Schema
```prisma
model BookingAddon {
  bookingId String
  Booking   Booking @relation(
    fields: [bookingId], 
    references: [id], 
    onDelete: Cascade  // ← Auto cascade
  )
}
```

**Pros:**
- Database handles cascade
- Less code

**Cons:**
- Less control
- Harder to debug
- May delete unintentionally

---

### Option 2: Application Level (Current)
```typescript
// Explicit delete order
await prisma.bookingAddon.deleteMany(...)
await prisma.booking.delete(...)
```

**Pros:**
- Full control
- Clear logging
- Easy to debug

**Cons:**
- More code
- Must maintain order

**→ We chose Option 2 for better control**

---

## 📝 Files Changed

1. **`/conphung/app/api/tours/[tourId]/route.ts`**
   - Fixed force delete cascade order
   - Added all tour-related records

2. **`/conphung/app/api/bookings/[id]/route.ts`**
   - Fixed booking delete cascade order

3. **`CASCADE-DELETE-FIX.md`** (this file)
   - Documentation

---

## ⚠️ Important Notes

### 1. Order Matters
```typescript
// ❌ WRONG
await prisma.booking.delete(...)
await prisma.bookingAddon.deleteMany(...)  // Too late!

// ✅ RIGHT
await prisma.bookingAddon.deleteMany(...)
await prisma.booking.delete(...)
```

### 2. Use Transactions
```typescript
// ✅ All or nothing
await prisma.$transaction([...])

// ❌ Partial delete possible
await prisma.bookingAddon.deleteMany(...)
await prisma.booking.delete(...)  // May fail, leaving orphans
```

### 3. Get IDs First
```typescript
// ✅ Get IDs before transaction
const bookingIds = await prisma.booking.findMany(...)

await prisma.$transaction([
  prisma.bookingAddon.deleteMany({ 
    where: { bookingId: { in: bookingIds } } 
  }),
  ...
])
```

---

## 🚀 Testing Checklist

- [ ] Restart server: `./dev-start.sh`
- [ ] Clear browser cache: Ctrl+Shift+R
- [ ] Test tour force delete
- [ ] Test booking delete
- [ ] Check console logs
- [ ] Verify database records deleted

---

## ✅ Status

**Tour Force Delete:** ✅ FIXED  
**Booking Delete:** ✅ FIXED  
**Cascade Order:** ✅ CORRECT  
**Transaction Safety:** ✅ IMPLEMENTED  

---

**Nhớ:** Luôn xóa children trước parent! 🎯
