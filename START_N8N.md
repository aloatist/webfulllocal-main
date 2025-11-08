# 🚀 Hướng Dẫn Chạy n8n

## ✅ n8n Đã Được Cài Đặt

n8n đã được cài đặt globally tại: `/usr/bin/n8n`

## 🎯 Cách Chạy n8n

### **Cách 1: Chạy với PM2 (Recommended)**

```bash
cd /root/webfulllocal-new/n8n
pm2 start start.sh --name n8n --interpreter bash
pm2 save
```

**Quản lý:**
```bash
# Xem status
pm2 status n8n

# Xem logs
pm2 logs n8n

# Restart
pm2 restart n8n

# Stop
pm2 stop n8n
```

### **Cách 2: Chạy Trực Tiếp**

```bash
cd /root/webfulllocal-new/n8n
n8n start --user-folder /root/webfulllocal-new/n8n
```

### **Cách 3: Chạy với Docker (Nếu có Docker)**

```bash
cd /root/webfulllocal-new
docker-compose up -d n8n
```

## 🌐 Truy Cập n8n

Sau khi chạy, truy cập:
- **URL**: http://localhost:5678
- **Hoặc**: http://your-server-ip:5678

## ⚙️ Cấu Hình

### **Environment Variables**

Tạo file `.env` trong `/root/webfulllocal-new/n8n/` nếu cần:

```bash
# n8n Configuration
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_HOST=localhost
WEBHOOK_URL=http://localhost:5678/

# Database (nếu dùng database)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=password

# Timezone
GENERIC_TIMEZONE=Asia/Ho_Chi_Minh
```

### **User Folder**

n8n sẽ lưu workflows và data tại:
- `/root/webfulllocal-new/n8n/` (theo start.sh)

## 📁 Import Workflows

1. Truy cập http://localhost:5678
2. Login/Signup lần đầu
3. Vào **Workflows** → **Import from File**
4. Import file: `workflows/facebook-to-nextjs-post.json`

## 🔧 Troubleshooting

### **Port đã được sử dụng:**
```bash
# Kiểm tra port
netstat -tlnp | grep 5678

# Thay đổi port trong start.sh:
n8n start --port 5679 --user-folder /root/webfulllocal-new/n8n
```

### **Lỗi permission:**
```bash
chmod +x /root/webfulllocal-new/n8n/start.sh
```

### **Xem logs:**
```bash
pm2 logs n8n
# hoặc
tail -f ~/.pm2/logs/n8n-out.log
```

## 🔄 Auto Start với PM2

Để n8n tự động start khi server restart:

```bash
pm2 save
pm2 startup
```

## 📝 Lưu Ý

1. **Workflows**: Được lưu tại `/root/webfulllocal-new/n8n/workflows/`
2. **Credentials**: Được lưu trong n8n database (encrypted)
3. **Executions**: Được lưu trong n8n database
4. **Backup**: Nên backup folder `n8n/` định kỳ

## 🎯 Next Steps

Sau khi n8n chạy:

1. ✅ Truy cập http://localhost:5678
2. ✅ Import workflow `facebook-to-nextjs-post.json`
3. ✅ Cấu hình Facebook credentials
4. ✅ Cấu hình Next.js API credentials
5. ✅ Activate workflow
6. ✅ Test workflow

---

**n8n đang chạy! Truy cập http://localhost:5678 để bắt đầu!** 🚀
