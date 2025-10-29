# Debug: Homestay Reviews Không Hiển Thị

## Tình trạng hiện tại

### ✅ Đã kiểm tra và OK

1. **Schema đúng:**
   - ✅ HomestayReview có trường `status` (ReviewStatus)
   - ✅ Có index cho `status`
   - ✅ Có trường `hostResponse` và `hostResponseAt`

2. **Dữ liệu trong database:**
   - ✅ Có 3 reviews cho homestay "ueq"
   - ✅ 1 review APPROVED (sẽ hiển thị)
   - ⏳ 1 review PENDING (không hiển thị)
   - ❌ 1 review REJECTED (không hiển thị)

3. **Homestay status:**
   - ✅ Homestay "ueq" có status = PUBLISHED
   - ✅ Có thể truy cập công khai

4. **Query đúng:**
   - ✅ Filter: `where: { status: 'APPROVED' }`
   - ✅ Select đầy đủ fields
   - ✅ Include User info

## Cách kiểm tra

### Bước 1: Kiểm tra logs trong terminal

Server đang chạy với console.log đã thêm. Khi bạn truy cập trang homestay, sẽ thấy logs:

```bash
[Homestay Page] Reviews count: X
[Homestay Page] Sample review: { id: '...', ... }
```

**Nếu count = 0:** Vấn đề ở query database
**Nếu count > 0:** Vấn đề ở render component

### Bước 2: Truy cập trang homestay

Mở trình duyệt và vào:
```
http://localhost:3000/homestays/ueq
```

### Bước 3: Kiểm tra console browser

Mở DevTools (F12) → Console tab, sẽ thấy:

```
[ReviewsSection] Received reviews: X
[ReviewsSection] Sample review: { ... }
```

**Nếu không thấy logs:** Component không được render
**Nếu reviews.length = 0:** Data không được truyền xuống

### Bước 4: Kiểm tra Network tab

1. Mở DevTools → Network tab
2. Reload trang
3. Tìm request đến `/homestays/ueq`
4. Xem response có chứa `HomestayReview` không

## Các vấn đề có thể gặp

### Vấn đề 1: Cache

**Triệu chứng:** Dữ liệu cũ vẫn hiển thị

**Giải pháp:**
```bash
# Xóa cache Next.js
rm -rf .next
npm run dev
```

### Vấn đề 2: Review chưa APPROVED

**Triệu chứng:** Không có review nào hiển thị

**Giải pháp:**
1. Vào admin: http://localhost:3000/admin/reviews
2. Tìm review của homestay "ueq"
3. Click "Duyệt" để set status = APPROVED

### Vấn đề 3: Homestay không PUBLISHED

**Triệu chứng:** Trang 404 hoặc không load

**Giải pháp:**
```bash
npx tsx scripts/check-homestay-status.ts
```

Nếu status không phải PUBLISHED, vào admin để update.

### Vấn đề 4: Prisma Client chưa sync

**Triệu chứng:** TypeScript errors hoặc query lỗi

**Giải pháp:**
```bash
npx prisma generate
npm run dev
```

## Scripts hỗ trợ debug

### Kiểm tra tất cả reviews
```bash
npx tsx scripts/check-homestay-reviews.ts
```

Output:
```
Status distribution:
  APPROVED: 1
  PENDING: 1
  REJECTED: 1

Total reviews: 3
1. ưeq (ueq)
   Status: APPROVED
   Rating: 5
   Has response: Yes
```

### Kiểm tra homestay cụ thể
```bash
npx tsx scripts/check-homestay-status.ts
```

Output:
```
Homestay found:
  Status: PUBLISHED
  Total reviews: 3

✅ APPROVED reviews: 1
```

## Checklist debug

- [ ] Server đang chạy (port 3000)
- [ ] Database có data (check scripts)
- [ ] Homestay status = PUBLISHED
- [ ] Có ít nhất 1 review APPROVED
- [ ] Query filter đúng (status: 'APPROVED')
- [ ] Console logs xuất hiện
- [ ] Component ReviewsSection được render
- [ ] ReviewCard nhận đúng props

## Nếu vẫn không hiển thị

### Kiểm tra ReviewList component

```typescript
// File: components/reviews/ReviewList.tsx
export function ReviewList({ reviews, type }) {
  console.log('[ReviewList] Rendering with:', reviews.length, 'reviews');
  
  if (reviews.length === 0) {
    return <div>Chưa có đánh giá nào</div>;
  }
  
  return reviews.map(review => (
    <ReviewCard key={review.id} review={review} type={type} />
  ));
}
```

### Kiểm tra ReviewCard component

```typescript
// File: components/reviews/ReviewCard.tsx
export function ReviewCard({ review, type }) {
  console.log('[ReviewCard] Rendering review:', review.id);
  
  return (
    <div>
      {/* ... */}
      {review.hostResponse && (
        <div>Phản hồi: {review.hostResponse}</div>
      )}
    </div>
  );
}
```

## Kết quả mong đợi

Sau khi debug, trang homestay sẽ hiển thị:

```
┌─────────────────────────────────────────┐
│ Đánh giá từ khách hàng                  │
├─────────────────────────────────────────┤
│ 📊 Rating Summary                       │
│    5.0 ⭐⭐⭐⭐⭐                        │
│    1 đánh giá                           │
├─────────────────────────────────────────┤
│ 📝 Review Form | 💬 Review List         │
│                                         │
│ [Form để gửi   | 👤 User Name           │
│  review mới]   |    ⭐⭐⭐⭐⭐ 5.0/5    │
│                |    Nội dung review...  │
│                |                        │
│                | 🔵 Phản hồi từ chủ nhà │
│                |    Cảm ơn bạn...      │
└─────────────────────────────────────────┘
```

## Logs cần chú ý

### Server logs (terminal)
```
[Homestay Page] Reviews count: 1
[Homestay Page] Sample review: {
  id: 'L_SAqgEnk4QUMs-Up4qNq',
  status: 'APPROVED',
  overallRating: Decimal { value: '5.00' },
  content: '...',
  hostResponse: '...',
  User: { name: '...', image: null }
}
```

### Browser console logs
```
[ReviewsSection] Received reviews: 1
[ReviewsSection] Sample review: {
  id: 'L_SAqgEnk4QUMs-Up4qNq',
  User: { name: '...', image: null },
  overallRating: 5,
  ...
}
```

## Liên hệ nếu cần hỗ trợ

Nếu sau khi làm theo tất cả các bước trên mà vẫn không hiển thị, hãy cung cấp:

1. Screenshot console logs (cả server và browser)
2. Output của 2 scripts check
3. Screenshot trang homestay
4. Network tab response data

---

**Cập nhật:** Server đã được restart với logs debug. Vui lòng truy cập trang và kiểm tra console!
