# 🚀 Hướng Dẫn Chạy Dự Án

## Lệnh Chính - Chạy Full Dự Án

### Khởi động dự án với auto-reload
```bash
./dev-start.sh
```

Lệnh này sẽ:
- ✅ Khởi động PostgreSQL và Redis (Docker)
- ✅ Khởi động Backend (NestJS) với watch mode
- ✅ Khởi động Frontend (Next.js) với dev mode
- ✅ Khởi động n8n workflow
- ✅ **Tự động reload khi bạn sửa code**

### Dừng dự án
```bash
./dev-stop.sh
```

---

## Các Địa Chỉ Truy Cập

| Service  | URL                      | Mô tả                    |
|----------|--------------------------|--------------------------|
| Frontend | http://localhost:3000    | Giao diện người dùng     |
| Backend  | http://localhost:4000    | API Server               |
| n8n      | http://localhost:5678    | Workflow automation      |

---

## Xem Logs

### Xem logs Backend
```bash
tail -f dev.log
```

### Xem logs Frontend
```bash
tail -f dev-frontend.log
```

### Xem logs cả hai
```bash
tail -f dev.log dev-frontend.log
```

---

## Các Lệnh Phát Triển Khác

### Backend (NestJS)

```bash
cd backend

# Chạy backend riêng lẻ
npm run start:dev

# Build production
npm run build

# Chạy production
npm run start:prod

# Chạy tests
npm run test

# Lint code
npm run lint
```

### Frontend (Next.js)

```bash
cd conphung

# Chạy frontend riêng lẻ
npm run dev

# Build production
npm run build

# Chạy production
npm start

# Lint code
npm run lint
```

---

## Docker Commands

### Khởi động tất cả services
```bash
docker-compose up -d
```

### Dừng tất cả services
```bash
docker-compose down
```

### Xem logs Docker
```bash
docker-compose logs -f
```

### Rebuild containers
```bash
docker-compose up -d --build
```

### Xóa volumes (reset database)
```bash
docker-compose down -v
```

---

## Troubleshooting

### Port đã được sử dụng
```bash
# Kiểm tra process đang dùng port
lsof -i :3000  # Frontend
lsof -i :4000  # Backend
lsof -i :5678  # n8n

# Kill process
kill -9 <PID>
```

### Cài đặt lại dependencies
```bash
# Backend
cd backend && rm -rf node_modules && npm install

# Frontend
cd conphung && rm -rf node_modules && npm install
```

### Reset database
```bash
docker-compose down -v
docker-compose up -d postgres redis
```

---

## Workflow Phát Triển

1. **Khởi động dự án**
   ```bash
   ./dev-start.sh
   ```

2. **Sửa code** - Code sẽ tự động reload:
   - Backend: Sửa file trong `backend/src/` → Auto reload
   - Frontend: Sửa file trong `conphung/` → Hot reload

3. **Test thay đổi** trên browser:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api

4. **Xem logs** nếu có lỗi:
   ```bash
   tail -f dev.log dev-frontend.log
   ```

5. **Dừng dự án** khi xong:
   ```bash
   ./dev-stop.sh
   ```

---

## Tips

- 💡 **Auto-reload**: Không cần restart server khi sửa code
- 💡 **Hot reload**: Frontend tự động refresh browser
- 💡 **Logs**: Luôn theo dõi logs để catch lỗi sớm
- 💡 **Git**: Commit thường xuyên để không mất code

---

## Cấu Trúc Dự Án

```
fullconphung-main/
├── backend/          # NestJS API
├── conphung/         # Next.js Frontend
├── n8n/              # n8n workflows
├── dev-start.sh      # Script khởi động
├── dev-stop.sh       # Script dừng
└── docker-compose.yml # Docker config
```
