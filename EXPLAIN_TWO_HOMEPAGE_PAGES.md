# 📋 Giải thích: 2 Trang Homepage Admin

## ❓ Tại sao có 2 trang?

### Trang 1: `/admin/homepage` - **Trang chủ CMS (Cũ)**
- **Đã tồn tại từ trước**
- Quản lý **13 sections phức tạp**: Hero, Features, Promotion, Ticket, Tours, Certificates, Policies, Gallery, Map, Video, CTA, Posts
- Sử dụng nhiều database models: `HomepageHero`, `HomepageTicket`, `HomepageTour`, etc.
- **Phù hợp cho**: Quản lý content phức tạp, nhiều sections

### Trang 2: `/admin/homepage-settings` - **Home Settings (Mới)**
- **Vừa được tạo** theo yêu cầu của bạn
- Quản lý **5 sections đơn giản**: Hero, About, CTA, Featured Services, SEO
- Sử dụng database models mới: `HomepageSettings`, `HomepageSEO`, `Service`
- **Phù hợp cho**: Settings đơn giản, Draft/Published workflow, SEO

---

## 🎯 Sự khác biệt chính

| Tính năng | `/admin/homepage` | `/admin/homepage-settings` |
|-----------|-------------------|----------------------------|
| **Số sections** | 13 tabs | 5 tabs |
| **Hero** | Phức tạp (phone, address, hours) | Đơn giản (title, subtitle, image) |
| **About** | ❌ Không có | ✅ Có (rich text editor) |
| **CTA** | CTA Booking (phức tạp) | CTA đơn giản (title, button) |
| **SEO** | ❌ Không có | ✅ Có đầy đủ |
| **Featured Services** | ❌ Không có | ✅ Có |
| **Draft/Published** | ❌ Không có | ✅ Có |
| **Preview Mode** | ❌ Không có | ✅ Có |

---

## 💡 Nên dùng trang nào?

### **Dùng `/admin/homepage`** khi:
- ✅ Cần quản lý Promotion, Ticket pricing
- ✅ Cần quản lý Tour pricing section
- ✅ Cần Gallery, Map, Video sections
- ✅ Đã có data cũ trong database

### **Dùng `/admin/homepage-settings`** khi:
- ✅ Chỉ cần Hero, About, CTA đơn giản
- ✅ Cần SEO settings
- ✅ Cần Draft/Published workflow
- ✅ Cần Featured Services từ Service table
- ✅ Muốn interface đơn giản hơn

---

## 🔧 Giải pháp đề xuất

### Option 1: Giữ cả 2 (Khuyến nghị)
- **Trang cũ** (`/admin/homepage`) cho content phức tạp
- **Trang mới** (`/admin/homepage-settings`) cho settings đơn giản + SEO

### Option 2: Merge thành 1
- Thêm tab "Simple Settings" vào trang cũ
- Hoặc thêm sections phức tạp vào trang mới

### Option 3: Đổi tên để rõ ràng
```
/admin/homepage → /admin/homepage-cms (CMS phức tạp)
/admin/homepage-settings → /admin/homepage (Settings chính)
```

### Option 4: Xóa trang cũ
- Chỉ giữ `/admin/homepage-settings`
- Migrate data cũ nếu cần

---

## 📍 Vị trí trong Sidebar

### Hiện tại trong Sidebar:
```
Hệ thống ▼
  ├── 🏠 Trang chủ CMS (Cũ) → /admin/homepage
  ├── ⚙️ Home Settings (Mới) [NEW] → /admin/homepage-settings
  ├── Điều hướng
  ├── ⚙️ Thiết lập
  ├── 🔐 Environment Vars
  └── Quản lý Users
```

**Lưu ý**: Section "Hệ thống" có thể đang **đóng** (collapsed). Click vào "Hệ thống" để mở rộng và thấy "⚙️ Home Settings (Mới)".

---

## 🔄 Cách kiểm tra Sidebar

1. **Vào `/admin`**
2. **Tìm section "Hệ thống"** ở sidebar trái
3. **Click vào "Hệ thống"** để mở rộng (nếu đang đóng)
4. **Tìm "⚙️ Home Settings (Mới)"** với badge "NEW"
5. **Click để mở** `/admin/homepage-settings`

---

## ✅ Nếu vẫn không thấy

1. **Hard refresh browser**: `Ctrl+Shift+R` hoặc `Cmd+Shift+R`
2. **Restart dev server**:
   ```bash
   cd conphung
   npm run dev
   ```
3. **Kiểm tra Console** (F12) xem có lỗi JavaScript không
4. **Thử direct URL**: `http://localhost:3000/admin/homepage-settings`

---

**Quyết định**: Bạn muốn giữ cả 2 trang hay merge/xóa một trong hai?

