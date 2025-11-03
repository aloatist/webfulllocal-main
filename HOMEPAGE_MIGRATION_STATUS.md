# ✅ Homepage Migration - Status

## 📊 Trạng thái hiện tại

### ✅ ĐÃ HOÀN THÀNH

1. **Auto-load từ HomepageSection** ✅
   - API `/api/admin/homepage-settings-unified` tự động load từ `HomepageSection` (old CMS)
   - Fallback về `DEFAULT_CONFIG` nếu không có data trong DB
   - `DEFAULT_CONFIG` chứa dữ liệu mẫu từ homepage hiện tại

2. **Manual Migration Endpoint** ✅
   - API: `/api/admin/homepage-settings/migrate` (POST)
   - Button "Migrate Data" trong admin page
   - Migrate data từ `DEFAULT_CONFIG` hoặc `HomepageSection` vào `HomepageSettings`

3. **UI Integration** ✅
   - Button "Migrate Data" ở header
   - Alert hướng dẫn: "Chưa có data? Click 'Migrate Data' để tải dữ liệu từ homepage hiện tại"

---

## 🔧 Cách hoạt động

### Option 1: Auto-load (hiện tại)
1. Vào `/admin/homepage-settings`
2. Data tự động load từ:
   - `HomepageSettings.sections` (unified JSON) nếu có
   - Hoặc `HomepageSection` (old CMS) nếu có
   - Hoặc `DEFAULT_CONFIG` (hard-coded từ `sections.ts`) nếu không có

### Option 2: Manual Migration
1. Vào `/admin/homepage-settings`
2. Click button **"Migrate Data"**
3. System sẽ:
   - Load `DEFAULT_CONFIG` từ `sections.ts` (chứa data từ homepage hiện tại)
   - Hoặc merge với existing data từ `HomepageSection`
   - Save vào `HomepageSettings.sections`
   - Auto-reload để hiển thị data mới

---

## 📋 DEFAULT_CONFIG Contents

File: `lib/homepage/sections.ts`

Chứa dữ liệu mẫu từ homepage hiện tại:
- ✅ Hero section (title, subtitle, phone, address, etc.)
- ✅ Features (3 items)
- ✅ Certificates (3 certificates với images)
- ✅ Policy Links (4 links)
- ✅ Latest Posts config
- ✅ Và nhiều sections khác...

**Note**: `DEFAULT_CONFIG` được **export** để có thể import trong migration API.

---

## 🎯 Workflow Migration

```
User clicks "Migrate Data"
    ↓
POST /api/admin/homepage-settings/migrate
    ↓
Load DEFAULT_CONFIG (from sections.ts)
    ↓
Merge with existing HomepageSection data (if any)
    ↓
Validate với schema
    ↓
Save vào HomepageSettings.sections
    ↓
Also save vào HomepageSection (backward compatible)
    ↓
Return success
    ↓
Auto-reload page để hiển thị data
```

---

## ✅ Kết luận

**ĐÃ HOÀN THÀNH** ✅

- ✅ Auto-load từ homepage existing data
- ✅ Manual migration button
- ✅ DEFAULT_CONFIG exported và ready
- ✅ UI hướng dẫn user

**User có thể:**
1. Vào `/admin/homepage-settings` → Data tự động load từ homepage
2. Hoặc click "Migrate Data" để manually migrate từ `DEFAULT_CONFIG`

---

## 🔍 Test

1. Vào `/admin/homepage-settings`
2. Nếu không có data → Click "Migrate Data"
3. Verify data hiển thị đầy đủ trong các tabs
4. Edit và save → Data được lưu vào DB

---

**Status**: ✅ **MIGRATION FEATURE COMPLETE**


