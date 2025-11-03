# 🔍 Route Troubleshooting - Home Settings

## Problem
Chỉ thấy `/admin/homepage` nhưng không thấy `/admin/homepage-settings`

## ✅ Verification Steps

### 1. Check File Exists
```bash
cd conphung
ls -la app/admin/homepage-settings/page.tsx
```
**Expected**: File should exist and have content

### 2. Check Export
```bash
grep "export default" app/admin/homepage-settings/page.tsx
```
**Expected**: Should find `export default function HomepageSettingsPage()`

### 3. Test Route Directly
Open in browser:
```
http://localhost:3000/admin/homepage-settings
```

### 4. Check Test Route
If main route doesn't work, test:
```
http://localhost:3000/admin/homepage-settings/test
```
If this works, the routing is fine but main page has an error.

---

## 🛠️ Solutions

### Solution 1: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
cd conphung
npm run dev
```
**Why**: Next.js needs to rebuild route manifest

### Solution 2: Clear Next.js Cache
```bash
cd conphung
rm -rf .next
npm run dev
```
**Why**: Stale cache might prevent route discovery

### Solution 3: Check Browser Console
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab - is the route returning 404 or 500?

### Solution 4: Check Component Imports
Verify all components exist:
- `HeroSectionEditor` ✅
- `AboutSectionEditor` ✅
- `CTASectionEditor` ✅
- `SEOSectionEditor` ✅
- `FeaturedServicesEditor` ✅
- `ImageUpload` ✅

---

## 📋 Quick Checklist

- [ ] File exists: `app/admin/homepage-settings/page.tsx`
- [ ] Has `export default`
- [ ] All imports resolve correctly
- [ ] Dev server restarted
- [ ] No console errors
- [ ] Route appears in sidebar navigation
- [ ] Direct URL access works

---

## 🎯 Access Methods

1. **Sidebar**: "Hệ thống" → "⚙️ Home Settings"
2. **Dashboard Card**: Content Stats → Home Settings → "Cấu hình →"
3. **Quick Action**: "Cấu hình trang chủ" button
4. **Direct URL**: `/admin/homepage-settings`

---

## 🔧 If Still Not Working

1. **Check API Route**:
   ```bash
   curl http://localhost:3000/api/admin/homepage-settings
   ```
   Should return JSON (may need auth)

2. **Check Middleware**:
   Verify `middleware.ts` allows `/admin/homepage-settings`

3. **Check Layout**:
   Verify `app/admin/layout.tsx` renders children correctly

4. **Create Simple Test**:
   Temporarily replace page.tsx with:
   ```tsx
   export default function Test() {
     return <div>Home Settings Test</div>;
   }
   ```
   If this works, there's an error in original code.

---

**Status**: Route should work after dev server restart! 🔄

