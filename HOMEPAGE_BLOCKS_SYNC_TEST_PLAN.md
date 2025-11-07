# 📋 Test Plan: Đồng Bộ Homepage và Homepage-Blocks

**Date**: 2025-01-22  
**Status**: Ready for Testing

---

## 🎯 Mục Tiêu Test

Đảm bảo:
1. ✅ Sync Settings → Blocks không mất fields
2. ✅ Sync Blocks → Settings không mất fields
3. ✅ Priority logic hoạt động đúng
4. ✅ Thứ tự sections được đồng bộ đúng
5. ✅ UI hiển thị đúng trạng thái

---

## ✅ Test Cases

### Test 1: Sync Settings → Blocks

**Mục đích**: Verify tất cả fields được sync đầy đủ từ Settings sang Blocks

**Steps**:
1. Vào `/admin/homepage-settings`
2. Điền đầy đủ data cho tất cả sections (đặc biệt chú ý các fields mới thêm):
   - Hero: Điền `usps` array
   - About: Điền `imageId`
   - Ticket: Điền `pickupLocation`, `warningNote`, `imageUrl`
   - Tour Pricing: Điền `highlights`, `bottomNote`
   - Gallery: Điền `ecoFeatures`, `bottomText`
   - Homestay: Điền `cocoIslandCard`
   - Restaurant: Điền `eyebrow`, `imageId`
   - Pricing Snapshot: Điền `paymentInfo`
3. Lưu và publish Home Settings
4. Vào `/admin/homepage-blocks`
5. Click button "Mặc định" (Reset về mặc định)
6. Verify:
   - ✅ Tất cả blocks được tạo đúng
   - ✅ Fields được map đúng (không mất data)
   - ✅ Thứ tự blocks khớp với sectionOrder

**Expected Results**:
- Tất cả fields được sync đầy đủ
- Không mất data
- Thứ tự đúng

---

### Test 2: Sync Blocks → Settings

**Mục đích**: Verify blocks được sync về Settings đúng format

**Steps**:
1. Vào `/admin/homepage-blocks`
2. Sắp xếp blocks bằng drag & drop (nếu cần)
3. Edit một số blocks và thêm/chỉnh sửa fields
4. Click button "Đồng bộ về Home Settings"
5. Confirm dialog
6. Verify:
   - ✅ Settings được cập nhật
   - ✅ Tất cả fields được map đúng
   - ✅ Thứ tự sections đúng theo sortOrder của blocks
   - ✅ Status là DRAFT

**Expected Results**:
- Settings được sync đúng
- Fields không bị mất
- Thứ tự đúng

---

### Test 3: Priority Logic

**Mục đích**: Verify homepage hiển thị đúng data source theo priority

**Test 3.1: PUBLISHED Settings có ưu tiên**
1. Tạo PUBLISHED Home Settings với data A
2. Tạo Blocks với data B
3. Vào homepage (`/`)
4. Verify homepage hiển thị data A (từ PUBLISHED Settings)

**Test 3.2: Blocks hiển thị khi không có PUBLISHED**
1. Xóa hoặc chuyển PUBLISHED Settings về DRAFT
2. Tạo Blocks với data C
3. Vào homepage (`/`)
4. Verify homepage hiển thị data C (từ Blocks)

**Test 3.3: Fallback về DEFAULT_CONFIG**
1. Xóa cả PUBLISHED Settings và Blocks
2. Vào homepage (`/`)
3. Verify homepage hiển thị DEFAULT_CONFIG

**Expected Results**:
- Priority: PUBLISHED Settings > Blocks > Old CMS > DEFAULT_CONFIG
- Homepage hiển thị đúng data source

---

### Test 4: Warning Alert

**Mục đích**: Verify warning hiển thị đúng khi có PUBLISHED settings

**Steps**:
1. Tạo PUBLISHED Home Settings
2. Vào `/admin/homepage-blocks`
3. Verify:
   - ✅ Warning alert hiển thị màu đỏ
   - ✅ Message rõ ràng: "Cảnh báo: Hiện có Home Settings đã được PUBLISHED..."
4. Chuyển PUBLISHED Settings về DRAFT
5. Reload page
6. Verify warning alert không hiển thị

**Expected Results**:
- Warning hiển thị khi có PUBLISHED
- Warning biến mất khi không có PUBLISHED

---

### Test 5: Field Mapping Completeness

**Mục đích**: Verify tất cả fields được map đúng trong cả 2 chiều

**Test cho từng section**:

#### Hero Section
- [ ] `usps` được sync Settings → Blocks
- [ ] `usps` được sync Blocks → Settings
- [ ] Tất cả fields khác (eyebrow, mainTitle, subtitle, etc.)

#### About Section
- [ ] `imageId` được sync đúng
- [ ] `title`, `content`, `image` được sync đúng

#### Ticket Section
- [ ] `pickupLocation`, `warningNote`, `imageUrl` được sync đúng
- [ ] Tất cả fields khác

#### Tour Pricing Section
- [ ] `highlights`, `bottomNote` được sync đúng
- [ ] `tours` array được sync đúng

#### Gallery Section
- [ ] `ecoFeatures`, `bottomText` được sync đúng
- [ ] `images` array được sync đúng

#### Homestay Section
- [ ] `cocoIslandCard` được sync đúng
- [ ] `amenities`, `highlights` được sync đúng

#### Restaurant Section
- [ ] `eyebrow`, `imageId` được sync đúng
- [ ] Tất cả fields khác

#### Pricing Snapshot Section
- [ ] `paymentInfo` được sync đúng

---

### Test 6: Sort Order

**Mục đích**: Verify thứ tự blocks được đồng bộ đúng

**Steps**:
1. Vào `/admin/homepage-blocks`
2. Drag & drop để sắp xếp lại thứ tự blocks
3. Verify sortOrder được cập nhật trong database
4. Sync về Settings
5. Verify sections trong Settings được sắp xếp theo thứ tự mới
6. Sync lại Settings → Blocks
7. Verify blocks giữ nguyên thứ tự mới

**Expected Results**:
- SortOrder được cập nhật đúng
- Sync giữ nguyên thứ tự

---

### Test 7: Error Handling

**Mục đích**: Verify error handling hoạt động đúng

**Test 7.1: Sync khi không có data**
1. Xóa tất cả blocks
2. Click "Mặc định" (sync Settings → Blocks)
3. Verify không có error, blocks được tạo

**Test 7.2: Sync khi có invalid data**
1. Tạo block với invalid fields
2. Sync về Settings
3. Verify error được hiển thị rõ ràng

**Expected Results**:
- Error messages rõ ràng
- Không crash application

---

## 📊 Test Matrix

| Test Case | Priority | Status | Notes |
|-----------|----------|--------|-------|
| Test 1: Sync Settings → Blocks | High | ⏳ Pending | |
| Test 2: Sync Blocks → Settings | High | ⏳ Pending | |
| Test 3: Priority Logic | High | ⏳ Pending | |
| Test 4: Warning Alert | Medium | ⏳ Pending | |
| Test 5: Field Mapping | High | ⏳ Pending | |
| Test 6: Sort Order | Medium | ⏳ Pending | |
| Test 7: Error Handling | Medium | ⏳ Pending | |

---

## 🔍 Checklist Test

### Pre-Test
- [ ] Database đã được setup
- [ ] Có data mẫu trong Home Settings
- [ ] Có data mẫu trong Blocks
- [ ] Browser console mở để check errors

### During Test
- [ ] Check browser console không có errors
- [ ] Check network requests thành công
- [ ] Verify data trong database sau mỗi sync
- [ ] Screenshot khi có issues

### Post-Test
- [ ] Document kết quả
- [ ] Report bugs (nếu có)
- [ ] Update status trong test matrix

---

## 🐛 Known Issues

None (chưa test)

---

## ✅ Success Criteria

Tất cả test cases pass:
- ✅ Sync 2 chiều không mất fields
- ✅ Priority logic hoạt động đúng
- ✅ UI hiển thị đúng
- ✅ Error handling tốt
- ✅ Performance acceptable

---

**Next Steps**: Bắt đầu test theo test plan trên



