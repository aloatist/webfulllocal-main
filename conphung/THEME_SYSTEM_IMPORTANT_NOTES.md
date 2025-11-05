# ⚠️ Important Notes - Theme System

## 🎯 Route Priority

### Next.js App Router Route Resolution

1. **Exact routes** trong `app/` có priority cao nhất
   - `app/page.tsx` → `/`
   - `app/about/page.tsx` → `/about`

2. **Catch-all route** chỉ handle routes không tồn tại
   - `app/[...segments]/page.tsx` → Các routes không có trong `app/`

### ⚠️ Homepage Behavior

**Hiện tại**: `app/page.tsx` đang handle homepage (`/`)

**Để sử dụng theme homepage**:

**Option 1**: Giữ homepage hiện tại, theme cho routes khác
- ✅ Homepage: `app/page.tsx` (current)
- ✅ Other routes: Theme system

**Option 2**: Cho theme override homepage
- Sửa `app/page.tsx` để check theme:
```typescript
import { getActiveTheme } from '@/config/theme';
import { loadThemePage } from '@/lib/theme/loader';

export default async function Home() {
  const activeTheme = await getActiveTheme();
  const themePage = await loadThemePage('/');
  
  if (themePage) {
    // Use theme homepage
    return <themePage.default />;
  }
  
  // Fallback to current homepage
  // ... existing code
}
```

---

## 🔧 Dynamic Imports

### Issue
Next.js không support dynamic imports với absolute paths từ filesystem trong production.

### Solution
Sử dụng `@/` alias hoặc relative paths. Hệ thống đã xử lý:

1. Try `@/` alias first
2. Fallback to relative path
3. Support child theme resolution

---

## 📦 Build Time

### Pre-rendering Theme Pages

Để enable build-time pre-rendering:

```typescript
// In app/[...segments]/page.tsx
import { generateThemeStaticParams } from '@/lib/theme/build-time';

export async function generateStaticParams() {
  return generateThemeStaticParams();
}
```

**Note**: Chỉ nên dùng cho static routes. Dynamic routes nên dùng dynamic rendering.

---

## 🌐 Multi-Tenant

### Domain Mapping

Cấu hình trong `.env.local`:

```env
DOMAIN_THEME_MAP={"domain1.com":"theme1","domain2.com":"theme2"}
```

Hoặc implement database mapping trong `config/theme.ts` → `getThemeByDomain()`.

---

## 🎨 Theme Customizer

### CSS Variables

Customizer generate CSS variables:

```css
:root {
  --theme-primary: #10b981;
  --theme-secondary: #059669;
  --theme-font-family: Inter;
}
```

Sử dụng trong theme:

```css
.my-button {
  background: var(--theme-primary);
  font-family: var(--theme-font-family);
}
```

---

## 👶 Child Theme

### Inheritance Chain

Child theme → Parent theme → Default theme

**Example**:
```
grandchild (parent: child)
  → child (parent: default)
    → default
```

---

## 📝 TypeScript Types

All types available in `lib/theme/types.ts`:

```typescript
import type { ThemeConfig, ThemeMetadata, ThemePageProps } from '@/lib/theme/types';
```

---

## 🔒 Security

- ✅ Authentication required cho admin actions
- ✅ File size limit (50MB)
- ✅ Theme name validation
- ✅ Path traversal protection
- ✅ File type validation (.zip only)

---

## ⚡ Performance

- ✅ Lazy loading themes
- ✅ Build-time validation
- ✅ Efficient file resolution
- ✅ Caching support (cookies)
- ✅ Static params generation

---

## 🎯 Best Practices

1. **Luôn có theme `default`** - Fallback khi có lỗi
2. **Validate theme.json** - Đảm bảo format đúng
3. **Test routes** - Kiểm tra tất cả routes sau khi tạo theme
4. **Version control** - Commit themes vào git
5. **Documentation** - Viết README cho mỗi theme

---

## 📚 Next Steps (Optional)

Nếu muốn mở rộng thêm:

1. **Theme Marketplace** - Download themes từ store
2. **Theme Versioning** - Support theme updates
3. **Theme Backups** - Auto-backup before delete
4. **Theme Export** - Export theme as .zip
5. **Theme Templates** - Pre-built theme templates

---

**Version**: 2.0.0  
**Status**: Production Ready ✅

