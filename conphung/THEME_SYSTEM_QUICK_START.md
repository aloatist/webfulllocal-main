# 🚀 Quick Start - Theme System

Hướng dẫn nhanh để bắt đầu với hệ thống multi-theme.

## ⚡ Setup Trong 5 Phút

### 1. Kiểm Tra Cấu Trúc

Đảm bảo có thư mục:
```
templates/
├── default/
└── template1/
```

### 2. Test Theme System

```bash
# List themes
curl http://localhost:3000/api/themes

# Activate template1
curl -X POST http://localhost:3000/api/themes \
  -H "Content-Type: application/json" \
  -d '{"theme": "template1"}'
```

### 3. Truy Cập Pages

- Homepage: `http://localhost:3000/`
- About: `http://localhost:3000/about`

---

## 📝 Tạo Theme Mới

```bash
npx tsx scripts/create-theme.ts my-theme
```

Sau đó:
1. Edit `templates/my-theme/pages/index.tsx`
2. Activate: `POST /api/themes {"theme": "my-theme"}`
3. Done! ✅

---

## 🎯 Common Tasks

### Switch Theme

```bash
curl -X POST http://localhost:3000/api/themes \
  -H "Content-Type: application/json" \
  -d '{"theme": "template1"}'
```

### List All Themes

```bash
curl http://localhost:3000/api/themes
```

### Delete Theme

```bash
curl -X DELETE "http://localhost:3000/api/themes?theme=template1"
```

---

## 🔧 Configuration

Thêm vào `.env.local` (optional):

```env
THEMES_DIR=templates
ACTIVE_THEME=default
```

---

## ❓ Troubleshooting

**Theme không load?**
- Check: `templates/<theme>/theme.json` exists
- Check: `templates/<theme>/pages/index.tsx` exists

**Route 404?**
- Create page in `templates/<theme>/pages/`

**Tailwind không work?**
- Check `tailwind.config.ts` có `"./templates/**/*.{ts,tsx}"`

---

Xem full documentation: `THEME_SYSTEM_DOCUMENTATION.md`

