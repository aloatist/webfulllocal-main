#!/bin/bash

# 🧪 Simple Test Checker - Opens Prisma Studio
# Easier way to check test data

echo "🔍 Opening Prisma Studio to check test data..."
echo ""
echo "Instructions:"
echo "1. Prisma Studio will open in browser"
echo "2. Click on 'Homestay' table"
echo "3. Search for slug = 'test-homestay'"
echo "4. Check if it exists with correct data"
echo ""
echo "5. Click on 'HomestayRoom' table"
echo "6. Filter by homestayId (copy from Homestay)"
echo "7. Should see 1-2 rooms"
echo ""
echo "8. Click on 'HomestayAvailability' table"
echo "9. Filter by homestayId and status = 'BLOCKED'"
echo "10. Should see 5 rows (Nov 1-5) or 8 rows (after update)"
echo ""
echo "Opening Prisma Studio in 3 seconds..."
sleep 3

cd /Users/congtrinh/webfulllocal-main/conphung
npx prisma studio
