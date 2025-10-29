# ✅ Server đã restart - Test Delete ngay!

## 🚀 Server Status

```
✅ Frontend: http://localhost:3000
✅ Backend:  http://localhost:4000
✅ Database: Running
```

**Code mới đã được load!**

---

## 🧪 Test ngay bây giờ

### Test 1: Tour Force Delete

1. **Mở browser:**
   ```
   http://localhost:3000/admin/tours
   ```

2. **Login** (nếu chưa)

3. **Click "Delete"** trên tour có bookings

4. **Dialog 1:** "Bạn có chắc muốn xóa tour?"
   → Click **OK**

5. **Dialog 2:** Hiển thị:
   ```
   Cannot delete tour that has related records.
   
   📊 Dữ liệu liên quan:
   • 1 booking(s)
   • 1 departure(s)
   • 5 review(s)
   
   📝 Tổng: 7 record(s)
   
   💡 Bạn có muốn XÓA TOÀN BỘ (tour + tất cả dữ liệu liên quan)?
   ```
   → Click **OK**

6. **Dialog 3:** 
   ```
   ⚠️ CẢNH BÁO: Hành động này KHÔNG THỂ HOÀN TÁC!
   ```
   → Click **OK**

7. **Expected:**
   ```
   ✅ Đã xóa tour và 1 bookings, 1 departures, 5 reviews!
   ```

8. **Verify:**
   - Tour biến mất khỏi list
   - Console: `✅ Force deleted tour ... and 7 related records`

---

### Test 2: Booking Delete

1. **Mở:**
   ```
   http://localhost:3000/admin/bookings
   ```

2. **Click "Xem"** trên booking bất kỳ

3. **Click "🗑️ Xóa booking"** (nút đỏ bên trái)

4. **Confirm dialog:**
   ```
   Bạn có chắc muốn xóa booking BK-XXX?
   
   Khách hàng: ...
   Tour: ...
   
   ⚠️ Hành động này KHÔNG THỂ HOÀN TÁC!
   ```
   → Click **OK**

5. **Expected:**
   ```
   ✅ Đã xóa booking BK-XXX thành công!
   ```

6. **Verify:**
   - Booking biến mất khỏi list
   - Dialog đóng
   - Console: `✅ Deleted booking: BK-XXX`

---

## 🔍 Check Console Logs

### Mở DevTools (F12)

**Khi Force Delete Tour, should see:**
```
🎯 Tour Form - Selecting promotion: ...
DELETE /api/tours/:id 409
❌ Delete error: {...}
⚠️ Cannot delete tour: {...}
DELETE /api/tours/:id?force=true 200  ← Should be 200 now!
✅ Đã xóa tour và ...
```

**Khi Delete Booking, should see:**
```
DELETE /api/bookings/:id 200  ← Should be 200 now!
✅ Deleted booking: BK-XXX
```

---

## ❌ Nếu vẫn lỗi

### Check 1: Clear Browser Cache
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### Check 2: Hard Refresh
```
F12 → Network tab → Disable cache → Reload
```

### Check 3: Check Server Logs
```bash
# Backend logs
tail -f dev.log

# Frontend logs  
tail -f dev-frontend.log
```

**Should see:**
```
🗑️ Force deleting tour ... with 7 related records
✅ Force deleted tour ... and 7 related records
```

### Check 4: Verify Code Changes
```bash
# Check tour API
grep -A 5 "Force delete:" conphung/app/api/tours/[tourId]/route.ts

# Check booking API
grep -A 5 "Delete booking and related" conphung/app/api/bookings/[id]/route.ts
```

---

## 🎯 Expected Results

### Tour Force Delete
- ✅ Status: 200 OK
- ✅ Message: "Deleted tour and X related records"
- ✅ Response includes deleted counts
- ✅ All records removed from database

### Booking Delete
- ✅ Status: 200 OK
- ✅ Message: "Đã xóa booking BK-XXX"
- ✅ Booking removed from list
- ✅ Related records (addons, payments) also deleted

---

## 📊 What Changed

### Backend Fixes

1. **Tour Force Delete** - Correct cascade order:
   ```
   BookingAddon → Payment → Booking → 
   Departures → Reviews → Addons → Media → 
   Itinerary → Tour
   ```

2. **Booking Delete** - Delete children first:
   ```
   BookingAddon → Payment → Booking
   ```

### Why It Works Now

**Before:**
```typescript
// ❌ Failed: Tried to delete parent with children
await prisma.booking.delete(...)
```

**After:**
```typescript
// ✅ Success: Delete children first
await prisma.$transaction([
  prisma.bookingAddon.deleteMany(...),
  prisma.payment.deleteMany(...),
  prisma.booking.delete(...),
])
```

---

## 🚀 Quick Test Commands

### Test Tour Delete
```
1. Open: http://localhost:3000/admin/tours
2. Delete tour with bookings
3. Confirm 3 times
4. Should work!
```

### Test Booking Delete
```
1. Open: http://localhost:3000/admin/bookings
2. View booking
3. Click "Xóa booking"
4. Confirm
5. Should work!
```

---

## ✅ Success Indicators

### Tour Force Delete Success
- ✅ No 409 error
- ✅ No 500 error
- ✅ Alert shows success message
- ✅ Tour removed from list
- ✅ Console shows "Force deleted"

### Booking Delete Success
- ✅ No 500 error
- ✅ Alert shows "Đã xóa booking"
- ✅ Booking removed from list
- ✅ Dialog closes
- ✅ Console shows "Deleted booking"

---

## 📚 Documentation

- **`CASCADE-DELETE-FIX.md`** - Technical details
- **`HOW-TO-DELETE-TOUR.md`** - User guide
- **`FORCE-DELETE-COMPLETE.md`** - Feature docs
- **`BOOKING-DELETE-COMPLETE.md`** - Booking delete

---

**Server is ready! Test now!** 🚀
