# 📋 Sự khác biệt: `/admin/homepage` vs `/admin/homepage-settings`

## 🎯 Tóm tắt

**Có 2 trang khác nhau với mục đích khác nhau:**

### 1. `/admin/homepage` - **Homepage CMS (Cũ)**
- **Mục đích**: Quản lý các sections phức tạp của homepage
- **Sections**: Hero, Features, Promotion, Ticket, Tours, Certificates, Policies, Gallery, Map, Video, CTA, Posts
- **Database**: Sử dụng `HomepageHero`, `HomepageSection`, `HomepageTicket`, etc.
- **API**: `/api/admin/homepage`
- **Schema**: `homepageConfigSchema` (complex nested structure)

### 2. `/admin/homepage-settings` - **Home Settings (Mới)**
- **Mục đích**: Quản lý đơn giản Hero, About, CTA, SEO
- **Sections**: Hero, About, CTA, Featured Services, SEO
- **Database**: Sử dụng `HomepageSettings`, `HomepageSEO`, `Service`
- **API**: `/api/admin/homepage-settings`
- **Features**: Draft/Published workflow, Preview mode

---

## 📊 So sánh chi tiết

| Tính năng | `/admin/homepage` | `/admin/homepage-settings` |
|-----------|-------------------|----------------------------|
| Hero Section | ✅ Complex (title, subtitle, description, phone, address, CTA) | ✅ Simple (title, subtitle, background image) |
| About Section | ❌ Không có | ✅ Có (rich text editor + image) |
| CTA Section | ❌ Không có | ✅ Có (title, button text, link) |
| SEO Settings | ❌ Không có | ✅ Có (meta tags, OG image, keywords) |
| Featured Services | ❌ Không có | ✅ Có (select từ Service table) |
| Draft/Published | ❌ Không có | ✅ Có |
| Preview Mode | ❌ Không có | ✅ Có |
| Complex Sections | ✅ Có (13 tabs) | ❌ Không có |

---

## 💡 Nên dùng trang nào?

### Dùng `/admin/homepage` khi:
- Cần quản lý nhiều sections phức tạp
- Cần cấu hình Promotion, Ticket pricing, Tour pricing
- Cần quản lý Gallery, Map, Video sections

### Dùng `/admin/homepage-settings` khi:
- Chỉ cần quản lý Hero, About, CTA đơn giản
- Cần Draft/Published workflow
- Cần SEO settings cho homepage
- Cần quản lý Featured Services

---

## 🔄 Giải pháp đề xuất

### Option 1: Giữ cả 2 (Hiện tại)
- `/admin/homepage` - Cho content phức tạp
- `/admin/homepage-settings` - Cho settings đơn giản + SEO

### Option 2: Merge vào 1 trang
- Thêm tabs "Simple Settings" vào `/admin/homepage`
- Hoặc redirect `/admin/homepage` → `/admin/homepage-settings`

### Option 3: Đổi tên để rõ ràng
- `/admin/homepage` → `/admin/homepage-cms` (CMS phức tạp)
- `/admin/homepage-settings` → `/admin/homepage` (Settings đơn giản)

---

## ❓ Câu hỏi cho bạn

Bạn muốn:
1. **Giữ cả 2 trang** riêng biệt?
2. **Merge thành 1 trang** với nhiều tabs?
3. **Xóa trang cũ** và chỉ dùng trang mới?
4. **Đổi tên** để rõ ràng hơn?

---

**Hiện tại**: Cả 2 trang đều hoạt động và có mục đích khác nhau.

