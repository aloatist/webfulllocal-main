# Hướng dẫn Restart Next.js Server

## Vấn đề
HTML đang được serve có link đến file CSS/JS cũ (`e02573044cd950bb.css`) thay vì file mới. Điều này khiến browser báo lỗi MIME type.

## Giải pháp

### 1. Restart Next.js Server

**Cách 1: Nếu chạy bằng PM2**
```bash
pm2 restart conphung-new
# hoặc
pm2 restart all
```

**Cách 2: Nếu chạy bằng systemd**
```bash
systemctl restart conphung-nextjs
```

**Cách 3: Nếu chạy trực tiếp**
```bash
# Tìm process
ps aux | grep "next-server\|next start"

# Kill process
kill <PID>

# Start lại
cd /root/webfulllocal-new/conphung
npm run build
npm start
# hoặc
NODE_ENV=production npm start
```

**Cách 4: Nếu chạy bằng nohup hoặc screen**
```bash
# Tìm process
ps aux | grep "next"

# Kill process
kill <PID>

# Start lại trong screen/tmux
screen -S nextjs
cd /root/webfulllocal-new/conphung
npm start
```

### 2. Clear Browser Cache

**Từ Browser:**
1. Mở DevTools (F12)
2. Right-click vào nút Reload
3. Chọn "Empty Cache and Hard Reload"

**Hoặc:**
- Chrome/Edge: Ctrl+Shift+Delete → Clear browsing data
- Firefox: Ctrl+Shift+Delete → Clear data
- Safari: Cmd+Option+E → Empty Caches

### 3. Unregister Service Worker

**Từ Browser Console (F12):**
```javascript
// Unregister service worker
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});

// Clear all caches
caches.keys().then(function(names) {
  for (let name of names) {
    caches.delete(name);
  }
});

// Reload page
location.reload(true);
```

### 4. Verify Next.js is Running

```bash
# Check if Next.js is running on port 3001
curl -I http://127.0.0.1:3001/

# Check process
ps aux | grep next

# Check port
netstat -tulpn | grep 3001
# hoặc
ss -tulpn | grep 3001
```

### 5. Test Static Files

```bash
# Test CSS file (thay bằng file thực tế từ build)
curl -I http://127.0.0.1:3001/_next/static/css/81f4d538a7d7254e.css

# Should return:
# HTTP/1.1 200 OK
# Content-Type: text/css
```

### 6. Check HTML Served

```bash
# Check if HTML has correct CSS links
curl -s http://127.0.0.1:3001/ | grep -o 'href="[^"]*\.css[^"]*"'

# Should NOT contain: e02573044cd950bb.css
# Should contain: 81f4d538a7d7254e.css or other new files
```

## Sau khi restart

1. ✅ Verify Next.js server is running
2. ✅ Test HTML served has correct CSS/JS links
3. ✅ Clear browser cache
4. ✅ Unregister service worker (if needed)
5. ✅ Hard reload page (Ctrl+Shift+R)
6. ✅ Check browser console for errors

## Nếu vẫn còn lỗi

1. Check Next.js logs:
   ```bash
   pm2 logs conphung-new
   # hoặc
   journalctl -u conphung-nextjs -f
   ```

2. Check Nginx logs:
   ```bash
   tail -f /var/log/nginx/error.log
   tail -f /var/log/nginx/access.log
   ```

3. Check if there's a CDN/proxy caching HTML:
   - Cloudflare
   - Varnish
   - Other proxy servers

4. Verify build directory:
   ```bash
   ls -la .next/static/css/
   # Should see new CSS files, not old ones
   ```


