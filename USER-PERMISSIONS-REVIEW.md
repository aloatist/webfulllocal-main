# 👥 Review Hệ Thống User & Permissions

## 📊 Hiện Trạng

### 1. **Có 2 Hệ Thống Authentication Riêng Biệt**

#### Hệ Thống 1: Next.js (Frontend) - ✅ Đang Hoạt Động
```
Location: /conphung
Auth: NextAuth với Prisma
Database: PostgreSQL
Users: Table User trong Prisma schema
```

**Prisma User Model:**
```prisma
model User {
  id                String              @id
  name              String?
  email             String              @unique
  password          String?
  emailVerified     DateTime?
  image             String?
  role              UserRole            @default(USER)
  createdAt         DateTime            @default(now())
  updatedAt         DateTime
  accounts          Account[]
  sessions          Session[]
  Post              Post[]
}

enum UserRole {
  USER
  EDITOR
  ADMIN
}
```

**Roles:**
- `USER` - Người dùng thường
- `EDITOR` - Biên tập viên (có thể tạo/sửa bài)
- `ADMIN` - Quản trị viên (full quyền)

#### Hệ Thống 2: NestJS (Backend) - ⚠️ Chưa Tích Hợp
```
Location: /backend
Auth: JWT tokens
Database: PostgreSQL (có thể khác DB)
Users: Hệ thống User/Role/Permission riêng
```

**Backend User System:**
```typescript
User {
  id: string
  email: string
  fullName: string
  status: 'active' | 'pending' | 'suspended'
  roles: Role[]
}

Role {
  id: string
  code: string
  name: string
  permissions: Permission[]
}

Permission {
  id: string
  code: string // e.g., 'user.write', 'post.read'
  name: string
}
```

## ⚠️ Vấn Đề

### 1. **Trang /admin/users Không Hoạt Động**
- Trang cần backend NestJS API
- User chỉ đăng nhập vào Next.js, không có JWT token cho backend
- → Lỗi 401 Unauthorized

### 2. **Permissions Thiếu Chi Tiết**
- Next.js chỉ có 3 roles đơn giản: USER, EDITOR, ADMIN
- Không có granular permissions như:
  - `post.create`, `post.edit`, `post.delete`, `post.publish`
  - `media.upload`, `media.delete`
  - `category.manage`, `tag.manage`
  - `social_media.connect`, `social_media.post`
  - `analytics.view`

### 3. **Không Có Team/Organization Management**
- Không thể phân quyền theo team
- Không có workspace separation
- Không có user invitation flow

## 🎯 Giải Pháp Đề Xuất

### Option A: Dùng Next.js Làm Hệ Thống Chính (Khuyên Dùng)

**Lợi ích:**
- ✅ Đơn giản hơn
- ✅ Không cần maintain 2 hệ thống
- ✅ Dễ deploy
- ✅ Đã có sẵn trong Prisma

**Implementation:**

#### 1. Mở Rộng User Model
```prisma
model User {
  id                String              @id
  name              String?
  email             String              @unique
  password          String?
  emailVerified     DateTime?
  image             String?
  role              UserRole            @default(USER)
  permissions       String[]            // Array of permission codes
  isActive          Boolean             @default(true)
  lastLoginAt       DateTime?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime
  accounts          Account[]
  sessions          Session[]
  Post              Post[]
  teamMemberships   TeamMember[]
}

enum UserRole {
  USER
  EDITOR
  MARKETING
  ADMIN
  SUPER_ADMIN
}

// Team/Organization
model Team {
  id          String       @id
  name        String
  slug        String       @unique
  isActive    Boolean      @default(true)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime
  members     TeamMember[]
}

model TeamMember {
  id          String   @id
  userId      String
  teamId      String
  role        String   // team_owner, team_admin, team_member
  permissions String[] // Team-specific permissions
  createdAt   DateTime @default(now())
  updatedAt   DateTime
  
  user        User     @relation(fields: [userId], references: [id])
  team        Team     @relation(fields: [teamId], references: [id])
  
  @@unique([userId, teamId])
}

// Permission definitions
model Permission {
  id          String   @id
  code        String   @unique // e.g., 'post.create'
  name        String
  description String?
  category    String   // post, media, user, social_media
  createdAt   DateTime @default(now())
  updatedAt   DateTime
}

// Role definitions with permissions
model Role {
  id          String   @id
  code        String   @unique // admin, editor, marketing
  name        String
  permissions String[] // Array of permission codes
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime
}
```

#### 2. Permission System
```typescript
// lib/permissions/definitions.ts
export const PERMISSIONS = {
  // Posts
  'post.view': 'View posts',
  'post.create': 'Create posts',
  'post.edit': 'Edit posts',
  'post.edit.own': 'Edit own posts',
  'post.delete': 'Delete posts',
  'post.publish': 'Publish posts',
  
  // Media
  'media.view': 'View media library',
  'media.upload': 'Upload media',
  'media.delete': 'Delete media',
  
  // Categories & Tags
  'category.manage': 'Manage categories',
  'tag.manage': 'Manage tags',
  
  // Social Media
  'social_media.view': 'View social media',
  'social_media.connect': 'Connect platforms',
  'social_media.post': 'Post to social media',
  'social_media.disconnect': 'Disconnect platforms',
  
  // Users
  'user.view': 'View users',
  'user.create': 'Create users',
  'user.edit': 'Edit users',
  'user.delete': 'Delete users',
  'user.manage_roles': 'Manage user roles',
  
  // Analytics
  'analytics.view': 'View analytics',
  
  // Settings
  'settings.view': 'View settings',
  'settings.edit': 'Edit settings',
} as const;

export const ROLE_PERMISSIONS = {
  ADMIN: Object.keys(PERMISSIONS), // All permissions
  
  EDITOR: [
    'post.view', 'post.create', 'post.edit', 'post.delete', 'post.publish',
    'media.view', 'media.upload', 'media.delete',
    'category.manage', 'tag.manage',
    'social_media.view', 'social_media.post',
  ],
  
  MARKETING: [
    'post.view', 'post.create', 'post.edit.own',
    'media.view', 'media.upload',
    'social_media.view', 'social_media.connect', 'social_media.post',
    'analytics.view',
  ],
  
  USER: [
    'post.view',
    'media.view',
  ],
};
```

#### 3. Permission Checking Utilities
```typescript
// lib/permissions/check.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

export async function hasPermission(permission: string): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;
  
  // Super admin has all permissions
  if (session.user.role === 'SUPER_ADMIN') return true;
  
  // Check user's custom permissions
  if (session.user.permissions?.includes(permission)) return true;
  
  // Check role's default permissions
  const rolePermissions = ROLE_PERMISSIONS[session.user.role] || [];
  return rolePermissions.includes(permission);
}

export async function requirePermission(permission: string) {
  const allowed = await hasPermission(permission);
  if (!allowed) {
    throw new Error('Forbidden: Insufficient permissions');
  }
}

// Client-side hook
export function usePermission(permission: string) {
  const { data: session } = useSession();
  
  if (!session?.user) return false;
  if (session.user.role === 'SUPER_ADMIN') return true;
  if (session.user.permissions?.includes(permission)) return true;
  
  const rolePermissions = ROLE_PERMISSIONS[session.user.role] || [];
  return rolePermissions.includes(permission);
}
```

#### 4. Admin UI for User Management
```tsx
// app/admin/users-management/page.tsx
'use client';

export default function UsersManagementPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UsersList />
        </TabsContent>
        
        <TabsContent value="roles">
          <RolesList />
        </TabsContent>
        
        <TabsContent value="permissions">
          <PermissionsList />
        </TabsContent>
        
        <TabsContent value="teams">
          <TeamsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### Option B: Tích Hợp Backend NestJS (Phức Tạp Hơn)

**Yêu cầu:**
- Sync authentication giữa Next.js và NestJS
- Khi login Next.js → Tự động lấy JWT từ backend
- Lưu JWT vào cookie/localStorage
- Dùng JWT cho các API calls tới backend

**Không khuyên dùng vì:**
- ❌ Phức tạp
- ❌ Khó maintain
- ❌ Khó deploy
- ❌ Có 2 source of truth

## 📋 Implementation Plan

### Phase 1: Database Schema (1-2h)
- [ ] Update Prisma schema
- [ ] Add Team, TeamMember, Role, Permission models
- [ ] Run migrations
- [ ] Seed default roles & permissions

### Phase 2: Permission System (2-3h)
- [ ] Create permission definitions
- [ ] Create role definitions
- [ ] Create permission checking utilities
- [ ] Add middleware for API routes

### Phase 3: Admin UI (4-6h)
- [ ] Create /admin/users-management page
- [ ] User CRUD operations
- [ ] Role assignment
- [ ] Permission management
- [ ] Team management

### Phase 4: Integration (2-3h)
- [ ] Update Post Editor with permission checks
- [ ] Update Media Library with permission checks
- [ ] Update Social Media features with permission checks
- [ ] Add permission indicators in UI

### Phase 5: Testing (2-3h)
- [ ] Test each role
- [ ] Test permission combinations
- [ ] Test team isolation
- [ ] Security audit

## 🎯 Khuyến Nghị

**Implement Option A** - Dùng Next.js làm hệ thống chính:
1. ✅ Đơn giản hơn nhiều
2. ✅ Dễ maintain
3. ✅ Đủ mạnh cho hầu hết use cases
4. ✅ Có thể scale sau
5. ✅ Tích hợp tốt với Social Media Automation

**Bỏ backend NestJS user management** hoặc chỉ dùng cho:
- Internal services
- Background jobs
- API gateway

---

**Bạn muốn tôi implement giải pháp nào?**
