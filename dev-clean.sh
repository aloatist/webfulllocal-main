#!/bin/bash

# Script để làm sạch hoàn toàn dự án (deep clean)
# Sử dụng: ./dev-clean.sh

set -e

echo "🧹 Làm sạch hoàn toàn dự án..."

# Màu sắc
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Dừng tất cả trước
echo -e "${RED}🛑 Dừng tất cả services...${NC}"
./dev-stop.sh 2>/dev/null || true

echo ""
echo -e "${YELLOW}🧹 Xóa cache và build files...${NC}"

# Xóa Next.js cache
if [ -d "conphung/.next" ]; then
    echo -e "${YELLOW}   ✓ Xóa conphung/.next${NC}"
    rm -rf conphung/.next
fi

if [ -d "conphung/.cache" ]; then
    echo -e "${YELLOW}   ✓ Xóa conphung/.cache${NC}"
    rm -rf conphung/.cache
fi

# Xóa backend dist
if [ -d "backend/dist" ]; then
    echo -e "${YELLOW}   ✓ Xóa backend/dist${NC}"
    rm -rf backend/dist
fi

# Xóa node_modules (tùy chọn - uncomment nếu cần)
# echo -e "${RED}⚠️  Xóa node_modules (sẽ phải cài lại)...${NC}"
# rm -rf conphung/node_modules backend/node_modules

# Xóa log files
echo -e "${YELLOW}   ✓ Xóa log files${NC}"
rm -f dev.log dev-frontend.log

# Xóa PID files
rm -f .backend.pid .frontend.pid 2>/dev/null || true

# Xóa Docker volumes (tùy chọn)
read -p "$(echo -e ${BLUE}Bạn có muốn xóa Docker volumes \(database data\)? \[y/N\]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}   ✓ Xóa Docker volumes...${NC}"
    docker-compose down -v
else
    echo -e "${GREEN}   ✓ Giữ lại Docker volumes${NC}"
fi

echo ""
echo -e "${GREEN}✅ Đã làm sạch hoàn toàn dự án!${NC}"
echo ""
echo -e "${BLUE}📝 Các bước tiếp theo:${NC}"
echo -e "   1. Chạy: ${GREEN}./dev-start.sh${NC} để khởi động lại"
echo -e "   2. Nếu cần cài lại dependencies: ${YELLOW}cd conphung && npm install${NC}"
echo ""
