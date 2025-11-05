# 🎯 Homepage Blocks System - Tài liệu Hướng Dẫn

## 📋 Tổng quan

Hệ thống **Homepage Blocks** cho phép quản lý nội dung trang chủ một cách linh hoạt và động, không cần hardcode trong code.

## 🏗️ Kiến trúc

### 1. Database Schema

**Model: `HomepageBlock`**
- `id`: Unique identifier
- `type`: Loại block (hero, about, feature, tourList, testimonial, cta, footerCta)
- `title`: Tên block (cho admin UI)
- `fields`: JSONB chứa dữ liệu động của block
- `sortOrder`: Thứ tự hiển thị (cho drag & drop)
- `status`: ACTIVE | DISABLED
- `themeId`: ID theme (null = áp dụng cho tất cả themes)

### 2. Block Registry

**File: `lib/blocks/registry.ts`**

Định nghĩa schema cho từng loại block:
- `hero`: Hero Banner với title, subtitle, background, CTA buttons
- `about`: About Section với content và image
- `feature`: Feature/Highlight section với list các tính năng
- `tourList`: Danh sách tours (từ API hoặc manual)
- `testimonial`: Testimonials từ khách hàng
- `cta`: CTA Banner
- `footerCta`: Footer CTA

**Thêm block mới:**
1. Thêm schema vào `BLOCK_REGISTRY` trong `lib/blocks/registry.ts`
2. Tạo component renderer trong `components/blocks/[BlockName]Block.tsx`
3. Đăng ký component trong `lib/blocks/renderer.tsx`

### 3. API Routes

#### Admin APIs (cần authentication):
- `GET /api/admin/homepage-blocks` - List tất cả blocks
- `POST /api/admin/homepage-blocks` - Tạo block mới
- `GET /api/admin/homepage-blocks/[id]` - Lấy block theo ID
- `PATCH /api/admin/homepage-blocks/[id]` - Cập nhật block
- `DELETE /api/admin/homepage-blocks/[id]` - Xóa block
- `PATCH /api/admin/homepage-blocks/sort` - Cập nhật thứ tự (drag & drop)

#### Public API:
- `GET /api/public/homepage-blocks` - Lấy active blocks cho frontend

### 4. Admin UI

**Trang: `/admin/homepage-blocks`**

Features:
- ✅ Drag & drop để sắp xếp thứ tự blocks
- ✅ Toggle status (ACTIVE/DISABLED)
- ✅ Add block mới từ danh sách block types
- ✅ Edit block với form động dựa trên schema
- ✅ Delete block với confirmation
- ✅ Real-time preview (tùy chọn)

### 5. Frontend Rendering

**File: `app/page-blocks.tsx`** (hoặc update `app/page.tsx`)

Homepage render động từ database:
1. Load active blocks từ `HomepageBlock` table
2. Sort theo `sortOrder`
3. Render mỗi block bằng component tương ứng
4. Chỉ render blocks có `status = ACTIVE`

## 🚀 Sử dụng

### Bước 1: Chạy Migration

```bash
cd conphung
npx prisma migrate dev
```

### Bước 2: Truy cập Admin UI

1. Vào `/admin/homepage-blocks`
2. Click "Thêm Block"
3. Chọn loại block muốn thêm
4. Điền thông tin trong form
5. Save

### Bước 3: Sắp xếp Blocks

1. Kéo thả các blocks để thay đổi thứ tự
2. Thứ tự sẽ tự động lưu vào database

### Bước 4: Toggle Visibility

1. Click icon Eye/EyeOff để ẩn/hiện block
2. Blocks DISABLED sẽ không hiển thị trên homepage

## 📝 Thêm Block Type Mới

### 1. Định nghĩa Schema

Thêm vào `lib/blocks/registry.ts`:

```typescript
newBlockType: {
  type: 'newBlockType',
  name: 'New Block Type',
  description: 'Mô tả block',
  icon: '🎨',
  category: 'content',
  fields: [
    {
      key: 'title',
      label: 'Tiêu đề',
      type: 'text',
      required: true,
    },
    // ... more fields
  ],
}
```

### 2. Tạo Component Renderer

Tạo `components/blocks/NewBlockTypeBlock.tsx`:

```tsx
'use client';

interface NewBlockTypeBlockProps {
  fields: {
    title?: string;
    // ... other fields
  };
}

export function NewBlockTypeBlock({ fields }: NewBlockTypeBlockProps) {
  // Render logic
  return <section>...</section>;
}
```

### 3. Đăng ký trong Renderer

Thêm vào `lib/blocks/renderer.tsx`:

```typescript
const NewBlockTypeBlock = dynamic(() => 
  import('@/components/blocks/NewBlockTypeBlock').then(m => ({ default: m.NewBlockTypeBlock }))
);

const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // ... existing
  newBlockType: NewBlockTypeBlock,
};
```

## 🎨 Block Examples

### Hero Block
```json
{
  "type": "hero",
  "fields": {
    "title": "KHU DU LỊCH SINH THÁI CỒN PHỤNG",
    "subtitle": "Công Trình Kiến Trúc Đạo Dừa",
    "backgroundImage": "/uploads/hero-bg.jpg",
    "primaryCtaText": "Đặt Tour Ngay",
    "primaryCtaLink": "tel:+84918267715"
  }
}
```

### About Block
```json
{
  "type": "about",
  "fields": {
    "title": "VỀ CỒN PHỤNG",
    "content": "<p>Nội dung HTML...</p>",
    "image": "/uploads/about.jpg",
    "ctaText": "Tìm hiểu thêm",
    "ctaLink": "/about"
  }
}
```

### Tour List Block
```json
{
  "type": "tourList",
  "fields": {
    "heading": "TOUR DU LỊCH NỔI BẬT",
    "source": "api",
    "limit": 6,
    "ctaText": "Xem tất cả tour",
    "ctaLink": "/tours"
  }
}
```

## 🔧 Multi-Theme Support

Blocks có thể được gán cho theme cụ thể:

```typescript
// Block cho tất cả themes
{ themeId: null }

// Block cho theme cụ thể
{ themeId: "songnuoc" }
```

Frontend sẽ filter blocks theo `themeId` khi load.

## 📚 API Documentation

### Create Block

```typescript
POST /api/admin/homepage-blocks
{
  type: "hero",
  fields: { ... },
  sortOrder?: number, // Auto if not provided
  status?: "ACTIVE" | "DISABLED",
  themeId?: string | null
}
```

### Update Block

```typescript
PATCH /api/admin/homepage-blocks/[id]
{
  fields?: { ... },
  title?: string,
  status?: "ACTIVE" | "DISABLED"
}
```

### Sort Blocks

```typescript
PATCH /api/admin/homepage-blocks/sort
{
  blocks: [
    { id: "block1", sortOrder: 0 },
    { id: "block2", sortOrder: 1 },
    ...
  ]
}
```

## ✅ Checklist Hoàn Thành

- [x] Prisma schema `HomepageBlock`
- [x] Block Registry với 7 block types
- [x] Admin API routes (CRUD + sort)
- [x] Public API route
- [x] Admin UI với drag & drop
- [x] Block Editor form động
- [x] Block Renderer components (7 blocks)
- [x] Homepage rendering từ blocks
- [x] Migration SQL
- [x] Documentation

## 🎯 Next Steps

1. **Chạy migration** để tạo table
2. **Test tạo block** trong admin UI
3. **Kiểm tra rendering** trên homepage
4. **Customize blocks** theo nhu cầu
5. **Thêm block types mới** nếu cần

---

**Lưu ý:** Hiện tại homepage vẫn đang dùng hệ thống cũ (`app/page.tsx`). Để chuyển sang block system:
- Option 1: Thay thế nội dung `app/page.tsx` bằng code từ `app/page-blocks.tsx`
- Option 2: Tạo route mới và test trước khi chuyển đổi hoàn toàn

