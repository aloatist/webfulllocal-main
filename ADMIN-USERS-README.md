# ⚠️ Vấn Đề Trang Admin Users

## 🔍 Vấn Đề

Khi truy cập `/admin/users`, trang bị chuyển về `/admin` hoặc `/login`.

## 🎯 Nguyên Nhân

Dự án có **2 hệ thống authentication riêng biệt**:

### 1. **Frontend (Next.js) - NextAuth**
- Đăng nhập: `/login`
- Sử dụng: NextAuth với Prisma
- Database: PostgreSQL (Next.js)
- Users: Bảng `User` trong Prisma schema

### 2. **Backend (NestJS) - JWT**  
- API: `http://localhost:4000/api`
- Sử dụng: JWT tokens
- Database: PostgreSQL (NestJS - có thể khác DB)
- Users: Hệ thống User/Role/Permission riêng

**Vấn đề:** Khi đăng nhập vào Next.js, bạn KHÔNG tự động đăng nhập vào backend NestJS!

## 📊 Kiến Trúc Hiện Tại

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Next.js - Port 3000)                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  NextAuth Authentication                                │ │
│  │  - /login → Prisma User                                 │ │
│  │  - Session-based                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Pages:                                                      │
│  ✅ /admin (Dashboard) - Works                              │
│  ✅ /admin/posts - Works                                    │
│  ✅ /admin/categories - Works                               │
│  ❌ /admin/users - Needs Backend Auth                       │
└─────────────────────────────────────────────────────────────┘
                            ↓ API Calls
┌─────────────────────────────────────────────────────────────┐
│  Backend (NestJS - Port 4000)                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  JWT Authentication                                     │ │
│  │  - /api/auth/login → JWT token                          │ │
│  │  - Token-based                                          │ │
│  │  - User/Role/Permission system                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Endpoints:                                                  │
│  - /api/users (requires JWT)                                │
│  - /api/roles (requires JWT)                                │
│  - /api/permissions (requires JWT)                          │
│  - /api/tokens (requires JWT)                               │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Giải Pháp

### Giải Pháp 1: Tích Hợp Authentication (Khuyên Dùng)

Tạo một middleware để sync authentication giữa Next.js và NestJS:

1. Khi user đăng nhập Next.js → Tự động lấy JWT token từ backend
2. Lưu JWT token vào localStorage/cookies
3. Sử dụng token này cho các API calls tới backend

**File cần tạo:** `/lib/auth/backend-sync.ts`

### Giải Pháp 2: Tạo Trang Users Mới (Nhanh)

Tạo trang `/admin/users` mới sử dụng Next.js API thay vì backend:

1. Tạo `/app/api/admin/users/route.ts`
2. Sử dụng Prisma để quản lý users
3. Không cần backend NestJS

### Giải Pháp 3: Ẩn Trang Users (Tạm Thời)

Ẩn link "Users" trong sidebar cho đến khi tích hợp xong:

**File:** `/components/admin/admin-sidebar.tsx`

```tsx
// Comment out hoặc xóa:
{
  title: 'Users',
  href: '/admin/users',
  icon: Users,
},
```

## 🚀 Hướng Dẫn Triển Khai Giải Pháp 1

### Bước 1: Tạo Backend Auth Sync

```typescript
// lib/auth/backend-sync.ts
import { getAccessToken, setAccessToken } from './token-storage';

export async function syncBackendAuth(email: string, password: string) {
  try {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Backend authentication failed');
    }

    const { accessToken } = await response.json();
    setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error('Failed to sync backend auth:', error);
    throw error;
  }
}
```

### Bước 2: Cập Nhật Login Page

```typescript
// app/login/page.tsx
import { syncBackendAuth } from '@/lib/auth/backend-sync';

// Trong handleSubmit:
const result = await signIn('credentials', {
  email,
  password,
  redirect: false,
});

if (result?.ok) {
  // Sync với backend
  try {
    await syncBackendAuth(email, password);
  } catch (error) {
    console.warn('Backend sync failed, but Next.js login succeeded');
  }
  
  router.push('/admin');
}
```

### Bước 3: Test

```bash
# 1. Đăng nhập vào Next.js
# Email: conphung87@yahoo.com.vn
# Password: admin123

# 2. Truy cập /admin/users
# → Nên hoạt động bình thường
```

## 📝 Checklist

- [ ] Quyết định giải pháp nào sử dụng
- [ ] Nếu Giải pháp 1: Tạo backend-sync.ts
- [ ] Nếu Giải pháp 1: Cập nhật login page
- [ ] Nếu Giải pháp 2: Tạo Next.js API cho users
- [ ] Nếu Giải pháp 3: Ẩn link Users trong sidebar
- [ ] Test trang /admin/users
- [ ] Cập nhật documentation

## 🔗 Files Liên Quan

- Frontend Auth: `/lib/auth/token-storage.ts`
- Backend API: `/lib/admin/api.ts`
- Users Page: `/app/admin/users/page.tsx`
- Backend Controller: `/backend/src/users/users.controller.ts`
- Sidebar: `/components/admin/admin-sidebar.tsx`

## 💡 Lưu Ý

1. **Không nên** có 2 hệ thống auth riêng biệt trong production
2. **Nên** tích hợp hoặc chọn 1 hệ thống duy nhất
3. **Backend NestJS** có vẻ là hệ thống cũ, có thể không cần thiết
4. **Next.js API routes** đủ mạnh để thay thế backend cho admin features

## 🎯 Khuyến Nghị

**Sử dụng Giải pháp 2** - Tạo Next.js API mới:
- ✅ Đơn giản hơn
- ✅ Không cần maintain 2 hệ thống
- ✅ Sử dụng Prisma đã có sẵn
- ✅ Dễ deploy và scale

Bạn muốn tôi implement giải pháp nào? 🚀
