# 🎨 Multi-Theme System - Complete Guide

**Version**: 2.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: 2025-01-22

---

## 📋 Tổng Quan

Hệ thống đa template (multi-theme) giống WordPress cho Next.js App Router. Cho phép:

- ✅ Thêm/Xóa/Cập nhật theme mà không ảnh hưởng backend
- ✅ Kích hoạt theme ngay lập tức (không cần restart)
- ✅ Dynamic routing tự động
- ✅ Full Next.js features support
- ✅ Multi-tenant theo domain
- ✅ Admin UI quản lý theme
- ✅ Theme upload (.zip)
- ✅ Theme preview
- ✅ Child theme support
- ✅ WordPress-like customizer

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install adm-zip
```

### 2. Access Admin UI

```
http://localhost:3000/admin/themes
```

### 3. Test Demo Themes

```bash
# List themes
curl http://localhost:3000/api/themes

# Activate theme
curl -X POST http://localhost:3000/api/themes \
  -H "Content-Type: application/json" \
  -d '{"theme": "template1"}'
```

---

## 📁 Cấu Trúc

```
conphung/
├── config/
│   └── theme.ts                    # Theme configuration
├── lib/
│   └── theme/
│       ├── loader.ts               # Dynamic loader
│       ├── child-theme.ts          # Child theme support
│       ├── customizer.ts           # Customizer logic
│       ├── pages-router-adapter.ts # Pages Router adapter
│       ├── build-time.ts           # Build utilities
│       └── types.ts                # TypeScript types
├── app/
│   ├── [...segments]/
│   │   └── page.tsx                # Catch-all route
│   └── api/
│       └── themes/
│           ├── route.ts            # CRUD API
│           ├── upload/route.ts    # Upload API
│           ├── preview/route.ts   # Preview API
│           └── customizer/route.ts # Customizer API
├── app/admin/
│   └── themes/
│       └── page.tsx                # Admin UI
├── templates/
│   ├── default/                    # Default theme
│   │   ├── theme.json
│   │   ├── pages/
│   │   ├── layout/
│   │   └── components/
│   └── template1/                  # Demo theme
│       └── ...
└── scripts/
    └── create-theme.ts             # Theme generator
```

---

## 🎯 Features

### ✅ Core Features
- Dynamic routing với catch-all route
- Theme detection (Domain → Cookie → DB → Env → Default)
- Hot theme switching
- Multi-tenant support

### ✅ Admin Features
- Modern UI với cards
- Upload theme (.zip)
- Preview theme
- Activate/Delete themes
- Theme customizer

### ✅ Developer Features
- CLI script tạo theme
- Child theme inheritance
- Pages Router adapter
- Build-time validation
- TypeScript types

---

## 📖 Documentation

- **Full Docs**: `THEME_SYSTEM_DOCUMENTATION.md`
- **Quick Start**: `THEME_SYSTEM_QUICK_START.md`
- **Summary**: `THEME_SYSTEM_SUMMARY.md`
- **Enhancements**: `THEME_SYSTEM_ENHANCEMENTS.md`
- **Complete**: `THEME_SYSTEM_COMPLETE.md`

---

## 🔌 API Endpoints

### Themes Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/themes` | List all themes |
| POST | `/api/themes` | Activate theme |
| DELETE | `/api/themes?theme=name` | Delete theme |

### Theme Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/themes/upload` | Upload .zip file |

### Theme Preview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/themes/preview?theme=name` | Enable preview |
| DELETE | `/api/themes/preview` | Disable preview |

### Theme Customizer

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/themes/customizer?theme=name` | Get options |
| POST | `/api/themes/customizer` | Save options |

---

## 💡 Usage Examples

### Create New Theme

```bash
npx tsx scripts/create-theme.ts my-theme
```

### Upload Theme

```bash
# Via Admin UI or API
curl -X POST http://localhost:3000/api/themes/upload \
  -F "theme=@my-theme.zip"
```

### Activate Theme

```bash
curl -X POST http://localhost:3000/api/themes \
  -H "Content-Type: application/json" \
  -d '{"theme": "template1"}'
```

### Preview Theme

```bash
curl http://localhost:3000/api/themes/preview?theme=template1
# Visit http://localhost:3000 to see preview
```

---

## ⚙️ Configuration

### Environment Variables

`.env.local`:

```env
THEMES_DIR=templates
ACTIVE_THEME=default
DOMAIN_THEME_MAP={"domain1.com":"theme1"}
```

### Theme Priority

1. Preview theme (highest)
2. Domain-based theme
3. Cookie (`active_theme`)
4. Database
5. Environment variable
6. Default theme

---

## 🎨 Theme Structure

```
my-theme/
├── theme.json          # Required
├── pages/              # Required
│   ├── index.tsx      # Homepage
│   └── about.tsx
├── layout/             # Optional
│   └── default.tsx
├── components/         # Optional
└── public/             # Optional (assets)
```

---

## 🔧 Advanced Features

### Child Theme

```json
{
  "name": "Child Theme",
  "parent": "default"
}
```

### Theme Customizer

Access via Admin UI → Themes → Customizer tab

### Pages Router Support

Use `getServerSideProps`, `getStaticProps` in theme pages - automatically converted!

---

## ⚠️ Important Notes

1. **Homepage Route**: `app/page.tsx` takes priority over catch-all route
   - To use theme homepage, either:
     - Move current homepage logic to theme
     - Or modify `app/page.tsx` to check theme

2. **Dynamic Imports**: Uses `@/` alias - ensure tsconfig paths configured

3. **Build Time**: Theme pages can be pre-rendered using `generateThemeStaticParams()`

4. **Type Safety**: Full TypeScript support with types in `lib/theme/types.ts`

---

## 🐛 Troubleshooting

**Theme not loading?**
- Check `templates/<theme>/theme.json` exists
- Check `templates/<theme>/pages/index.tsx` exists
- Check console logs

**Upload fails?**
- Verify .zip contains `theme.json`
- Check file size (< 50MB)
- Check theme name is valid

**Routes 404?**
- Create page in `templates/<theme>/pages/`
- Check route path matches file path

---

## 📞 Support

Xem documentation files:
- `THEME_SYSTEM_DOCUMENTATION.md` - Complete guide
- `THEME_SYSTEM_ENHANCEMENTS.md` - All features

---

**🎉 Hệ thống hoàn chỉnh và sẵn sàng sử dụng!**

