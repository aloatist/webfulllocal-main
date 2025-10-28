#!/bin/bash

# Script để restart nhanh dự án với cache mới
# Sử dụng: ./dev-restart.sh

set -e

echo "🔄 Restart dự án với cache mới..."

# Màu sắc
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Dừng dự án
echo -e "${BLUE}🛑 Dừng dự án...${NC}"
./dev-stop.sh

echo ""
echo -e "${GREEN}⏳ Đợi 2 giây...${NC}"
sleep 2

# Khởi động lại
echo -e "${BLUE}🚀 Khởi động lại...${NC}"
./dev-start.sh
