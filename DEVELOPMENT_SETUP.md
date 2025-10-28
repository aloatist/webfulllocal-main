# 🎯 Development Setup Complete

## ✅ Đã Tạo Các File Mới

### 1. **dev-start.sh** - Script khởi động dự án
- Tự động khởi động PostgreSQL, Redis
- Chạy Backend với watch mode (auto-reload)
- Chạy Frontend với dev mode (hot-reload)
- Khởi động n8n workflow
- Hiển thị logs real-time

### 2. **dev-stop.sh** - Script dừng dự án
- Dừng tất cả processes
- Dọn dẹp PID files
- Dừng Docker containers

### 3. **DEV_COMMANDS.md** - Tài liệu chi tiết
- Hướng dẫn đầy đủ các lệnh
- Troubleshooting guide
- Workflow phát triển

### 4. **QUICK_DEV.md** - Quick reference
- Các lệnh thường dùng
- URLs truy cập
- Tips nhanh

### 5. **package.json** - Cập nhật scripts
- Thêm npm scripts tiện lợi
- Dễ dàng chạy lệnh

---

## 🚀 Cách Sử Dụng

### Khởi động dự án (Chọn 1 trong 2 cách)

**Cách 1: Dùng script trực tiếp**
```bash
./dev-start.sh
```

**Cách 2: Dùng npm**
```bash
npm run dev
```

### Dừng dự án

**Cách 1: Dùng script**
```bash
./dev-stop.sh
```

**Cách 2: Dùng npm**
```bash
npm run stop
```

---

## 🎨 Tính Năng Auto-Reload

### Backend (NestJS)
```
Sửa file .ts → NestJS tự động compile → Server reload
```
- Không cần restart
- Giữ nguyên database connection
- Fast compilation

### Frontend (Next.js)
```
Sửa file .tsx/.ts → Next.js detect → Browser auto refresh
```
- Hot Module Replacement (HMR)
- Fast Refresh giữ nguyên React state
- Instant feedback

---

## 📊 Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                    Development Mode                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐ │
│  │   Frontend   │    │   Backend    │    │    n8n    │ │
│  │   Next.js    │───▶│   NestJS     │───▶│ Workflow  │ │
│  │  Port: 3000  │    │  Port: 4000  │    │ Port:5678 │ │
│  └──────────────┘    └──────────────┘    └───────────┘ │
│         │                    │                           │
│         │                    │                           │
│         ▼                    ▼                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Docker Services                      │  │
│  │  ┌──────────────┐      ┌──────────────┐         │  │
│  │  │  PostgreSQL  │      │    Redis     │         │  │
│  │  │  Port: 5432  │      │  Port: 6379  │         │  │
│  │  └──────────────┘      └──────────────┘         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Development Workflow

```
1. Khởi động
   └─▶ ./dev-start.sh

2. Code thay đổi
   ├─▶ Backend: src/**/*.ts → Auto reload
   └─▶ Frontend: **/*.tsx → Hot reload

3. Test
   ├─▶ Frontend: http://localhost:3000
   ├─▶ Backend: http://localhost:4000/api
   └─▶ n8n: http://localhost:5678

4. Debug
   ├─▶ tail -f dev.log (Backend)
   └─▶ tail -f dev-frontend.log (Frontend)

5. Dừng
   └─▶ ./dev-stop.sh
```

---

## 📝 Logs & Monitoring

### Xem logs real-time
```bash
# Cả hai services
npm run logs

# Chỉ Backend
tail -f dev.log

# Chỉ Frontend
tail -f dev-frontend.log

# Docker services
npm run docker:logs
```

### Log files
- `dev.log` - Backend logs
- `dev-frontend.log` - Frontend logs
- `.backend.pid` - Backend process ID
- `.frontend.pid` - Frontend process ID

---

## 🎯 URLs Truy Cập

| Service | URL | Mô tả |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | Giao diện người dùng |
| **Backend API** | http://localhost:4000 | REST API |
| **API Docs** | http://localhost:4000/api | API Documentation |
| **n8n** | http://localhost:5678 | Workflow automation |

---

## 💻 Các Lệnh NPM

```bash
# Development
npm run dev              # Khởi động full stack
npm run stop             # Dừng dự án
npm run logs             # Xem logs

# Docker
npm run docker:up        # Khởi động Docker services
npm run docker:down      # Dừng Docker services
npm run docker:logs      # Xem Docker logs
npm run docker:rebuild   # Rebuild containers

# Individual services
npm run backend:dev      # Chỉ Backend
npm run frontend:dev     # Chỉ Frontend
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **ORM**: TypeORM

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Radix UI, shadcn/ui
- **State**: React Hooks

### DevOps
- **Container**: Docker & Docker Compose
- **Automation**: n8n
- **Process Manager**: PM2 (production)

---

## 🚨 Troubleshooting

### Port đã được sử dụng
```bash
lsof -i :3000  # Frontend
lsof -i :4000  # Backend
kill -9 <PID>
```

### Dependencies lỗi
```bash
# Backend
cd backend && rm -rf node_modules && npm install

# Frontend
cd conphung && rm -rf node_modules && npm install
```

### Docker lỗi
```bash
# Reset tất cả
docker-compose down -v
docker-compose up -d

# Xem logs
docker-compose logs -f
```

### Database lỗi
```bash
# Reset database
docker-compose down -v
docker volume prune
docker-compose up -d postgres redis
```

---

## 📚 Tài Liệu Tham Khảo

- **QUICK_DEV.md** - Quick reference guide
- **DEV_COMMANDS.md** - Chi tiết các lệnh
- **README.md** - Tổng quan dự án
- **QUICK_START_GUIDE.md** - Hướng dẫn bắt đầu

---

## ✨ Best Practices

1. **Luôn chạy `./dev-start.sh`** thay vì chạy từng service riêng lẻ
2. **Theo dõi logs** để catch lỗi sớm
3. **Commit thường xuyên** để không mất code
4. **Test trên browser** sau mỗi thay đổi quan trọng
5. **Dừng dự án** khi không làm việc để tiết kiệm tài nguyên

---

## 🎉 Hoàn Tất!

Bây giờ bạn có thể:
- ✅ Khởi động full dự án với 1 lệnh
- ✅ Code tự động reload khi thay đổi
- ✅ Xem logs real-time
- ✅ Dừng dự án dễ dàng

**Bắt đầu ngay:**
```bash
./dev-start.sh
```

Happy coding! 🚀
