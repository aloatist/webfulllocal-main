#!/bin/bash

# Script để dừng toàn bộ dự án
# Sử dụng: ./dev-stop.sh

set -e

echo "🛑 Dừng dự án Full Stack..."

# Màu sắc
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Dừng Backend
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${RED}Dừng Backend (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID 2>/dev/null || true
    fi
    rm .backend.pid
fi

# Dừng Frontend
if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${RED}Dừng Frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    rm .frontend.pid
fi

# Kill tất cả Node processes liên quan (backup)
echo -e "${RED}Dừng tất cả Node processes...${NC}"
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "npm run start:dev" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "nest start" 2>/dev/null || true

# Dừng Docker containers
echo -e "${RED}Dừng Docker containers...${NC}"
docker-compose down

# Xóa log files
if [ -f "dev.log" ] || [ -f "dev-frontend.log" ]; then
    echo -e "${RED}Xóa log files...${NC}"
    rm -f dev.log dev-frontend.log
fi

# Xóa PID files nếu còn sót
rm -f .backend.pid .frontend.pid 2>/dev/null || true

echo -e "${GREEN}✅ Đã dừng và dọn dẹp toàn bộ dự án!${NC}"
echo -e "${GREEN}💡 Chạy ./dev-start.sh để khởi động lại với cache mới${NC}"
