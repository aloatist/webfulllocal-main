#!/bin/bash

# Script để seed database với dữ liệu mặc định
# Sử dụng: ./db-seed.sh

set -e

echo "🌱 Seeding database..."

# Màu sắc
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Kiểm tra Docker đang chạy
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker chưa chạy. Vui lòng khởi động Docker Desktop.${NC}"
    exit 1
fi

# Kiểm tra database đang chạy
if ! docker ps | grep -q postgres; then
    echo -e "${YELLOW}⚠️  Database chưa chạy. Khởi động database...${NC}"
    docker-compose up -d postgres
    echo -e "${YELLOW}⏳ Đợi database sẵn sàng...${NC}"
    sleep 5
fi

# Cài tsx nếu chưa có
cd conphung
if ! npm list tsx > /dev/null 2>&1; then
    echo -e "${BLUE}📦 Cài đặt tsx...${NC}"
    npm install --save-dev tsx
fi

# Chạy migrations
echo -e "${BLUE}🗄️  Chạy database migrations...${NC}"
npx prisma migrate deploy 2>/dev/null || npx prisma db push

# Chạy seed
echo -e "${BLUE}🌱 Seeding database...${NC}"
npm run db:seed

cd ..

echo ""
echo -e "${GREEN}✅ Database đã được seed thành công!${NC}"
echo ""
echo -e "${BLUE}📝 Thông tin đăng nhập:${NC}"
echo -e "   ${GREEN}Admin (Tổng Giám đốc):${NC}  conphung87@yahoo.com.vn / admin123"
echo -e "   ${GREEN}Editor (Phó Tổng Giám đốc):${NC} conphungtourist87@gmail.com / editor123"
echo ""
