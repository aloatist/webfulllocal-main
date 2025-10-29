# Thêm Link Sản Phẩm trong Quản Lý Đánh Giá

## Mô tả

Thêm link từ tên sản phẩm (tour/homestay) trong danh sách đánh giá đến trang chi tiết sản phẩm, giúp admin dễ dàng xem lại bài viết khi quản lý đánh giá.

## Thay đổi đã thực hiện

### 1. Cập nhật API GET - Trả về thêm `id` và `slug`

**File:** `/conphung/app/api/admin/reviews/route.ts`

**Trước:**
```typescript
// Tour reviews
include: {
  Tour: {
    select: {
      title: true,  // ❌ Chỉ có title
    },
  },
}

// Response
booking: {
  tour: {
    title: review.Tour.title,  // ❌ Thiếu id và slug
  },
}
```

**Sau:**
```typescript
// Tour reviews
include: {
  Tour: {
    select: {
      id: true,      // ✅ Thêm id
      title: true,
      slug: true,    // ✅ Thêm slug
    },
  },
}

// Response
booking: {
  tour: {
    id: review.Tour.id,        // ✅ Trả về id
    title: review.Tour.title,
    slug: review.Tour.slug,    // ✅ Trả về slug
  },
}
```

**Tương tự cho Homestay:**
```typescript
include: {
  Homestay: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
}
```

### 2. Cập nhật Interface - Thêm `id`, `slug`, `type`

**File:** `/conphung/app/admin/reviews/page.tsx`

**Trước:**
```typescript
interface Review {
  // ...
  booking?: {
    tour?: { title: string };           // ❌ Chỉ có title
    homestay?: { title: string };       // ❌ Chỉ có title
  };
}
```

**Sau:**
```typescript
interface Review {
  // ...
  booking?: {
    tour?: { 
      id: string;      // ✅ Thêm id
      title: string; 
      slug: string;    // ✅ Thêm slug
    };
    homestay?: { 
      id: string;      // ✅ Thêm id
      title: string; 
      slug: string;    // ✅ Thêm slug
    };
  };
  type?: 'tour' | 'homestay';  // ✅ Thêm type
}
```

### 3. Cập nhật UI - Hiển thị Link với Icon

**Trước:**
```tsx
<TableCell>
  {review.booking?.tour?.title || review.booking?.homestay?.title || 'N/A'}
</TableCell>
```

**Sau:**
```tsx
<TableCell>
  {review.booking?.tour ? (
    <a
      href={`/tours/${review.booking.tour.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline font-medium inline-flex items-center gap-1"
      title="Xem chi tiết tour"
    >
      {review.booking.tour.title}
      <ExternalLink className="h-3 w-3" />
    </a>
  ) : review.booking?.homestay ? (
    <a
      href={`/homestays/${review.booking.homestay.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline font-medium inline-flex items-center gap-1"
      title="Xem chi tiết homestay"
    >
      {review.booking.homestay.title}
      <ExternalLink className="h-3 w-3" />
    </a>
  ) : (
    'N/A'
  )}
</TableCell>
```

**Tính năng:**
- ✅ Link mở trong tab mới (`target="_blank"`)
- ✅ Icon ExternalLink để chỉ rõ là link external
- ✅ Hover effect (underline)
- ✅ Màu primary để nổi bật
- ✅ Tooltip hiển thị "Xem chi tiết tour/homestay"

### 4. Import Icon

```typescript
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Eye, 
  Trash2, 
  ExternalLink  // ✅ Thêm icon
} from 'lucide-react';
```

## URL Pattern

### Tour
```
/tours/{slug}
```
Ví dụ: `/tours/tour-mien-tay-3-ngay-2-dem`

### Homestay
```
/homestays/{slug}
```
Ví dụ: `/homestays/nha-nghi-ven-song`

## Giao diện

### Trước
```
┌─────────────┬──────────────────┬─────────┐
│ Khách hàng  │ Sản phẩm         │ Đánh giá│
├─────────────┼──────────────────┼─────────┤
│ Nguyễn A    │ Tour Miền Tây    │ ⭐⭐⭐⭐⭐│
│             │ (text thường)    │         │
└─────────────┴──────────────────┴─────────┘
```

### Sau
```
┌─────────────┬──────────────────────┬─────────┐
│ Khách hàng  │ Sản phẩm             │ Đánh giá│
├─────────────┼──────────────────────┼─────────┤
│ Nguyễn A    │ Tour Miền Tây 🔗     │ ⭐⭐⭐⭐⭐│
│             │ (link màu xanh)      │         │
└─────────────┴──────────────────────┴─────────┘
```

## Cách test

### Test 1: Click vào link Tour
1. Vào trang **Quản lý đánh giá**: http://localhost:3000/admin/reviews
2. Tìm review của tour
3. Click vào tên tour (có icon 🔗)
4. **Kết quả:** Mở tab mới với trang chi tiết tour

### Test 2: Click vào link Homestay
1. Tìm review của homestay
2. Click vào tên homestay (có icon 🔗)
3. **Kết quả:** Mở tab mới với trang chi tiết homestay

### Test 3: Hover effect
1. Di chuột qua tên sản phẩm
2. **Kết quả:** 
   - Hiển thị underline
   - Cursor đổi thành pointer
   - Tooltip hiển thị "Xem chi tiết tour/homestay"

### Test 4: Review không có booking
1. Tìm review không có thông tin booking (nếu có)
2. **Kết quả:** Hiển thị "N/A" (không phải link)

## Lợi ích

1. ✅ **Tiện lợi cho Admin:**
   - Không cần search lại sản phẩm
   - Click trực tiếp để xem chi tiết
   - Mở tab mới không làm mất trang quản lý

2. ✅ **UX tốt hơn:**
   - Icon rõ ràng cho biết có thể click
   - Hover effect phản hồi tức thì
   - Tooltip giải thích rõ ràng

3. ✅ **Dễ kiểm tra context:**
   - Xem lại nội dung tour/homestay
   - Đối chiếu với đánh giá
   - Quyết định duyệt/từ chối chính xác hơn

## Files đã thay đổi

1. ✅ `/conphung/app/api/admin/reviews/route.ts` - API trả về id và slug
2. ✅ `/conphung/app/admin/reviews/page.tsx` - UI hiển thị link với icon

## Không cần thay đổi

- ❌ Database schema (đã có sẵn `slug`)
- ❌ Migration (không cần)
- ❌ Backend logic (chỉ thêm select fields)

## Tương thích

- ✅ Hoạt động với cả Tour và Homestay
- ✅ Không ảnh hưởng chức năng cũ
- ✅ Responsive design
- ✅ Dark mode support (màu primary tự động adapt)
