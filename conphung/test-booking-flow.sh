#!/bin/bash

# Test Booking Flow - Cồn Phụng Tourist
# Script tự động test các chức năng quan trọng

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${YELLOW}🧪 BẮT ĐẦU TEST BOOKING FLOW${NC}"
echo "======================================"

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    
    echo -n "Testing $name... "
    response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$url")
    
    if [ "$response" -eq 200 ] || [ "$response" -eq 201 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $response)"
        return 1
    fi
}

# Test 1: Homepage
echo ""
echo "📄 Test 1: HOMEPAGE"
test_endpoint "Trang chủ" "$BASE_URL/"

# Test 2: Tours List
echo ""
echo "📄 Test 2: TOURS LIST"
test_endpoint "Danh sách tours" "$BASE_URL/tours"

# Test 3: Homestays
echo ""
echo "🏠 Test 3: HOMESTAYS"
test_endpoint "Danh sách homestays" "$BASE_URL/homestays"

# Test 4: Admin Login Page
echo ""
echo "🔐 Test 4: ADMIN"
test_endpoint "Trang login" "$BASE_URL/login"

# Test 5: API Tours
echo ""
echo "🔌 Test 5: API ENDPOINTS"
test_endpoint "API - Public Tours" "$BASE_URL/api/public/tours"
test_endpoint "API - Homestays" "$BASE_URL/api/public/homestays"
test_endpoint "API - Posts" "$BASE_URL/api/posts"

# Test 6: Check for specific tour (example)
echo ""
echo "🎫 Test 6: TOUR DETAIL"
echo "Note: Cần có tour trong database để test"
# Uncomment if you have a specific tour slug:
# test_endpoint "Tour detail" "$BASE_URL/tours/your-tour-slug"

# Test 7: Contact Page
echo ""
echo "📞 Test 7: CONTACT PAGE"
test_endpoint "Trang liên hệ" "$BASE_URL/lien-he"

# Test 8: Static Pages
echo ""
echo "📋 Test 8: STATIC PAGES"
test_endpoint "Chính sách bảo mật" "$BASE_URL/chinh-sach-bao-mat"
test_endpoint "Chính sách hủy" "$BASE_URL/chinh-sach-huy-hoan-tien"
test_endpoint "Quy định chung" "$BASE_URL/chinh-sach-quy-dinh-chung"

# Summary
echo ""
echo "======================================"
echo -e "${GREEN}✅ KẾT THÚC TEST${NC}"
echo ""
echo -e "${YELLOW}📝 GHI CHÚ:${NC}"
echo "- Các test trên chỉ kiểm tra HTTP status"
echo "- Cần test thủ công booking flow với UI"
echo "- Kiểm tra console browser để debug"
echo ""
echo -e "${YELLOW}🧪 TEST THỦ CÔNG QUAN TRỌNG:${NC}"
echo "1. Mở $BASE_URL trong browser"
echo "2. Click vào 1 tour"
echo "3. Điền form booking"
echo "4. Submit và check database"
echo ""
echo -e "${GREEN}Happy Testing! 🚀${NC}"
