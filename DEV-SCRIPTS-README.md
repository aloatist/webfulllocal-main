# 📚 Hướng Dẫn Sử Dụng Dev Scripts

## 🚀 Các Script Có Sẵn

### 1. `./dev-start.sh` - Khởi động dự án
**Chức năng:**
- ✅ Làm mới cache (.next, .cache, dist, logs)
- ✅ Khởi động PostgreSQL và Redis
- ✅ Khởi động Backend (NestJS) với watch mode
- ✅ Khởi động Frontend (Next.js) với dev mode
- ✅ Khởi động n8n automation
- ✅ Tự động reload khi code thay đổi

**Sử dụng:**
```bash
./dev-start.sh
```

**Địa chỉ truy cập:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- n8n: http://localhost:5678

---

### 2. `./dev-stop.sh` - Dừng dự án
**Chức năng:**
- 🛑 Dừng Backend và Frontend processes
- 🛑 Dừng tất cả Docker containers
- 🧹 Xóa log files
- 🧹 Dọn dẹp PID files

**Sử dụng:**
```bash
./dev-stop.sh
```

---

### 3. `./dev-restart.sh` - Restart nhanh
**Chức năng:**
- 🔄 Dừng dự án
- 🔄 Khởi động lại với cache mới

**Sử dụng:**
```bash
./dev-restart.sh
```

---

### 4. `./dev-clean.sh` - Làm sạch hoàn toàn
**Chức năng:**
- 🧹 Dừng tất cả services
- 🧹 Xóa tất cả cache và build files
- 🧹 Xóa log files
- 🧹 Tùy chọn xóa Docker volumes (database data)
- 🧹 Tùy chọn xóa node_modules (uncomment trong script)

**Sử dụng:**
```bash
./dev-clean.sh
```

**⚠️ Lưu ý:** Script sẽ hỏi bạn có muốn xóa database data không.

---

### 5. `./db-seed.sh` - Seed database
**Chức năng:**
- 🌱 Tạo admin user mặc định
- 🌱 Tạo editor user mặc định
- 🌱 Tạo categories mặc định
- 🌱 Tạo tags mặc định
- 🗄️ Chạy migrations nếu cần

**Sử dụng:**
```bash
./db-seed.sh
```

**Thông tin đăng nhập:**
- Admin (Tổng Giám đốc): `conphung87@yahoo.com.vn` / `admin123`
- Editor (Phó Tổng Giám đốc): `conphungtourist87@gmail.com` / `editor123`

---

## 🔧 Workflow Thông Thường

### Khởi động hàng ngày:
```bash
./dev-start.sh
```

### Khi gặp lỗi cache:
```bash
./dev-restart.sh
```

### Khi cần làm mới hoàn toàn:
```bash
./dev-clean.sh  # Chọn Y để xóa database
./db-seed.sh    # Tạo lại dữ liệu mặc định
./dev-start.sh
```

### Khi cần reset database:
```bash
./db-seed.sh
```

### Khi kết thúc làm việc:
```bash
./dev-stop.sh
```

---

## 📝 Xem Logs

### Xem logs realtime:
```bash
# Backend logs
tail -f dev.log

# Frontend logs
tail -f dev-frontend.log

# Cả hai
tail -f dev.log dev-frontend.log
```

---

## 🐛 Troubleshooting

### Lỗi: "Docker chưa chạy"
**Giải pháp:** Khởi động Docker Desktop trước

### Lỗi: "Port đã được sử dụng"
**Giải pháp:**
```bash
./dev-stop.sh
# Hoặc kill thủ công
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:4000 | xargs kill -9  # Backend
```

### Lỗi: "Database connection failed"
**Giải pháp:**
```bash
./dev-clean.sh  # Chọn Y để xóa volumes
./dev-start.sh
```

### Cache không được xóa
**Giải pháp:**
```bash
./dev-clean.sh
```

---

## 💡 Tips

1. **Luôn dùng `dev-restart.sh`** thay vì stop/start thủ công
2. **Chạy `dev-clean.sh`** mỗi tuần một lần để dọn dẹp
3. **Kiểm tra logs** nếu có lỗi: `tail -f dev.log`
4. **Không xóa volumes** trừ khi cần reset database hoàn toàn

---

## 🎯 Các Thay Đổi Mới

### ✨ Tính năng mới trong dev-start.sh:
- Tự động xóa `.next` cache
- Tự động xóa `.cache` folder
- Tự động xóa `backend/dist`
- Tự động xóa log files cũ
- Thông báo rõ ràng hơn

### ✨ Tính năng mới trong dev-stop.sh:
- Kill tất cả Node processes liên quan
- Dọn dẹp log files
- Dọn dẹp PID files
- Thông báo hướng dẫn restart

### ✨ Script mới:
- `dev-clean.sh`: Làm sạch hoàn toàn
- `dev-restart.sh`: Restart nhanh với cache mới

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. Docker Desktop đang chạy
2. Ports 3000, 4000, 5678 không bị chiếm
3. Đủ dung lượng ổ cứng
4. Node.js version >= 18

---

**Chúc bạn code vui vẻ! 🚀**
