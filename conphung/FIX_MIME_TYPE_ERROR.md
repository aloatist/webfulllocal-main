# Fix MIME Type Error - Static Files Not Loading

## Vấn đề
Browser báo lỗi:
- `Refused to apply style from '...css' because its MIME type ('text/html') is not a supported stylesheet MIME type`
- `Failed to load resource: the server responded with a status of 400 (Bad Request)`
- `Refused to execute script from '...js' because its MIME type ('text/html') is not executable`

## Nguyên nhân
1. **Browser đang cache HTML cũ** với links đến static files có hash cũ
2. **File CSS/JS cũ không còn tồn tại** sau khi rebuild Next.js
3. **Next.js trả về 400 Bad Request** (có thể là error page HTML) thay vì 404 cho static files không tồn tại
4. **Catch-all route có thể intercept** static file requests (đã fix)

## Giải pháp đã áp dụng

### 1. Sửa Catch-All Route
File: `app/[...segments]/page.tsx`
- Thêm check để skip `/_next/`, `/api/`, `/admin/`, và các file có extension
- Đảm bảo catch-all route không intercept static files

### 2. Cập nhật Middleware
File: `middleware.ts`
- Thêm logic skip cho `/_next/static/` và files có extension
- Cập nhật matcher để exclude static files

### 3. Cập nhật Nginx Config
File: `/etc/nginx/sites-available/conphungtourist.com.conf`
- Thêm location block riêng cho `/_next/static/` với proper headers
- Đảm bảo MIME types được set đúng
- Thêm cache headers cho static assets

## Cách kiểm tra và fix

### 1. Rebuild Next.js
```bash
cd /root/webfulllocal-new/conphung
npm run build
```

### 2. Restart Next.js Server
```bash
# Tìm process
ps aux | grep next-server

# Kill và restart (tùy cách bạn đang run Next.js)
pm2 restart conphung-nextjs
# hoặc
systemctl restart conphung-nextjs
```

### 3. Test Static Files
```bash
# Test file CSS mới (thay bằng file thực tế từ build)
curl -I http://127.0.0.1:3001/_next/static/css/81f4d538a7d7254e.css

# Should return 200 OK với Content-Type: text/css
```

### 4. Clear Browser Cache
- Hard refresh: Ctrl+Shift+R (Windows/Linux) hoặc Cmd+Shift+R (Mac)
- Hoặc clear cache trong browser settings
- Hoặc test với Incognito/Private mode

### 5. Verify Nginx Config
```bash
# Test config
nginx -t

# Reload nginx (sau khi fix config)
systemctl reload nginx
```

## Kiểm tra

### 1. Kiểm tra file CSS tồn tại
```bash
ls -la .next/static/css/
```

### 2. Kiểm tra Next.js serve đúng
```bash
curl -I http://127.0.0.1:3001/_next/static/css/[filename].css
# Should return:
# HTTP/1.1 200 OK
# Content-Type: text/css
```

### 3. Kiểm tra qua browser
- Mở DevTools (F12)
- Network tab
- Reload page
- Kiểm tra các file CSS/JS có load đúng không
- Kiểm tra Response Headers có `Content-Type: text/css` không

## Lưu ý

1. **File hash thay đổi sau mỗi build** - đây là bình thường với Next.js
2. **Browser cache** - cần clear cache hoặc hard refresh sau khi deploy
3. **Service Worker** - có thể cache files cũ, cần update hoặc unregister
4. **CDN/Proxy cache** - nếu có, cần clear cache

## Nếu vẫn còn lỗi

1. Kiểm tra Next.js logs:
   ```bash
   # Xem logs của Next.js process
   journalctl -u conphung-nextjs -f
   # hoặc
   pm2 logs conphung-nextjs
   ```

2. Kiểm tra Nginx logs:
   ```bash
   tail -f /var/log/nginx/error.log
   tail -f /var/log/nginx/access.log
   ```

3. Kiểm tra browser console:
   - Mở DevTools (F12)
   - Console tab - xem có lỗi gì không
   - Network tab - xem request/response của static files

4. Test trực tiếp Next.js (bypass Nginx):
   ```bash
   curl -I http://127.0.0.1:3001/_next/static/css/[filename].css
   ```

## Files đã thay đổi

1. `app/[...segments]/page.tsx` - Thêm check skip static files
2. `middleware.ts` - Thêm logic skip static files
3. `/etc/nginx/sites-available/conphungtourist.com.conf` - Thêm location block cho static files

## Next Steps

1. ✅ Rebuild Next.js application
2. ✅ Restart Next.js server
3. ✅ Reload Nginx (sau khi fix config)
4. ✅ Clear browser cache
5. ✅ Test với Incognito mode
6. ✅ Verify static files load correctly


