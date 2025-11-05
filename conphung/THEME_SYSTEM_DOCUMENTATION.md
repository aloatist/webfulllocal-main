# 🎨 Multi-Theme System Documentation

Hệ thống đa template (multi-theme) cho Next.js - Giống WordPress theme system

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Cấu Trúc](#cấu-trúc)
3. [Cài Đặt](#cài-đặt)
4. [Sử Dụng](#sử-dụng)
5. [API Reference](#api-reference)
6. [Tạo Theme Mới](#tạo-theme-mới)
7. [Quản Lý Theme](#quản-lý-theme)
8. [Multi-Tenant](#multi-tenant)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng Quan

Hệ thống này cho phép:

- ✅ **Thêm/Xóa/Cập nhật** theme mà không ảnh hưởng backend
- ✅ **Kích hoạt theme** ngay lập tức (không cần restart server)
- ✅ **Dynamic routing** - mọi route tự động load từ theme tương ứng
- ✅ **Full Next.js support** - `getServerSideProps`, `getStaticProps`, `getStaticPaths`
- ✅ **Multi-tenant** - domain A → theme1, domain B → theme2
- ✅ **Tailwind CSS** hoạt động với tất cả theme

---

## 📁 Cấu Trúc

```
conphung/
├── config/
│   └── theme.ts              # Theme configuration & detection
├── lib/
│   └── theme/
│       └── loader.ts          # Theme page/layout loader
├── app/
│   ├── [...segments]/         # Dynamic catch-all route
│   │   └── page.tsx          # Delegates to theme pages
│   └── api/
│       └── themes/
│           └── route.ts      # Theme management API
├── templates/                 # Theme directory
│   ├── default/              # Default theme
│   │   ├── theme.json        # Theme metadata
│   │   ├── pages/            # Theme pages
│   │   │   ├── index.tsx    # Homepage
│   │   │   └── about.tsx    # About page
│   │   ├── layout/          # Theme layouts
│   │   │   └── default.tsx # Default layout
│   │   ├── components/      # Theme-specific components
│   │   └── public/          # Public assets
│   └── template1/           # Another theme
│       └── ...
└── scripts/
    └── create-theme.ts       # Script tạo theme mới
```

---

## 🚀 Cài Đặt

### 1. Environment Variables

Thêm vào `.env.local` (tùy chọn):

```env
# Theme configuration
THEMES_DIR=templates
ACTIVE_THEME=default

# Multi-tenant domain mapping (JSON format)
DOMAIN_THEME_MAP={"domain1.com":"theme1","domain2.com":"theme2"}
```

### 2. Tạo Theme Default

Theme `default` đã được tạo sẵn. Nếu chưa có, tạo bằng:

```bash
npx tsx scripts/create-theme.ts default
```

### 3. Verify Setup

Kiểm tra theme system hoạt động:

```bash
# List all themes
curl http://localhost:3000/api/themes

# Should return list of available themes
```

---

## 💡 Sử Dụng

### Kích Hoạt Theme

**Cách 1: Qua API**

```bash
curl -X POST http://localhost:3000/api/themes \
  -H "Content-Type: application/json" \
  -d '{"theme": "template1"}'
```

**Cách 2: Qua Cookie (Manual)**

```javascript
// Browser console
document.cookie = "active_theme=template1; path=/; max-age=31536000";
location.reload();
```

**Cách 3: Qua Admin Panel** (nếu có UI)

### Tạo Route Mới Trong Theme

Thêm file mới trong `templates/<theme-name>/pages/`:

**`templates/default/pages/contact.tsx`**

```tsx
export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      {/* Your content */}
    </div>
  );
}
```

Tự động map đến route: `/contact`

### Dynamic Routes

Tạo dynamic route: `templates/default/pages/blog/[slug].tsx`

```tsx
interface PageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: PageProps) {
  return (
    <div>
      <h1>Blog Post: {params.slug}</h1>
    </div>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  // Fetch data
  return {
    props: {
      slug: params.slug,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
```

### Layout Riêng Cho Theme

Tạo layout trong `templates/<theme>/layout/`:

**`templates/default/layout/default.tsx`**

```tsx
import { ReactNode } from 'react';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}
```

Layout sẽ được tự động wrap cho tất cả pages trong theme.

---

## 🔌 API Reference

### GET /api/themes

Liệt kê tất cả themes có sẵn.

**Response:**

```json
{
  "success": true,
  "themes": [
    {
      "id": "default",
      "name": "Default",
      "version": "1.0.0",
      "author": "System",
      "description": "Default theme",
      "path": "/path/to/templates/default",
      "active": true,
      "canDelete": false
    }
  ],
  "count": 2
}
```

### POST /api/themes

Kích hoạt theme.

**Request:**

```json
{
  "theme": "template1"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Theme \"template1\" activated successfully",
  "theme": "template1"
}
```

**Note:** Yêu cầu authentication (admin).

### DELETE /api/themes?theme=name

Xóa theme.

**Response:**

```json
{
  "success": true,
  "message": "Theme \"themeName\" deleted successfully"
}
```

**Note:** 
- Yêu cầu authentication
- Không thể xóa theme đang active
- Không thể xóa theme `default`

---

## 🛠️ Tạo Theme Mới

### Cách 1: Sử Dụng Script (Khuyến Nghị)

```bash
npx tsx scripts/create-theme.ts my-theme

# Với parent theme (child theme)
npx tsx scripts/create-theme.ts my-child-theme --parent=default
```

Script sẽ tạo:
- ✅ Thư mục theme
- ✅ `theme.json` với metadata
- ✅ Layout mặc định
- ✅ Pages mẫu (index, about)
- ✅ README.md

### Cách 2: Tạo Manual

1. Tạo thư mục: `templates/my-theme/`
2. Tạo `theme.json`:

```json
{
  "name": "My Theme",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "My custom theme"
}
```

3. Tạo cấu trúc:
   - `pages/` - Theme pages
   - `layout/` - Theme layouts
   - `components/` - Theme components
   - `public/` - Public assets

### Theme Structure Requirements

```
my-theme/
├── theme.json          # Required: Theme metadata
├── pages/             # Required: Theme pages
│   └── index.tsx     # Required: Homepage
├── layout/            # Optional: Theme layouts
│   └── default.tsx    # Optional: Default layout
├── components/         # Optional: Theme components
└── public/             # Optional: Public assets
```

---

## 🎨 Quản Lý Theme

### Liệt Kê Themes

```typescript
import { getAllThemes } from '@/config/theme';

const themes = await getAllThemes();
console.log(themes);
```

### Kiểm Tra Theme Active

```typescript
import { getActiveTheme } from '@/config/theme';

const activeTheme = await getActiveTheme();
console.log(activeTheme); // 'default' | 'template1' | ...
```

### Validate Theme

```typescript
import { themeExists } from '@/config/theme';

const exists = await themeExists('my-theme');
if (!exists) {
  console.log('Theme not found');
}
```

---

## 🌐 Multi-Tenant

Hệ thống hỗ trợ multi-tenant theo domain:

### Cấu Hình Domain → Theme

**Cách 1: Environment Variable**

```env
DOMAIN_THEME_MAP={"example.com":"theme1","another.com":"theme2"}
```

**Cách 2: Database** (cần implement)

Lưu mapping vào database và load trong `getThemeByDomain()`.

**Cách 3: Config File**

Tạo file `config/domain-themes.ts`:

```typescript
export const domainThemeMap: Record<string, string> = {
  'example.com': 'theme1',
  'another.com': 'theme2',
  '*.example.com': 'theme1', // Wildcard subdomain
};
```

### Priority Order

1. **Domain-based** (nếu có)
2. Cookie (`active_theme`)
3. Database (nếu dùng)
4. Environment variable (`ACTIVE_THEME`)
5. Default theme

---

## ⚠️ Troubleshooting

### Theme Không Load Được

**Kiểm tra:**
1. Theme có tồn tại trong `templates/`?
2. File `theme.json` có hợp lệ?
3. Page có tồn tại trong `pages/`?
4. Check console logs

**Debug:**

```typescript
import { getActiveTheme, themeExists } from '@/config/theme';

const active = await getActiveTheme();
const exists = await themeExists(active);
console.log({ active, exists });
```

### Route 404

**Nguyên nhân:**
- Page không tồn tại trong theme
- Route path không match file path

**Giải pháp:**
- Tạo file tương ứng trong `templates/<theme>/pages/`
- Đảm bảo naming convention đúng

### Tailwind CSS Không Hoạt Động

**Kiểm tra `tailwind.config.ts`:**

Đảm bảo có:

```typescript
content: [
  // ...
  "./templates/**/*.{ts,tsx}", // ✅ This line
],
```

---

## 📝 Notes

### Import Paths

Khi import trong theme pages/layouts, sử dụng:

```tsx
// ✅ Relative imports (recommended)
import { Button } from '../../components/Button';

// ✅ Absolute imports from project root
import { Button } from '@/components/ui/button';
```

### Public Assets

Assets trong `templates/<theme>/public/` accessible tại:

```
/themes/<theme>/assets/image.jpg
```

### Child Themes

Để tạo child theme (kế thừa parent):

```json
{
  "name": "Child Theme",
  "parent": "default"
}
```

Child theme sẽ fallback về parent nếu không tìm thấy file.

---

## 🎯 Best Practices

1. **Luôn có theme `default`** - Fallback khi có lỗi
2. **Validate theme.json** - Đảm bảo format đúng
3. **Test routes** - Kiểm tra tất cả routes sau khi tạo theme
4. **Version control** - Commit themes vào git
5. **Documentation** - Viết README cho mỗi theme

---

## 📚 Examples

Xem examples trong:
- `templates/default/` - Theme mặc định
- `templates/template1/` - Theme demo với gradients

---

## 🔄 Migration từ Legacy System

Nếu đang dùng hệ thống template cũ (TemplateType enum), hệ thống sẽ tự động map:

- `ECOLOGICAL` → `default`
- `MODERN` → `modern`
- `TRADITIONAL` → `traditional`
- `GEOMETRIC` → `geometric`

---

## ❓ FAQ

**Q: Có thể dùng cả Pages Router và App Router không?**

A: Hiện tại hệ thống chỉ support App Router. Nếu cần Pages Router, cần implement thêm.

**Q: Làm sao để theme có styles riêng?**

A: Import CSS trong layout hoặc page:

```tsx
import './theme.css'; // File trong theme folder
```

**Q: Có thể hot-reload khi đổi theme không?**

A: Có, chỉ cần activate theme mới qua API, không cần restart server.

---

## 📞 Support

Nếu gặp vấn đề, check:
1. Console logs
2. Network tab (API calls)
3. File structure
4. Theme.json format

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-22

