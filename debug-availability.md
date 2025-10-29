# 🐛 Debug: Availability Không Lưu Vào DB

## Bước 1: Check Browser Console

### Mở DevTools (F12) → Console tab

Khi bạn click "Lưu" hoặc "Xuất bản", tìm log:

```javascript
// Should see:
console.log('Payload:', payload);

// Check if availabilityBlocks is in payload:
{
  "title": "...",
  "availabilityBlocks": [
    {
      "startDate": "2025-11-01",
      "endDate": "2025-11-05",
      "notes": "Test"
    }
  ]
}
```

### ❌ Nếu KHÔNG thấy availabilityBlocks:
→ Frontend không gửi data
→ Check: Có add block vào list chưa?

### ✅ Nếu CÓ availabilityBlocks:
→ Frontend OK, vấn đề ở backend
→ Tiếp tục Bước 2

---

## Bước 2: Check Network Tab

### DevTools → Network tab

1. Click "Lưu" hoặc "Xuất bản"
2. Tìm request: `PUT /api/homestays/[id]` hoặc `POST /api/homestays`
3. Click vào request
4. Tab "Payload" → Check có `availabilityBlocks` không?

### ❌ Nếu KHÔNG có:
→ Frontend không gửi
→ Bug ở line 903-910 trong page.tsx

### ✅ Nếu CÓ:
→ Frontend gửi OK
→ Tiếp tục Bước 3

---

## Bước 3: Check Server Logs

### Terminal nơi chạy `npm run dev`

Tìm logs khi save:

```
Processing availability blocks
Created X availability records
```

### ❌ Nếu KHÔNG thấy logs:
→ Backend không xử lý
→ Check: data.availabilityBlocks có được parse không?

### ✅ Nếu CÓ logs:
→ Backend đang xử lý
→ Tiếp tục Bước 4

---

## Bước 4: Check for Errors

### Terminal logs - tìm errors:

```
Error: Foreign key constraint violated
Error: Invalid date format
Error: Room not found
```

### Common Errors:

**1. Foreign Key Error:**
```
HomestayAvailability_roomId_fkey
```
→ Không có room
→ Code đã fix - nên tự tạo default room

**2. Date Format Error:**
```
Invalid date
```
→ Date format sai
→ Phải là: "YYYY-MM-DD"

**3. No Blocks in State:**
```
availabilityBlocks.length = 0
```
→ Không có blocks trong state
→ Check: Có click "Thêm" sau khi điền form không?

---

## Bước 5: Manual Test

### Test từng bước:

1. **Mở:** http://localhost:3000/admin/homestays/new
2. **Điền basic info**
3. **Scroll xuống "Lịch & chặn phòng"**
4. **Điền form:**
   - Start Date: 2025-11-01
   - End Date: 2025-11-05
   - Notes: "Test"
5. **QUAN TRỌNG: Click "Thêm" button**
6. **Check: Block xuất hiện trong list phía dưới?**
   - ✅ Nếu CÓ → State OK
   - ❌ Nếu KHÔNG → Bug ở handleAddAvailability
7. **Click "Xuất bản"**
8. **Check console logs**

---

## Bước 6: Direct Database Check

### Run SQL query:

```sql
-- Check if ANY availability exists
SELECT COUNT(*) FROM "HomestayAvailability";

-- If 0 → Nothing is being saved
-- If > 0 → Some data exists, check filters

-- Check for test homestay specifically
SELECT 
  ha.*,
  h.title,
  h.slug
FROM "HomestayAvailability" ha
JOIN "Homestay" h ON ha."homestayId" = h.id
WHERE h.slug LIKE '%test%'
ORDER BY ha.date;
```

---

## 🔧 Quick Fixes

### Fix 1: Check State

Add debug log to see state:

```typescript
// In handleSubmit, before building payload
console.log('availabilityBlocks state:', availabilityBlocks);
```

### Fix 2: Check Payload

Add debug log:

```typescript
// After building payload
console.log('Payload being sent:', JSON.stringify(payload, null, 2));
```

### Fix 3: Check Backend

Add log in API route:

```typescript
// In route.ts, after parsing data
console.log('Received availabilityBlocks:', data.availabilityBlocks);
```

---

## 🎯 Most Likely Issues:

### Issue 1: Không Click "Thêm"
**Symptom:** Form điền nhưng không thấy block trong list
**Fix:** Phải click "Thêm" sau khi điền form

### Issue 2: State Không Update
**Symptom:** Click "Thêm" nhưng list vẫn trống
**Fix:** Check handleAddAvailability function

### Issue 3: Payload Không Include
**Symptom:** Network tab không có availabilityBlocks
**Fix:** Check line 903-910 trong page.tsx

### Issue 4: Backend Không Process
**Symptom:** Payload có nhưng DB trống
**Fix:** Check API route có xử lý không

### Issue 5: Foreign Key Error
**Symptom:** Error trong server logs
**Fix:** Đã fix - tạo default room

---

## 📝 Test Checklist

- [ ] Mở form create/edit
- [ ] Điền availability form
- [ ] Click "Thêm" button
- [ ] Thấy block xuất hiện trong list
- [ ] Console log shows: availabilityBlocks: [...]
- [ ] Click "Lưu"/"Xuất bản"
- [ ] Network tab shows availabilityBlocks in payload
- [ ] Server logs show "Processing availability blocks"
- [ ] No errors in server logs
- [ ] Database has records in HomestayAvailability

---

## 🚨 Emergency Debug

### Add this to page.tsx temporarily:

```typescript
// Line ~905, after building payload
console.log('🔍 DEBUG PAYLOAD:', {
  hasAvailabilityBlocks: !!payload.availabilityBlocks,
  blockCount: payload.availabilityBlocks?.length || 0,
  blocks: payload.availabilityBlocks,
});
```

### Add this to API route:

```typescript
// In route.ts, line ~326
console.log('🔍 DEBUG API:', {
  hasBlocks: !!data.availabilityBlocks,
  blockCount: data.availabilityBlocks?.length || 0,
  blocks: data.availabilityBlocks,
});
```

Then test and check both logs!
