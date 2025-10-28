# ⚡ Quick Development Guide

## 🚀 Khởi Động Nhanh

### Cách 1: Dùng script (Khuyên dùng)
```bash
./dev-start.sh
```

### Cách 2: Dùng npm
```bash
npm run dev
```

## 🛑 Dừng Dự Án

### Cách 1: Dùng script
```bash
./dev-stop.sh
```

### Cách 2: Dùng npm
```bash
npm run stop
```

---

## 📍 URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **n8n**: http://localhost:5678

---

## 📝 Xem Logs

```bash
npm run logs
```

hoặc

```bash
tail -f dev.log dev-frontend.log
```

---

## ✨ Tính Năng Auto-Reload

Khi bạn chạy `./dev-start.sh` hoặc `npm run dev`:

✅ **Backend** (NestJS):
- Tự động reload khi sửa file `.ts` trong `backend/src/`
- Không cần restart server

✅ **Frontend** (Next.js):
- Hot reload tự động
- Browser tự refresh khi sửa code
- Fast Refresh giữ nguyên state của React

✅ **Database & Redis**:
- Chạy trong Docker
- Data được lưu trong volumes

---

## 🔧 Các Lệnh NPM Hữu Ích

```bash
npm run dev              # Khởi động full dự án
npm run stop             # Dừng dự án
npm run logs             # Xem logs
npm run docker:up        # Chỉ khởi động Docker
npm run docker:down      # Dừng Docker
npm run docker:logs      # Xem Docker logs
npm run docker:rebuild   # Rebuild Docker images
npm run backend:dev      # Chỉ chạy Backend
npm run frontend:dev     # Chỉ chạy Frontend
```

---

## 💡 Workflow Hàng Ngày

1. **Sáng**: Khởi động dự án
   ```bash
   ./dev-start.sh
   ```

2. **Làm việc**: Sửa code → Tự động reload → Test

3. **Tối**: Dừng dự án
   ```bash
   ./dev-stop.sh
   ```

---

## 🐛 Troubleshooting Nhanh

### Port bị chiếm
```bash
lsof -i :3000  # Kiểm tra port 3000
lsof -i :4000  # Kiểm tra port 4000
kill -9 <PID>  # Kill process
```

### Lỗi dependencies
```bash
cd backend && npm install
cd conphung && npm install
```

### Reset database
```bash
docker-compose down -v
```

---

## 📚 Tài Liệu Chi Tiết

Xem file `DEV_COMMANDS.md` để biết thêm chi tiết.
