# 🧪 Test Guide - Create & Delete Homestay

**Date**: October 21, 2025, 10:52 PM  
**Purpose**: Verify create/delete operations update list correctly

---

## 🎯 Test Scenarios

### Test 1: Create Homestay - Should Appear Immediately ✅

**Steps:**
1. Open browser console (F12)
2. Navigate to: `http://localhost:3000/admin/homestays`
3. Note current number of homestays
4. Click "Tạo homestay"
5. Fill in form:
   ```
   Title: Test Villa [Timestamp]
   Slug: test-villa-[random]
   City: Đà Nẵng
   Base Price: 1000000
   ```
6. Click "Tạo homestay"

**Expected Results:**
```
✅ Console shows: "✅ Created homestay: [id]"
✅ Redirects to: /admin/homestays?_t=[timestamp]
✅ New homestay appears in list immediately
✅ No manual refresh needed
✅ Page reloads automatically
```

**If Failed:**
- Check console for errors
- Verify API response (Network tab)
- Check if timestamp param is added to URL
- Verify router.refresh() is called

---

### Test 2: Delete Homestay - Should Disappear Immediately ✅

**Steps:**
1. Open browser console (F12)
2. Navigate to: `http://localhost:3000/admin/homestays`
3. Note a homestay to delete
4. Click "Xóa" button
5. Confirm deletion in popup

**Expected Results:**
```
✅ Console shows: "✅ Deleted homestay: [id]"
✅ Homestay disappears from list immediately
✅ Page reloads after 500ms
✅ Homestay still gone after reload
✅ No errors in console
```

**If Failed:**
- Check console for errors
- Verify DELETE API call (Network tab)
- Check if local state updates
- Verify page reload happens

---

## 🔍 Debugging

### Console Logs to Watch For

**Create Success:**
```javascript
✅ Created homestay: cmh0xxx...
```

**Delete Success:**
```javascript
✅ Deleted homestay: cmh0xxx...
```

**Delete Already Gone:**
```javascript
⚠️ Homestay already deleted: cmh0xxx...
```

### Network Tab

**Create Request:**
```
POST /api/homestays
Status: 201 Created
Response: { id: "...", ... }
```

**Delete Request:**
```
DELETE /api/homestays/[id]
Status: 200 OK
```

---

## 🎨 Visual Feedback

### Create Flow

```
1. Click "Tạo homestay"
   ↓
2. Fill form
   ↓
3. Click submit
   ↓
4. [Saving...] button disabled
   ↓
5. Redirect to list (URL has ?_t=timestamp)
   ↓
6. List reloads
   ↓
7. ✅ New item appears at top
```

### Delete Flow

```
1. Click "Xóa"
   ↓
2. Confirm popup
   ↓
3. Button shows "Đang xóa..."
   ↓
4. Item disappears immediately
   ↓
5. Wait 500ms
   ↓
6. Page reloads
   ↓
7. ✅ Item still gone
```

---

## 🐛 Common Issues

### Issue 1: Create - Item Not Appearing

**Symptoms:**
- Form submits successfully
- Redirects to list
- But item not visible

**Debug:**
```javascript
// Check console
✅ Created homestay: [id]  // Should see this

// Check URL
/admin/homestays?_t=1729531200000  // Should have timestamp

// Check Network
POST /api/homestays → 201  // Should be 201
```

**Solutions:**
- Hard refresh (Cmd+Shift+R)
- Clear browser cache
- Check if API actually created item (Prisma Studio)
- Verify timestamp is added to URL

---

### Issue 2: Delete - Item Still Visible

**Symptoms:**
- Delete confirms
- But item still in list

**Debug:**
```javascript
// Check console
✅ Deleted homestay: [id]  // Should see this

// Check Network
DELETE /api/homestays/[id] → 200  // Should be 200
```

**Solutions:**
- Wait for 500ms reload
- Check if item is in Prisma Studio
- Verify local state update
- Check for JavaScript errors

---

### Issue 3: Multiple Rapid Operations

**Symptoms:**
- Create/delete multiple items quickly
- List gets out of sync

**Solution:**
- Wait for each operation to complete
- Don't spam create/delete buttons
- Let page reload finish

---

## ✅ Success Criteria

### Create Test Passes If:
- ✅ Console log appears
- ✅ URL has timestamp param
- ✅ Item appears in list
- ✅ No errors
- ✅ Page reloads automatically

### Delete Test Passes If:
- ✅ Console log appears
- ✅ Item disappears immediately
- ✅ Page reloads after 500ms
- ✅ Item still gone after reload
- ✅ No errors

---

## 📊 Test Results Template

```markdown
## Test Results - [Date/Time]

### Test 1: Create Homestay
- Console log: [ ] Pass / [ ] Fail
- URL timestamp: [ ] Pass / [ ] Fail
- Item appears: [ ] Pass / [ ] Fail
- Auto reload: [ ] Pass / [ ] Fail
- **Overall**: [ ] PASS / [ ] FAIL

### Test 2: Delete Homestay
- Console log: [ ] Pass / [ ] Fail
- Immediate removal: [ ] Pass / [ ] Fail
- Page reload: [ ] Pass / [ ] Fail
- Still gone: [ ] Pass / [ ] Fail
- **Overall**: [ ] PASS / [ ] FAIL

### Notes:
[Any issues or observations]
```

---

## 🚀 Quick Test Commands

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
open http://localhost:3000/admin/homestays

# 3. Open console (F12)

# 4. Run tests above

# 5. Check Prisma Studio to verify
npx prisma studio
```

---

## 📝 Implementation Details

### Create Flow
```typescript
// 1. Submit form
const response = await fetch('/api/homestays', { method: 'POST', ... });

// 2. Get result
const result = await response.json();
console.log('✅ Created homestay:', result.id);

// 3. Force reload with cache bypass
const timestamp = Date.now();
router.replace(`/admin/homestays?_t=${timestamp}`);

// 4. Refresh after navigation
setTimeout(() => router.refresh(), 100);
```

### Delete Flow
```typescript
// 1. Call delete API
const res = await fetch(`/api/homestays/${id}`, { method: 'DELETE' });

// 2. Log result
console.log('✅ Deleted homestay:', id);

// 3. Update local state immediately
setRows((prev) => prev.filter((item) => item.id !== id));

// 4. Force reload for consistency
setTimeout(() => window.location.reload(), 500);
```

---

**Last Updated**: October 21, 2025, 10:52 PM  
**Status**: Ready for testing
