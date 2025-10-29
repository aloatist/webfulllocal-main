# ✅ Fix Lỗi Decimal Overflow - Nhanh

## ❌ Lỗi

```
numeric field overflow
A field with precision 10, scale 2 must round to an absolute value less than 10^8
```

**Nghĩa là:** Bạn nhập giá quá lớn!

---

## 💡 Giới hạn

**`Decimal(10, 2)` = Max 99,999,999 VND (~ 100 triệu)**

**Ví dụ:**
- ✅ OK: 1,000,000 (1 triệu)
- ✅ OK: 50,000,000 (50 triệu)
- ✅ OK: 99,999,999 (99 triệu)
- ❌ FAIL: 100,000,000 (100 triệu)
- ❌ FAIL: 1,000,000,000 (1 tỷ)

---

## 🛠️ Fix đã áp dụng

**File:** `/conphung/lib/tours/schemas.ts`

**Thêm validation:**
```typescript
const MAX_DECIMAL_VALUE = 99999999.99

if (Math.abs(parsed) >= MAX_DECIMAL_VALUE) {
  throw new Error(
    `Giá trị ${parsed.toLocaleString('vi-VN')} vượt quá giới hạn cho phép. ` +
    `Vui lòng nhập số nhỏ hơn 100 triệu.`
  )
}
```

---

## 🧪 Test

1. **Refresh browser** (Ctrl+Shift+R)

2. **Tạo tour với giá hợp lệ:**
   - Giá: 1,000,000
   - ✅ Success

3. **Tạo tour với giá quá lớn:**
   - Giá: 100,000,000
   - ❌ Error: "Giá trị 100,000,000 vượt quá giới hạn..."

---

## 📊 Các field bị ảnh hưởng

- Tour: `basePrice` (Giá cơ bản)
- Departure: `priceAdult`, `priceChild`, `priceInfant`
- Addon: `price`
- Promotion: `discountValue`, `maxDiscount`

**Tất cả max: 99,999,999 VND**

---

## 💡 Giải pháp nếu cần giá cao hơn

### Option 1: Dùng đơn vị lớn hơn
```
Thay vì: 1,000,000,000 VND
Dùng: 1,000 (nghìn VND) hoặc 1 (triệu VND)
```

### Option 2: Chia nhỏ
```
Tour 1 tỷ → Chia thành 2 tours 500 triệu
```

### Option 3: Liên hệ admin
```
Yêu cầu tăng giới hạn database
```

---

## ✅ Status

**Validation:** ✅ ADDED  
**Error Message:** ✅ TIẾNG VIỆT  
**Max Value:** 99,999,999 VND  

**Refresh browser để thấy thay đổi!** 🎯
