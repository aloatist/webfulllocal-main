# 🔧 Fix: Homepage Blocks Thứ Tự Không Cập Nhật

**Date**: 2025-01-22  
**Status**: ✅ **FIXED**

---

## 🐛 Vấn Đề

User báo: Khi quản lý homepage-blocks, đã thay đổi vị trí và lưu được, nhưng homepage chưa thay đổi vị trí.

---

## 🔍 Nguyên Nhân

### 1. Logic Priority Check DRAFT Settings
**File**: `conphung/app/page.tsx`

**Vấn đề**: Code cũ check cả DRAFT settings, nên nếu có DRAFT settings thì blocks không được dùng:
```typescript
// Code cũ - SAI
const draftSettings = process.env.NODE_ENV === 'development' && !publishedSettings
  ? await prisma.homepageSettings.findFirst({
      where: { status: 'DRAFT' },
      orderBy: { updatedAt: 'desc' },
    })
  : null;

const activeSettings = publishedSettings || draftSettings;
const hasPublishedSettings = activeSettings?.sections && typeof activeSettings.sections === 'object';
```

**Kết quả**: Nếu có DRAFT settings, `hasPublishedSettings` = true → blocks không được render.

### 2. Blocks Không Được Sort Đảm Bảo
**File**: `conphung/components/blocks/BlocksRenderer.tsx`

**Vấn đề**: Blocks được sort trong query nhưng không có double-check trong render.

---

## ✅ Giải Pháp

### 1. Sửa Logic Priority Check
**File**: `conphung/app/page.tsx`

**Thay đổi**:
- Chỉ check PUBLISHED settings khi quyết định có dùng blocks
- DRAFT settings KHÔNG block blocks từ being used
- Điều này cho phép user dùng blocks system ngay cả khi có DRAFT settings

```typescript
// Code mới - ĐÚNG
const publishedSettings = await prisma.homepageSettings.findFirst({
  where: { status: 'PUBLISHED' },
  orderBy: { updatedAt: 'desc' },
});

// Check if PUBLISHED settings exist and have sections
const hasPublishedSettings = publishedSettings?.sections && typeof publishedSettings.sections === 'object';

// IMPORTANT: Only PUBLISHED settings block blocks. DRAFT settings do NOT block blocks.
const useBlocks = !hasPublishedSettings && blocks.length > 0;
```

### 2. Đảm Bảo Blocks Được Sort Đúng
**File**: `conphung/components/blocks/BlocksRenderer.tsx`

**Thay đổi**:
- Thêm double-check sort trong render để đảm bảo thứ tự đúng

```typescript
// Ensure blocks are sorted by sortOrder (should already be sorted from query, but double-check)
const sortedBlocks = [...blocks].sort((a, b) => a.sortOrder - b.sortOrder);

return (
  <>
    {sortedBlocks.map((block) => {
      // ...
    })}
  </>
);
```

### 3. Cải Thiện Debug Logging
**File**: `conphung/app/page.tsx`

**Thay đổi**:
- Thêm log `blocksSortOrder` để debug dễ dàng hơn

---

## 📊 Kết Quả

### Trước
- ❌ Có DRAFT settings → blocks không được render
- ❌ Thứ tự blocks không cập nhật trên homepage
- ❌ User không biết tại sao

### Sau
- ✅ Chỉ PUBLISHED settings block blocks
- ✅ DRAFT settings không block blocks
- ✅ Blocks được sort đúng theo sortOrder
- ✅ Thứ tự blocks cập nhật ngay trên homepage
- ✅ Debug logging rõ ràng hơn

---

## 🎯 Priority Logic (Updated)

**Mới**: 
1. **HomepageSettings.sections (PUBLISHED)** - Ưu tiên cao nhất, block blocks
2. **HomepageBlock** (ACTIVE, sortOrder asc) - Nếu không có PUBLISHED
3. **HomepageSection** (old CMS) - Fallback
4. **DEFAULT_CONFIG** - Default fallback

**Lưu ý**: 
- DRAFT settings KHÔNG block blocks
- User có thể dùng blocks system ngay cả khi có DRAFT settings
- Chỉ PUBLISHED settings mới block blocks

---

## ✅ Testing

### Test Case 1: Blocks với DRAFT Settings
1. Tạo DRAFT Home Settings
2. Tạo và sắp xếp blocks
3. Vào homepage
4. **Expected**: Blocks được hiển thị với thứ tự đúng

### Test Case 2: Blocks với PUBLISHED Settings
1. Tạo PUBLISHED Home Settings
2. Tạo và sắp xếp blocks
3. Vào homepage
4. **Expected**: Settings được hiển thị (blocks bị block)

### Test Case 3: Drag & Drop Blocks
1. Vào `/admin/homepage-blocks`
2. Drag & drop để sắp xếp lại blocks
3. Vào homepage
4. **Expected**: Thứ tự blocks trên homepage khớp với thứ tự mới

---

## 📝 Files Đã Sửa

1. `conphung/app/page.tsx`
   - Sửa logic check PUBLISHED settings (chỉ check PUBLISHED, không check DRAFT)
   - Cải thiện debug logging

2. `conphung/components/blocks/BlocksRenderer.tsx`
   - Thêm double-check sort để đảm bảo thứ tự đúng

---

**Status**: ✅ **FIXED - READY FOR TESTING**


