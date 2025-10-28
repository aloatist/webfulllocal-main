#!/bin/bash

# Script để chạy full dự án với auto-reload khi code thay đổi
# Sử dụng: ./dev-start.sh

set -e

echo "🚀 Khởi động dự án Full Stack..."

# Màu sắc cho output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kiểm tra Docker đang chạy
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker chưa chạy. Vui lòng khởi động Docker Desktop.${NC}"
    exit 1
fi

# Dừng các container cũ nếu có
echo -e "${BLUE}🛑 Dừng các container cũ...${NC}"
docker-compose down 2>/dev/null || true

# Làm mới cache và build files
echo -e "${YELLOW}🧹 Làm mới cache và build files...${NC}"

# Xóa Next.js cache và build
if [ -d "conphung/.next" ]; then
    echo -e "${YELLOW}   - Xóa .next cache...${NC}"
    rm -rf conphung/.next
fi

# Xóa Next.js cache folder
if [ -d "conphung/.cache" ]; then
    echo -e "${YELLOW}   - Xóa .cache folder...${NC}"
    rm -rf conphung/.cache
fi

# Xóa backend dist
if [ -d "backend/dist" ]; then
    echo -e "${YELLOW}   - Xóa backend dist...${NC}"
    rm -rf backend/dist
fi

# Xóa log files cũ
if [ -f "dev.log" ]; then
    echo -e "${YELLOW}   - Xóa log files cũ...${NC}"
    rm -f dev.log dev-frontend.log
fi

echo -e "${GREEN}✨ Cache đã được làm mới!${NC}"

# Khởi động database và redis trước
echo -e "${BLUE}🗄️  Khởi động PostgreSQL và Redis...${NC}"
docker-compose up -d postgres redis

# Đợi database sẵn sàng
echo -e "${YELLOW}⏳ Đợi database sẵn sàng...${NC}"
sleep 5

# Chạy Prisma migrations và seed
echo -e "${BLUE}🗄️  Chạy database migrations...${NC}"
cd conphung
npx prisma migrate deploy 2>/dev/null || npx prisma db push
echo -e "${BLUE}🌱 Seeding database...${NC}"
npm run db:seed
cd ..

# Cài đặt dependencies cho backend nếu cần
if [ ! -d "backend/node_modules" ]; then
    echo -e "${BLUE}📦 Cài đặt dependencies cho Backend...${NC}"
    cd backend && npm install && cd ..
fi

# Cài đặt dependencies cho frontend nếu cần
if [ ! -d "conphung/node_modules" ]; then
    echo -e "${BLUE}📦 Cài đặt dependencies cho Frontend...${NC}"
    cd conphung && npm install && cd ..
fi

# Khởi động Backend với watch mode
echo -e "${GREEN}🔧 Khởi động Backend (watch mode)...${NC}"
cd backend
npm run start:dev > ../dev.log 2>&1 &
BACKEND_PID=$!
cd ..

# Đợi backend khởi động
sleep 5

# Khởi động Frontend với dev mode
echo -e "${GREEN}⚛️  Khởi động Frontend (dev mode)...${NC}"
cd conphung
npm run dev > ../dev-frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Khởi động n8n
echo -e "${BLUE}🔄 Khởi động n8n...${NC}"
docker-compose up -d n8n

echo ""
echo -e "${GREEN}✅ Dự án đã khởi động thành công!${NC}"
echo ""
echo "📍 Các địa chỉ truy cập:"
echo -e "   ${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "   ${BLUE}Backend:${NC}  http://localhost:4000"
echo -e "   ${BLUE}n8n:${NC}      http://localhost:5678"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f dev.log"
echo "   Frontend: tail -f dev-frontend.log"
echo ""
echo "🛑 Để dừng dự án:"
echo "   kill $BACKEND_PID $FRONTEND_PID && docker-compose down"
echo ""
echo "💡 Code của bạn sẽ tự động reload khi có thay đổi!"
echo ""

# Lưu PIDs để dễ dừng sau này
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

# Theo dõi logs
tail -f dev.log dev-frontend.log
