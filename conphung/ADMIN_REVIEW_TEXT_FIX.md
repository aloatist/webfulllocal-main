# Sửa Text Overflow Trong Admin Reviews

## Vấn đề

Phần phản hồi đánh giá trong trang admin bị tràn ra ngoài layout khi text quá dài (URL, text liền không có space).

## Giải pháp

### 1. Thêm Word Break cho Text Hiển Thị

**File:** `/app/admin/reviews/page.tsx`

#### A. Comment của User trong Table

**Trước:**
```tsx
<div className="line-clamp-2 text-sm">
  {review.comment || <span>Không có nội dung</span>}
</div>
```

**Sau:**
```tsx
<div className="line-clamp-2 text-sm break-words overflow-wrap-anywhere">
  {review.comment || <span>Không có nội dung</span>}
</div>
```

#### B. Admin Response trong Table

**Trước:**
```tsx
<span className="text-blue-600 dark:text-blue-400">
  {review.adminResponse}
</span>
```

**Sau:**
```tsx
<span className="text-blue-600 dark:text-blue-400 break-words overflow-wrap-anywhere">
  {review.adminResponse}
</span>
```

#### C. Comment trong Dialog (Modal)

**Trước:**
```tsx
<p className="text-sm">{selectedReview.comment}</p>
```

**Sau:**
```tsx
<p className="text-sm break-words overflow-wrap-anywhere whitespace-pre-wrap">
  {selectedReview.comment}
</p>
```

### 2. Giới Hạn 500 Từ cho Admin Response

#### A. Word Counter Function

```typescript
const countWords = (text: string) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};
const responseWordCount = countWords(response);
const MAX_RESPONSE_WORDS = 500;
```

#### B. Real-time Display

```tsx
<div className="flex items-center justify-between">
  <label className="text-sm font-medium">Phản hồi của bạn</label>
  <span className={`text-xs font-medium ${
    responseWordCount > MAX_RESPONSE_WORDS 
      ? 'text-destructive'           // Đỏ
      : responseWordCount > MAX_RESPONSE_WORDS * 0.9 
        ? 'text-orange-500'          // Cam (>450 từ)
        : 'text-muted-foreground'    // Xám
  }`}>
    {responseWordCount} / {MAX_RESPONSE_WORDS} từ
  </span>
</div>
```

#### C. Validation

```typescript
const handleSubmitResponse = async () => {
  if (!selectedReview) return;
  
  if (responseWordCount > MAX_RESPONSE_WORDS) {
    alert(`Phản hồi quá dài! Vui lòng giới hạn trong ${MAX_RESPONSE_WORDS} từ (hiện tại: ${responseWordCount} từ)`);
    return;
  }
  
  // ... submit logic
};
```

#### D. Visual Feedback

```tsx
<Textarea
  value={response}
  onChange={(e) => setResponse(e.target.value)}
  className={responseWordCount > MAX_RESPONSE_WORDS ? 'border-destructive focus-visible:ring-destructive' : ''}
/>

{responseWordCount > MAX_RESPONSE_WORDS && (
  <p className="text-xs text-destructive font-medium">
    Vượt quá {responseWordCount - MAX_RESPONSE_WORDS} từ!
  </p>
)}
```

## UI States

### Normal (0-450 từ)
```
┌─────────────────────────────────────┐
│ Phản hồi của bạn    200 / 500 từ   │ ← Xám
├─────────────────────────────────────┤
│ [Textarea]                          │
└─────────────────────────────────────┘
```

### Warning (451-499 từ)
```
┌─────────────────────────────────────┐
│ Phản hồi của bạn    480 / 500 từ   │ ← Cam
├─────────────────────────────────────┤
│ [Textarea]                          │
└─────────────────────────────────────┘
```

### Error (>500 từ)
```
┌─────────────────────────────────────┐
│ Phản hồi của bạn    550 / 500 từ   │ ← Đỏ
├─────────────────────────────────────┤
│ [Textarea - border đỏ]              │
│ Vượt quá 50 từ!                     │
└─────────────────────────────────────┘
```

## Vị Trí Áp Dụng

### 1. Table View (Danh sách reviews)

**Comment của user:**
- ✅ `break-words overflow-wrap-anywhere`
- ✅ `line-clamp-2` (giới hạn 2 dòng)

**Admin response:**
- ✅ `break-words overflow-wrap-anywhere`
- ✅ Hiển thị trong box màu xanh

### 2. Dialog Modal (Popup phản hồi)

**Comment của user (readonly):**
- ✅ `break-words overflow-wrap-anywhere`
- ✅ `whitespace-pre-wrap` (giữ line breaks)

**Admin response input:**
- ✅ Word counter với color coding
- ✅ Validation 500 từ
- ✅ Visual feedback (border, warning)

## So Sánh Giới Hạn

| Loại | Giới hạn | Lý do |
|------|----------|-------|
| **User Review** | 1000 từ | Review chi tiết, trải nghiệm đầy đủ |
| **Admin Response** | 500 từ | Phản hồi ngắn gọn, chuyên nghiệp |

## Lợi Ích

### Trước
- ❌ URL dài phá vỡ table layout
- ❌ Admin response tràn ra ngoài
- ❌ Không giới hạn độ dài phản hồi
- ❌ Có thể gửi response quá dài

### Sau
- ✅ Text tự động xuống hàng
- ✅ Layout luôn đẹp, không bị vỡ
- ✅ Giới hạn 500 từ rõ ràng
- ✅ Real-time feedback khi gõ
- ✅ Không thể submit nếu quá dài

## Testing

### Test Cases

1. **Text dài không space**
   ```
   Input: https://verylongdomainname.com/very/long/path
   Expected: Tự động xuống hàng
   ```

2. **Word counter**
   ```
   Input: 250 từ → Xám
   Input: 480 từ → Cam
   Input: 550 từ → Đỏ + warning
   ```

3. **Validation**
   ```
   Input: 500 từ → OK, có thể submit
   Input: 501 từ → Alert, không submit được
   ```

4. **Visual feedback**
   ```
   >500 từ → Border đỏ + text "Vượt quá X từ!"
   ```

## Files Changed

✅ `/app/admin/reviews/page.tsx`
- Added word-break to comment display (table)
- Added word-break to admin response display (table)
- Added word-break to comment display (dialog)
- Added word counter for admin response
- Added validation (500 words max)
- Added visual feedback (colors, border, warning)

## Notes

- Admin response giới hạn 500 từ (ngắn hơn user review 1000 từ)
- Word counter chỉ đếm từ có nghĩa (bỏ qua spaces)
- Validation là client-side (nên thêm server-side validation)
- Color coding: Xám → Cam (>450) → Đỏ (>500)
- Không block typing, chỉ block submit

## Khởi động lại

```bash
cd /Users/congtrinh/webfulllocal-main
./dev-start.sh
```

Sau đó test tại: http://localhost:3000/admin/reviews
