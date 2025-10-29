# Khắc phục Hiển Thị Đánh Giá và Phản Hồi Trên Trang Công Khai

## Vấn đề đã phát hiện

### 1. **TourReview vẫn dùng `isPublished` thay vì `status`**
- File: `/lib/tours/public.ts`
- Lọc reviews theo `isPublished: true` thay vì `status: 'APPROVED'`
- Không nhất quán với schema mới đã thêm trường `status`

### 2. **Trang tour không map `adminResponse`**
- File: `/app/tours/[slug]/page.tsx`
- Chỉ map: id, rating, comment, createdAt, User
- **Thiếu**: adminResponse, respondedAt
- Dẫn đến phản hồi không hiển thị

### 3. **ReviewCard chỉ hỗ trợ `hostResponse`**
- File: `/components/reviews/ReviewCard.tsx`
- Chỉ có interface cho `hostResponse` và `hostResponseAt`
- Không có interface cho `adminResponse` và `respondedAt` (của TourReview)
- Label cứng: "Phản hồi từ chủ nhà" - không phù hợp với tour

### 4. **Homestay đã đúng từ trước**
- ✅ Dùng `status: 'APPROVED'` đúng
- ✅ Map đầy đủ `hostResponse` và `hostResponseAt`
- ✅ ReviewsSection hoạt động tốt

## Giải pháp đã thực hiện

### 1. Sửa lib/tours/public.ts

**Trước:**
```typescript
TourReview: {
  where: { isPublished: true },  // ❌ Dùng isPublished
  orderBy: { createdAt: 'desc' as const },
  take: 10,
},
```

**Sau:**
```typescript
TourReview: {
  where: { status: 'APPROVED' },  // ✅ Dùng status
  orderBy: { createdAt: 'desc' as const },
  take: 10,
},
```

**Lý do:**
- Schema đã có trường `status` với enum PENDING/APPROVED/REJECTED
- `isPublished` chỉ là boolean, không phân biệt PENDING vs REJECTED
- Nhất quán với cách lọc trong admin và homestay

### 2. Sửa app/tours/[slug]/page.tsx

**Trước:**
```typescript
reviews={tour.TourReview?.map(review => ({
  id: review.id,
  rating: review.rating,
  comment: review.content,
  createdAt: review.createdAt,
  User: { name: review.fullName, image: null },
  // ❌ Thiếu adminResponse và respondedAt
})) || []}
```

**Sau:**
```typescript
reviews={tour.TourReview?.map(review => ({
  id: review.id,
  rating: review.rating,
  comment: review.content,
  createdAt: review.createdAt,
  adminResponse: review.adminResponse,      // ✅ Thêm
  respondedAt: review.respondedAt,          // ✅ Thêm
  User: { name: review.fullName, image: null },
})) || []}
```

### 3. Sửa components/reviews/ReviewCard.tsx

**Interface - Trước:**
```typescript
interface ReviewCardProps {
  review: {
    // ... other fields
    hostResponse?: string | null;
    hostResponseAt?: string | null;
    // ❌ Không có adminResponse
  };
}
```

**Interface - Sau:**
```typescript
interface ReviewCardProps {
  review: {
    // ... other fields
    hostResponse?: string | null;
    hostResponseAt?: string | null;
    adminResponse?: string | null;      // ✅ Thêm cho tour
    respondedAt?: string | null;        // ✅ Thêm cho tour
  };
}
```

**Hiển thị - Trước:**
```typescript
{review.hostResponse && (
  <div className="...">
    <span className="...">
      Phản hồi từ chủ nhà  {/* ❌ Cứng */}
    </span>
    <p>{review.hostResponse}</p>
  </div>
)}
```

**Hiển thị - Sau:**
```typescript
{(review.hostResponse || review.adminResponse) && (
  <div className="...">
    <span className="...">
      {type === 'homestay' 
        ? 'Phản hồi từ chủ nhà'           // ✅ Dynamic label
        : 'Phản hồi từ người quản lý'}
    </span>
    {(review.hostResponseAt || review.respondedAt) && (
      <span>{formatDistanceToNow(...)}</span>
    )}
    <p>
      {review.hostResponse || review.adminResponse}  // ✅ Support cả 2
    </p>
  </div>
)}
```

## So sánh Tour vs Homestay

| Feature | Tour (TourReview) | Homestay (HomestayReview) |
|---------|-------------------|---------------------------|
| **Trường lưu status** | ✅ `status` (PENDING/APPROVED/REJECTED) | ✅ `status` (PENDING/APPROVED/REJECTED) |
| **Filter công khai** | ✅ `status: 'APPROVED'` (đã sửa) | ✅ `status: 'APPROVED'` (đã đúng) |
| **Trường phản hồi** | ✅ `adminResponse` | ✅ `hostResponse` |
| **Trường thời gian** | ✅ `respondedAt` | ✅ `hostResponseAt` |
| **Map trong page** | ✅ Đầy đủ (đã sửa) | ✅ Đầy đủ (đã đúng) |
| **ReviewCard support** | ✅ Đã thêm | ✅ Đã có sẵn |

## Luồng hoạt động

### Admin quản lý đánh giá

1. **Duyệt review:**
   ```
   Admin clicks "Duyệt" → API PATCH → status = 'APPROVED' → Hiển thị công khai
   ```

2. **Từ chối review:**
   ```
   Admin clicks "Từ chối" → API PATCH → status = 'REJECTED' → Không hiển thị
   ```

3. **Phản hồi review:**
   ```
   Admin nhập phản hồi → API PATCH → 
   - adminResponse = "content"
   - respondedAt = now()
   → Hiển thị dưới review công khai
   ```

### Người dùng xem công khai

1. **Trang tour:**
   ```
   /tours/{slug} → 
   Load tour với TourReview (status='APPROVED') →
   Map adminResponse + respondedAt →
   ReviewCard hiển thị phản hồi
   ```

2. **Trang homestay:**
   ```
   /homestays/{slug} →
   Load homestay với HomestayReview (status='APPROVED') →
   Map hostResponse + hostResponseAt →
   ReviewCard hiển thị phản hồi
   ```

## Cách test

### Test 1: Xem đánh giá tour có phản hồi

1. Vào admin: http://localhost:3000/admin/reviews
2. Tìm tour review, gửi phản hồi: "Cảm ơn bạn đã đánh giá!"
3. Duyệt review (status = APPROVED)
4. Vào trang tour công khai
5. **Kết quả:** Review hiển thị với phản hồi từ admin

### Test 2: Xem đánh giá homestay có phản hồi

1. Vào admin: http://localhost:3000/admin/reviews
2. Tìm homestay review, gửi phản hồi
3. Duyệt review
4. Vào trang homestay công khai
5. **Kết quả:** Review hiển thị với phản hồi từ chủ nhà

### Test 3: Review REJECTED không hiển thị

1. Từ chối một review (status = REJECTED)
2. Vào trang tour/homestay công khai
3. **Kết quả:** Review đó KHÔNG xuất hiện

### Test 4: Review PENDING không hiển thị

1. Tạo review mới (mặc định PENDING)
2. Vào trang công khai
3. **Kết quả:** Review chưa hiển thị (chờ admin duyệt)

### Test 5: Label phản hồi đúng

1. Xem review tour → Label: "Phản hồi từ người quản lý"
2. Xem review homestay → Label: "Phản hồi từ chủ nhà"

## Giao diện

### Review với phản hồi (Tour)

```
┌─────────────────────────────────────────┐
│ 👤 Nguyễn Văn A                         │
│    ⭐⭐⭐⭐⭐ 5.0/5                       │
│    3 ngày trước                         │
├─────────────────────────────────────────┤
│ Tour rất tuyệt vời! Hướng dẫn viên      │
│ nhiệt tình, lịch trình hợp lý.          │
├─────────────────────────────────────────┤
│ 🔵 Phản hồi từ người quản lý            │
│    2 ngày trước                         │
│    Cảm ơn bạn đã đánh giá! Rất vui     │
│    khi bạn hài lòng với dịch vụ.       │
└─────────────────────────────────────────┘
```

### Review với phản hồi (Homestay)

```
┌─────────────────────────────────────────┐
│ 👤 Trần Thị B                           │
│    ⭐⭐⭐⭐⭐ 5.0/5                       │
│    1 tuần trước                         │
├─────────────────────────────────────────┤
│ Homestay sạch sẽ, thoáng mát.          │
│ Chủ nhà thân thiện.                     │
├─────────────────────────────────────────┤
│ 🔵 Phản hồi từ chủ nhà                  │
│    6 ngày trước                         │
│    Cảm ơn bạn đã lưu trú! Hy vọng      │
│    sẽ được đón tiếp bạn lần sau.       │
└─────────────────────────────────────────┘
```

## Files đã thay đổi

1. ✅ `/lib/tours/public.ts` - Filter theo status thay vì isPublished
2. ✅ `/app/tours/[slug]/page.tsx` - Map adminResponse và respondedAt
3. ✅ `/components/reviews/ReviewCard.tsx` - Hỗ trợ cả adminResponse và hostResponse

## Không cần thay đổi

- ❌ Database schema (đã đúng từ trước)
- ❌ API admin (đã hoàn chỉnh)
- ❌ Homestay pages (đã đúng từ trước)
- ❌ ReviewForm component (không liên quan)

## Tổng kết

### Trước khi sửa
- ❌ Tour reviews không hiển thị trên trang công khai (filter sai)
- ❌ Phản hồi của admin không hiển thị
- ❌ ReviewCard không hỗ trợ tour

### Sau khi sửa
- ✅ Tour reviews hiển thị đúng (APPROVED only)
- ✅ Phản hồi của admin hiển thị đầy đủ
- ✅ ReviewCard hỗ trợ cả tour và homestay
- ✅ Label dynamic theo loại sản phẩm
- ✅ Nhất quán giữa tour và homestay

## Lưu ý

- Server đã được restart
- Tất cả thay đổi đã được áp dụng
- Test trên cả tour và homestay
- Kiểm tra responsive design
- Kiểm tra dark mode
