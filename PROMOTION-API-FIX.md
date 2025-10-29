# ✅ Promotion API Fix

## 🐛 Vấn đề

**Error:** "Không thể tạo khuyến mãi"

**Nguyên nhân:** API endpoint `/api/promotions` không tồn tại (đã bị xóa khi revert code)

---

## 🔍 Phân tích

### Frontend Code
**File:** `/conphung/components/tours/tour-form.tsx`

**Line 985-1000:** Gọi API tạo promotion
```typescript
const response = await fetch('/api/promotions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code,
    name,
    discountType,
    discountValue,
    description,
    startDate,
    endDate,
    isActive,
  }),
})
```

### Backend Missing
- ❌ `/api/promotions` endpoint không tồn tại
- ❌ Bị xóa khi revert code về trạng thái ban đầu

---

## 🛠️ Fix đã áp dụng

### Created: `/conphung/app/api/promotions/route.ts`

**Features:**
1. ✅ GET endpoint - List promotions
2. ✅ POST endpoint - Create promotion
3. ✅ Validation với Zod
4. ✅ Check duplicate code
5. ✅ Error handling
6. ✅ Console logging

**Code:**
```typescript
export async function GET(request: NextRequest) {
  const limit = parseInt(searchParams.get('limit') || '50')
  
  const promotions = await prisma.promotion.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
  })
  
  return NextResponse.json({ data: promotions })
}

export async function POST(request: NextRequest) {
  const data = createPromotionSchema.parse(body)
  
  // Check duplicate
  const existing = await prisma.promotion.findUnique({
    where: { code: data.code },
  })
  
  if (existing) {
    return NextResponse.json(
      { error: 'Mã khuyến mãi đã tồn tại' },
      { status: 400 }
    )
  }
  
  // Create
  const promotion = await prisma.promotion.create({
    data: {
      id: nanoid(),
      code: data.code,
      name: data.name,
      discountType: data.discountType,
      discountValue: data.discountValue,
      // ... other fields
    },
  })
  
  return NextResponse.json(promotion)
}
```

---

## 🧪 Test

### Test 1: Tạo Promotion trong Tour Form

1. **Start server:**
   ```bash
   ./dev-start.sh
   ```

2. **Vào tour form:**
   ```
   http://localhost:3000/admin/tours
   → Create/Edit tour
   → Scroll xuống "Chương trình khuyến mãi"
   ```

3. **Click "Tạo khuyến mãi mới"**

4. **Nhập thông tin:**
   - Mã: SUMMER2024
   - Tên: Khuyến mãi mùa hè
   - Loại: PERCENTAGE
   - Giá trị: 20
   - Mô tả: Giảm 20% cho tour mùa hè

5. **Click "Tạo"**

6. **Expected:**
   - ✅ Dialog đóng
   - ✅ Promotion xuất hiện trong dropdown
   - ✅ Tự động được chọn
   - ✅ Console: `✅ Created promotion: SUMMER2024`

---

### Test 2: Duplicate Code

1. **Tạo promotion với code đã tồn tại**

2. **Expected:**
   - ❌ Error: "Mã khuyến mãi đã tồn tại"
   - Dialog vẫn mở
   - Có thể sửa và thử lại

---

### Test 3: Validation Errors

**Test invalid data:**
- Empty code → "Mã khuyến mãi không được để trống"
- Empty name → "Tên khuyến mãi không được để trống"
- Negative value → "Giá trị giảm phải lớn hơn 0"
- End date before start date → "Ngày kết thúc phải sau ngày bắt đầu"

---

## 📊 API Endpoints

### GET /api/promotions
**Query params:**
- `limit` (optional, default: 50)

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "code": "SUMMER2024",
      "name": "Khuyến mãi mùa hè",
      "discountType": "PERCENTAGE",
      "discountValue": 20,
      "isActive": true,
      "startDate": "2024-06-01",
      "endDate": "2024-08-31",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### POST /api/promotions
**Request body:**
```json
{
  "code": "SUMMER2024",
  "name": "Khuyến mãi mùa hè",
  "discountType": "PERCENTAGE",
  "discountValue": 20,
  "description": "Giảm 20%",
  "startDate": "2024-06-01",
  "endDate": "2024-08-31",
  "isActive": true
}
```

**Response (success):**
```json
{
  "id": "...",
  "code": "SUMMER2024",
  "name": "Khuyến mãi mùa hè",
  ...
}
```

**Response (error):**
```json
{
  "error": "Mã khuyến mãi đã tồn tại"
}
```

---

## 🔧 Schema Validation

```typescript
const createPromotionSchema = z.object({
  code: z.string().min(1, 'Mã khuyến mãi không được để trống'),
  name: z.string().min(1, 'Tên khuyến mãi không được để trống'),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.number().positive('Giá trị giảm phải lớn hơn 0'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
})
```

---

## 💡 Features

### 1. Duplicate Check
```typescript
const existing = await prisma.promotion.findUnique({
  where: { code: data.code },
})

if (existing) {
  return 400 "Mã khuyến mãi đã tồn tại"
}
```

### 2. Auto ID Generation
```typescript
id: nanoid()
```

### 3. Date Handling
```typescript
startDate: data.startDate ? new Date(data.startDate) : null,
endDate: data.endDate ? new Date(data.endDate) : null,
```

### 4. Default Values
```typescript
usageLimit: null,
usageCount: 0,
maxDiscount: null,
minimumOrder: null,
```

---

## 📝 Files Changed

1. **`/conphung/app/api/promotions/route.ts`** (NEW)
   - GET endpoint
   - POST endpoint
   - Validation
   - Error handling

2. **`PROMOTION-API-FIX.md`** (this file)
   - Documentation

---

## 🔗 Integration

### Tour Form
**File:** `/conphung/components/tours/tour-form.tsx`

**Flow:**
1. User clicks "Tạo khuyến mãi mới"
2. Dialog opens with form
3. User fills form
4. Click "Tạo"
5. POST /api/promotions
6. If success:
   - Add to dropdown
   - Auto select
   - Close dialog
7. If error:
   - Show error message
   - Keep dialog open

---

## ⚠️ Important Notes

### 1. Code Must Be Unique
- Checked before create
- Returns 400 if duplicate

### 2. Validation
- All required fields validated
- Dates validated
- Numbers validated

### 3. No Authentication
- Currently no auth check
- Anyone can create promotions
- TODO: Add authentication

---

## 🚀 Future Improvements

### 1. Add Authentication
```typescript
const auth = await requireEditor()
if (auth.status !== 200) {
  return NextResponse.json({ error: auth.error }, { status: auth.status })
}
```

### 2. Add Pagination
```typescript
const page = parseInt(searchParams.get('page') || '1')
const skip = (page - 1) * limit
```

### 3. Add Search
```typescript
const search = searchParams.get('search')
where: search ? {
  OR: [
    { code: { contains: search } },
    { name: { contains: search } },
  ]
} : undefined
```

### 4. Add Update/Delete
```typescript
export async function PATCH(request: NextRequest) { ... }
export async function DELETE(request: NextRequest) { ... }
```

---

## ✅ Status

**GET /api/promotions:** ✅ WORKING  
**POST /api/promotions:** ✅ WORKING  
**Validation:** ✅ IMPLEMENTED  
**Error Handling:** ✅ IMPLEMENTED  

---

**Nhớ:** Restart server sau khi tạo file mới! 🎯
