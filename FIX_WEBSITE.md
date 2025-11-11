# 🔧 HƯỚNG DẪN SỬA LỖI: TRANG WEB KHÔNG HIỆN NHƯ CŨ

## 🔍 Nguyên Nhân

Khi thêm code mới vào Next.js, cần **rebuild** lại để Next.js compile code mới vào `.next` folder. Nếu không rebuild, server sẽ vẫn chạy code cũ.

## ✅ Giải Pháp

### **Cách 1: Rebuild và Restart (Recommended)**

```bash
cd /root/webfulllocal-new/conphung

# 1. Xóa .next folder cũ (để build lại từ đầu)
rm -rf .next

# 2. Build lại
npm run build

# 3. Restart server
# Nếu dùng PM2:
pm2 restart conphung-new
# hoặc
pm2 restart all

# Nếu dùng systemd:
systemctl restart nextjs

# Nếu chạy thủ công:
pkill -f "next start"
PORT=3001 npm run start
```

### **Cách 2: Sử dụng PM2 Ecosystem (Tốt nhất)**

```bash
cd /root/webfulllocal-new

# 1. Rebuild
cd conphung
rm -rf .next
npm run build

# 2. Restart với PM2
pm2 restart ecosystem.config.js --update-env
# hoặc restart app cụ thể
pm2 restart conphung
```

### **Cách 3: Kiểm Tra và Fix Manual**

```bash
# 1. Kiểm tra server đang chạy không
pm2 list
# hoặc
ps aux | grep next

# 2. Kiểm tra port
netstat -tlnp | grep 3001
# hoặc
ss -tlnp | grep 3001

# 3. Kiểm tra logs
pm2 logs conphung-new --lines 50
# hoặc
tail -f /root/webfulllocal-new/conphung/logs/frontend-out.log

# 4. Nếu có lỗi → Rebuild
cd /root/webfulllocal-new/conphung
rm -rf .next
npm run build
pm2 restart conphung-new
```

## 🚀 Script Tự Động

Tạo file `rebuild-and-restart.sh`:

```bash
#!/bin/bash
cd /root/webfulllocal-new/conphung

echo "🧹 Cleaning .next folder..."
rm -rf .next

echo "🔨 Building Next.js app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🔄 Restarting server..."
    pm2 restart conphung-new || pm2 restart all
    echo "✅ Server restarted!"
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi
```

Chạy script:
```bash
chmod +x rebuild-and-restart.sh
./rebuild-and-restart.sh
```

## 🔍 Kiểm Tra Sau Khi Fix

### 1. **Kiểm tra server chạy:**
```bash
curl http://localhost:3001/
# Phải trả về HTML (status 200)
```

### 2. **Kiểm tra logs:**
```bash
pm2 logs conphung-new --lines 20
# Không có lỗi
```

### 3. **Kiểm tra browser:**
- Mở website trên browser
- Kiểm tra xem có hiển thị đúng không
- Kiểm tra console (F12) xem có lỗi không

## ⚠️ Lưu Ý

### **Vấn đề thường gặp:**

1. **Server không restart sau build:**
   ```bash
   # Phải restart server sau khi build
   pm2 restart conphung-new
   ```

2. **Port không đúng:**
   ```bash
   # Kiểm tra port trong ecosystem.config.js
   # Hoặc check process đang chạy trên port nào
   netstat -tlnp | grep next
   ```

3. **Cache browser:**
   ```bash
   # Clear cache browser (Ctrl+Shift+R)
   # Hoặc dùng incognito mode
   ```

4. **.next folder cũ:**
   ```bash
   # Phải xóa .next folder trước khi build lại
   rm -rf .next
   npm run build
   ```

## 📝 Checklist

- [ ] Đã xóa `.next` folder cũ
- [ ] Đã chạy `npm run build` thành công
- [ ] Đã restart server (PM2 hoặc manual)
- [ ] Server đang chạy trên port đúng (3001)
- [ ] Website hiển thị đúng trên browser
- [ ] Không có lỗi trong logs

## 🎯 Kết Quả Mong Đợi

Sau khi fix:
- ✅ Website hiển thị bình thường
- ✅ Không có lỗi trong console
- ✅ Server chạy ổn định
- ✅ Code mới được compile vào .next

## 🔄 Nếu Vẫn Không Được

1. **Kiểm tra lỗi build:**
   ```bash
   cd /root/webfulllocal-new/conphung
   npm run build 2>&1 | tee build.log
   ```

2. **Kiểm tra lỗi runtime:**
   ```bash
   pm2 logs conphung-new --err --lines 50
   ```

3. **Rollback (nếu cần):**
   ```bash
   # Xóa code mới
   rm -rf app/api/integrations/facebook
   rm -f lib/integrations/facebook-utils.ts
   
   # Rebuild
   rm -rf .next
   npm run build
   pm2 restart conphung-new
   ```

---

## 💡 Tại Sao Cần Rebuild?

Next.js sử dụng `.next` folder để lưu compiled code. Khi thêm code mới:
- Code mới chưa được compile vào `.next`
- Server vẫn chạy code cũ từ `.next` folder
- → Cần rebuild để compile code mới

**Giải pháp:** Luôn rebuild sau khi thêm/sửa code!

---

**Đã fix xong? Kiểm tra website lại nhé!** ✅


