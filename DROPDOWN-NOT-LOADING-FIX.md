# 🐛 Dropdown không load được - Debug & Fix

## ❌ Vấn đề

**Ảnh 1 & 2:** Hai dropdown trống không có data:
1. **"Danh mục tour"** - "Chọn danh mục liên quan" 
2. **"Chương trình khuyến mãi"** - "Chọn khuyến mãi từ thư viện"

---

## 🔍 Nguyên nhân có thể

### 1. Server chưa restart
- Promotions API vừa tạo mới
- Code chưa được reload

### 2. API Error
- Categories API có lỗi
- Promotions API có lỗi
- Network error

### 3. CORS hoặc Auth
- API bị block
- Cần authentication

---

## 🛠️ Cách Fix

### Bước 1: Restart Server (Quan trọng!)

```bash
# Stop server
./dev-stop.sh

# Start lại
./dev-start.sh
```

**Lý do:** Promotions API vừa tạo, cần restart để load code mới

---

### Bước 2: Check Browser Console

1. **Mở DevTools** (F12)

2. **Vào tab Console**

3. **Tìm errors:**
   ```
   Failed to fetch /api/categories
   Failed to fetch /api/promotions
   ```

4. **Vào tab Network**
   - Filter: XHR
   - Tìm requests:
     - `/api/categories?limit=100`
     - `/api/promotions?limit=100`
   - Check status code:
     - 200 = OK
     - 404 = Not found
     - 500 = Server error

---

### Bước 3: Test API Trực tiếp

**Test Categories:**
```bash
curl http://localhost:3000/api/categories?limit=100
```

**Expected:**
```json
{
  "data": [
    {
      "id": "...",
      "name": "Tour miền Bắc",
      "slug": "tour-mien-bac",
      ...
    }
  ],
  "pagination": {...}
}
```

**Test Promotions:**
```bash
curl http://localhost:3000/api/promotions?limit=100
```

**Expected:**
```json
{
  "data": [
    {
      "id": "...",
      "code": "SUMMER2024",
      "name": "Khuyến mãi mùa hè",
      ...
    }
  ]
}
```

---

### Bước 4: Check Server Logs

```bash
# Backend logs
tail -f dev.log

# Frontend logs
tail -f dev-frontend.log
```

**Tìm errors:**
```
Error loading categories
Error loading promotions
Failed to fetch
```

---

## 🔧 Quick Fixes

### Fix 1: Restart Server (90% cases)

```bash
./dev-stop.sh
./dev-start.sh
```

**Sau đó:**
1. Refresh browser (Ctrl+Shift+R)
2. Vào tour form
3. Check dropdowns

---

### Fix 2: Clear Browser Cache

```
1. F12 → Network tab
2. Check "Disable cache"
3. Refresh page (Ctrl+Shift+R)
```

---

### Fix 3: Check API Endpoints Exist

**Categories API:**
```bash
ls -la conphung/app/api/categories/route.ts
# Should exist
```

**Promotions API:**
```bash
ls -la conphung/app/api/promotions/route.ts
# Should exist (vừa tạo)
```

---

### Fix 4: Add Console Logs

**File:** `/conphung/components/tours/tour-form.tsx`

**Thêm logs để debug:**

```typescript
const loadCategories = async () => {
  console.log('🔄 Loading categories...')
  setCategoryLoading(true)
  
  try {
    const response = await fetch('/api/categories?limit=100')
    console.log('📦 Categories response:', response.status)
    
    if (!response.ok) {
      throw new Error('Failed to load categories')
    }
    
    const data = await response.json()
    console.log('✅ Categories loaded:', data.data?.length)
    
    // ... rest of code
  } catch (error) {
    console.error('❌ Categories error:', error)
  }
}
```

---

## 🧪 Test Plan

### Test 1: Check APIs

```bash
# Test categories
curl http://localhost:3000/api/categories?limit=100

# Test promotions
curl http://localhost:3000/api/promotions?limit=100
```

**Both should return 200 OK with data**

---

### Test 2: Check Browser

1. Vào http://localhost:3000/admin/tours
2. Click "Create Tour" hoặc "Edit"
3. Scroll xuống "Danh mục tour"
4. Open dropdown
5. ✅ Should see categories

6. Scroll xuống "Chương trình khuyến mãi"
7. Open dropdown
8. ✅ Should see promotions

---

### Test 3: Check Console

**Should see:**
```
🔄 Loading categories...
📦 Categories response: 200
✅ Categories loaded: 5

🔄 Loading promotions...
📦 Promotions response: 200
✅ Promotions loaded: 3
```

**Should NOT see:**
```
❌ Categories error: ...
❌ Promotions error: ...
Failed to fetch
```

---

## 📊 Troubleshooting

### Issue 1: 404 Not Found

**Categories 404:**
```
Check: /conphung/app/api/categories/route.ts exists
```

**Promotions 404:**
```
Check: /conphung/app/api/promotions/route.ts exists
Solution: Đã tạo file này rồi, cần restart server
```

---

### Issue 2: 500 Server Error

**Check server logs:**
```bash
tail -f dev.log
```

**Common errors:**
- Database connection
- Prisma error
- Missing fields

---

### Issue 3: Empty Array

**Response OK but data empty:**
```json
{
  "data": []
}
```

**Solution:**
1. Check database có data không
2. Tạo categories/promotions mới
3. Verify query đúng

---

### Issue 4: CORS Error

**Error:**
```
Access to fetch blocked by CORS policy
```

**Solution:**
- Không nên xảy ra (same origin)
- Check Next.js config

---

## 💡 Common Solutions

### Solution 1: Restart Everything

```bash
# Kill all
./dev-stop.sh

# Clear cache
rm -rf .next
rm -rf node_modules/.cache

# Restart
./dev-start.sh
```

---

### Solution 2: Create Test Data

**Create Categories:**
```sql
INSERT INTO "Category" (id, name, slug, "createdAt", "updatedAt")
VALUES 
  ('cat1', 'Tour miền Bắc', 'tour-mien-bac', NOW(), NOW()),
  ('cat2', 'Tour miền Nam', 'tour-mien-nam', NOW(), NOW());
```

**Create Promotions:**
```sql
INSERT INTO "Promotion" (id, code, name, "discountType", "discountValue", "isActive", "usageCount", "createdAt", "updatedAt")
VALUES 
  ('promo1', 'SUMMER2024', 'Khuyến mãi hè', 'PERCENTAGE', 20, true, 0, NOW(), NOW());
```

---

### Solution 3: Check Prisma Schema

**Verify models exist:**
```prisma
model Category {
  id        String   @id
  name      String
  slug      String   @unique
  // ...
}

model Promotion {
  id            String       @id
  code          String       @unique
  name          String
  discountType  DiscountType
  // ...
}
```

---

## ✅ Checklist

- [ ] Server đã restart
- [ ] Browser cache đã clear
- [ ] Categories API returns 200
- [ ] Promotions API returns 200
- [ ] Categories có data
- [ ] Promotions có data
- [ ] Console không có errors
- [ ] Dropdowns hiển thị data

---

## 🎯 Quick Fix (Most Likely)

**90% trường hợp chỉ cần:**

```bash
# 1. Restart server
./dev-stop.sh
./dev-start.sh

# 2. Refresh browser
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)

# 3. Test
Vào /admin/tours → Create/Edit → Check dropdowns
```

---

## 📝 Files to Check

1. `/conphung/app/api/categories/route.ts` - ✅ Exists
2. `/conphung/app/api/promotions/route.ts` - ✅ Just created
3. `/conphung/components/tours/tour-form.tsx` - ✅ Has fetch code

---

**Status:** ⏳ PENDING - Cần restart server và test!
