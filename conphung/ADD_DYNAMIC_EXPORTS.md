# 🔧 Thêm Dynamic Exports Vào API Routes

Cần thêm `export const dynamic = 'force-dynamic';` vào các files sau:

## ✅ Đã Thêm
1. ✅ `app/api/payment/vnpay/callback/route.ts`
2. ✅ `app/api/bookings/route.ts`
3. ✅ `app/api/settings/route.ts`
4. ✅ `app/api/homestays/[homestayId]/rooms/route.ts`

## 🔴 Cần Thêm (8 files)

### 1. app/api/homestays/route.ts
```typescript
// Thêm sau imports, trước export async function GET
export const dynamic = 'force-dynamic';
```

### 2. app/api/media/route.ts
```typescript
// Thêm sau imports
export const dynamic = 'force-dynamic';
```

### 3. app/api/posts/route.ts
```typescript
// Thêm sau imports
export const dynamic = 'force-dynamic';
```

### 4. app/api/promotions/route.ts
```typescript
// Thêm sau imports
export const dynamic = 'force-dynamic';
```

### 5. app/api/public/tours/route.ts
```typescript
// Thêm sau imports
export const dynamic = 'force-dynamic';
```

### 6. app/api/categories/route.ts
```typescript
// Thêm sau imports (đã có rồi từ trước)
export const dynamic = 'force-dynamic';
```

### 7. app/api/tags/route.ts
```typescript
// Thêm sau imports (đã có rồi từ trước)
export const dynamic = 'force-dynamic';
```

### 8. app/api/tours/route.ts
```typescript
// Thêm sau imports (đã có rồi từ trước)
export const dynamic = 'force-dynamic';
```

## 📝 Lý Do

Next.js 14+ cố gắng static render tất cả routes mặc định. Khi route sử dụng:
- `request.nextUrl.searchParams`
- `cookies()`
- `headers()`
- Dynamic data

Cần thêm `export const dynamic = 'force-dynamic'` để force dynamic rendering.

## 🚀 Cách Thêm Nhanh

Chạy lệnh sau cho mỗi file:

```bash
# Template
FILE="app/api/PATH/route.ts"
LINE_NUM=$(grep -n "^export async function GET" "$FILE" | head -1 | cut -d: -f1)
sed -i '' "${LINE_NUM}i\\
export const dynamic = 'force-dynamic';\\
\\
" "$FILE"
```
