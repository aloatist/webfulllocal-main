# ⚡ HƯỚNG DẪN SỬA NHANH: TRANG WEB KHÔNG HIỆN NHƯ CŨ

## ✅ ĐÃ KIỂM TRA: Server đang chạy bình thường!

## 🔧 Các Bước Sửa

### **Bước 1: Rebuild Next.js (QUAN TRỌNG)**

```bash
cd /root/webfulllocal-new/conphung

# Xóa .next folder cũ
rm -rf .next

# Build lại
npm run build
```

### **Bước 2: Restart Server với PM2**

```bash
cd /root/webfulllocal-new

# Restart với tên đúng: "conphung"
pm2 restart conphung

# Kiểm tra status
pm2 status conphung
```

### **Bước 3: Clear Browser Cache**

**Trên browser:**
1. Nhấn `Ctrl + Shift + R` (Windows/Linux) hoặc `Cmd + Shift + R` (Mac)
2. Hoặc mở Incognito/Private mode
3. Hoặc clear cache trong browser settings

### **Bước 4: Kiểm Tra**

```bash
# Kiểm tra server
curl http://localhost:3001/

# Kiểm tra logs
pm2 logs conphung --lines 20
```

## 🎯 Script Tự Động (Copy & Paste)

```bash
#!/bin/bash
cd /root/webfulllocal-new/conphung
echo "🧹 Cleaning .next folder..."
rm -rf .next
echo "🔨 Building Next.js..."
npm run build
echo "🔄 Restarting server..."
cd ..
pm2 restart conphung
echo "✅ Done! Check http://localhost:3001/"
```

## ⚠️ Lưu Ý

1. **Port**: Server có thể chạy trên port 3001 (không phải 3000)
2. **PM2 name**: Tên process là `conphung` (không phải `conphung-new`)
3. **Cache**: Phải clear browser cache để thấy thay đổi
4. **Build**: Phải rebuild sau khi thêm code mới

## 🔍 Nếu Vẫn Không Được

1. **Kiểm tra port đúng:**
   ```bash
   netstat -tlnp | grep 300
   ```

2. **Kiểm tra logs:**
   ```bash
   pm2 logs conphung --err --lines 50
   ```

3. **Kiểm tra build:**
   ```bash
   cd /root/webfulllocal-new/conphung
   npm run build 2>&1 | tail -30
   ```

---

**Sau khi làm xong các bước trên, website sẽ hiển thị đúng!** ✅
