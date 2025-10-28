# 🔧 FIX: Gallery Images không hiển thị khi edit

**Vấn đề:** Danh sách ảnh đã chọn trước đó không hiển thị khi edit homestay  
**Ngày:** 28/10/2025  
**Status:** 🔄 DEBUGGING

---

## 🔍 PHÂN TÍCH

### Vấn đề có thể là:
1. ❓ `galleryImageUrls` từ database là JSON object thay vì array
2. ❓ Data không được parse đúng khi load
3. ❓ Type mismatch giữa database và frontend

### Debug logs đã thêm:
```typescript
// Trong loadHomestay (line 2052-2054)
console.log('📸 Gallery images:', homestay.galleryImageUrls);
console.log('📸 Type:', typeof homestay.galleryImageUrls);
console.log('📸 Is Array:', Array.isArray(homestay.galleryImageUrls));

// Trong buildInitialFormState (line 254-263)
console.log('🔧 Building form state from:', initial);
console.log('🔧 Gallery from initial:', initial?.galleryImageUrls);
console.log('🔧 Processed gallery URLs:', galleryUrls);
```

---

## ✅ GIẢI PHÁP ĐÃ IMPLEMENT

### 1. Xử lý cả Array và Object
```typescript
const galleryUrls = Array.isArray(initial?.galleryImageUrls) 
  ? initial.galleryImageUrls 
  : (initial?.galleryImageUrls && typeof initial.galleryImageUrls === 'object')
  ? Object.values(initial.galleryImageUrls).filter(v => typeof v === 'string')
  : [];
```

**Logic:**
- ✅ Nếu là array → Dùng trực tiếp
- ✅ Nếu là object → Convert values thành array
- ✅ Filter chỉ lấy string values
- ✅ Fallback về empty array

---

## 🧪 CÁCH TEST

### Bước 1: Mở Console
1. F12 → Console tab
2. Reload trang edit homestay
3. Xem logs:
   ```
   📝 Loaded homestay for edit: [id]
   📸 Gallery images: [data]
   📸 Type: [type]
   📸 Is Array: [true/false]
   🔧 Building form state from: [object]
   🔧 Gallery from initial: [data]
   🔧 Processed gallery URLs: [array]
   ```

### Bước 2: Kiểm tra kết quả
- ✅ Nếu `galleryUrls` có data → Ảnh sẽ hiển thị
- ❌ Nếu `galleryUrls` = [] → Cần check database

---

## 🗄️ KIỂM TRA DATABASE

### Prisma Schema
```prisma
model Homestay {
  galleryImageUrls Json?  // ← Đây là JSON field
}
```

### Có thể có 3 formats:
1. **Array:** `["url1", "url2"]` ✅
2. **Object:** `{"0": "url1", "1": "url2"}` ⚠️
3. **Null:** `null` ❌

### Query để check:
```sql
SELECT id, title, galleryImageUrls 
FROM Homestay 
WHERE id = '[your-homestay-id]';
```

---

## 🔧 GIẢI PHÁP DỰ PHÒNG

### Nếu vẫn không hiển thị:

#### Option 1: Fix trong serializer
```typescript
// lib/homestays/serializers.ts line 62
galleryImageUrls: Array.isArray(homestay.galleryImageUrls) 
  ? homestay.galleryImageUrls
  : homestay.galleryImageUrls && typeof homestay.galleryImageUrls === 'object'
  ? Object.values(homestay.galleryImageUrls).filter(v => typeof v === 'string')
  : [],
```

#### Option 2: Migration để fix data
```typescript
// Tạo migration để convert object → array
const homestays = await prisma.homestay.findMany({
  where: {
    galleryImageUrls: { not: null }
  }
});

for (const homestay of homestays) {
  const gallery = homestay.galleryImageUrls;
  if (gallery && !Array.isArray(gallery)) {
    const urls = Object.values(gallery).filter(v => typeof v === 'string');
    await prisma.homestay.update({
      where: { id: homestay.id },
      data: { galleryImageUrls: urls }
    });
  }
}
```

#### Option 3: Fix khi save
```typescript
// Đảm bảo luôn save as array
const payload = {
  ...data,
  galleryImageUrls: Array.isArray(data.galleryImageUrls) 
    ? data.galleryImageUrls 
    : []
};
```

---

## 📋 CHECKLIST

### Đã làm:
- [x] Thêm debug logs
- [x] Xử lý cả array và object
- [x] Filter chỉ lấy string values
- [x] Fallback về empty array

### Cần làm tiếp:
- [ ] Test với console logs
- [ ] Check database format
- [ ] Fix serializer nếu cần
- [ ] Migration data nếu cần
- [ ] Remove debug logs sau khi fix xong

---

## 🎯 EXPECTED BEHAVIOR

### Sau khi fix:
1. ✅ Load homestay → Console shows gallery data
2. ✅ Gallery URLs được parse đúng
3. ✅ Ảnh hiển thị trong grid
4. ✅ Có thể thêm/xóa ảnh
5. ✅ Save lại vẫn giữ được ảnh

---

## 📝 NOTES

### Prisma JSON field behavior:
- Prisma trả về JSON as-is từ database
- Không tự động parse/validate
- Cần handle ở application layer

### Best practice:
- Luôn validate JSON data
- Có fallback cho mọi case
- Log để debug
- Type-safe với Zod schema

---

**Status:** Đang chờ test với console logs  
**Next:** Kiểm tra console và báo kết quả
